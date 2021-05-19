import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

async function createUser(name: string, password: string) {
  const embyUser = await createEmbyUser(name);
  await createOmbiUser();
  await updateEmbyPassword(password, embyUser.Id);
}

async function createOmbiUser() {
  await axios.post(
    functions.config().ombi.url + "/api/v1/Job/embyUserImporter/",
    {},
    {
      headers: {
        ApiKey: functions.config().ombi.key,
      },
    }
  );
}

async function createEmbyUser(name: string) {
  await axios.post(
    functions.config().emby.url +
      "/emby/Users/New?X-Emby-Token=" +
      functions.config().emby.key,
    {
      Name: name,
    }
  );
  return embyUsernameExist(name);
}

async function embyUsernameExist(name: string) {
  const response = await axios.get(
    functions.config().emby.url +
      "/emby/Users/Query?api_key=" +
      functions.config().emby.key
  );
  const users = response.data.Items;
  const userExist = users.filter((e: any) => e.Name === name);
  return userExist[0]?.Name === name ? userExist[0] : undefined;
}

async function isInviteValid(invite: string, user: string): Promise<boolean> {
  const inviteRef = admin.firestore().collection("invites").doc(invite);
  //TODO unhandled error if invite is undefined
  const doc = await inviteRef.get();
  if (doc.exists && !doc.data()?.used) {
    inviteRef.update({ used: true, usedBy: user });
    return true;
  } else if (doc?.data()?.used) {
    return false;
  }
  return false;
}

async function updateEmbyPassword(
  password: string,
  id: string
): Promise<boolean> {
  await axios.post(
    `${functions.config().emby.url}/emby/Users/${id}/Password?X-Emby-Token=${
      functions.config().emby.key
    }`,
    {
      resetPassword: true,
    }
  );
  await axios.post(
    `${functions.config().emby.url}/emby/Users/${id}/Password?X-Emby-Token=${
      functions.config().emby.key
    }`,
    {
      CurrentPw: "",
      NewPw: password,
    }
  );
  return true;
}

export const generateInvite = functions.https.onRequest((request, response) => {
  try {
    admin
      .firestore()
      .collection("invites")
      .doc()
      .set({
        used: false,
      })
      .then(() => {
        response.send("invite generated");
      });
  } catch (error) {
    console.error(error);
    response.status(500).send(error.message);
  }
});

export const registerNewUser = functions.https.onRequest(
  async (request, response) => {
    try {
      const data = request.body;
      const invite = await isInviteValid(data.inviteCode, data.name);
      const embyUser = await embyUsernameExist(data.name);
      if (invite && embyUser) {
        await updateEmbyPassword(data.password, embyUser.Id);
        response.send("user exist");
      } else if (invite) {
        await createUser(data.name, data.password);
        response.send("user created");
      } else {
        response.status(401).send("invite code invalid");
      }
    } catch (error) {
      console.error(error);
      response.status(500).send(error.message);
    }
  }
);

export const newUser = functions.auth.user().onCreate((user) => {
  functions.logger.info("registering new User", { structuredData: true });
  functions.logger.info(user.toJSON(), { structuredData: true });
  admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .set({ admin: false, email: user.email });
});
