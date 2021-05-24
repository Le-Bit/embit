import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

exports.claims = require("./sync");

async function createUser(name: string, password: string) {
  const embyUser = await createEmbyUser(name);
  await createOmbiUser();
  await updateEmbyPassword(password, embyUser.Id);
  return embyUser;
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

async function authenticateUserWithEmby(
  id: string,
  password: string,
  name: string
) {
  const result = await axios.post(
    `${
      functions.config().emby.url
    }/emby/Users/${id}/Authenticate?X-Emby-Client=Embit&X-Emby-Device-Name=EmbitServer&X-Emby-Device-Id=CloudFunction&X-Emby-Client-Version=NA`,
    {
      Pw: password,
    }
  );
  await admin
    .firestore()
    .collection("users")
    .doc(name)
    .update({ emby: result.data });
  return result;
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
  //TODO remove Any
  const userExist = users.filter((e: any) => e.Name === name);
  return userExist[0]?.Name === name ? userExist[0] : undefined;
}

async function isInviteValid(invite: string, user: string): Promise<boolean> {
  try {
    const inviteRef = admin.firestore().collection("invites").doc(invite);
    const doc = await inviteRef.get();
    if (doc.exists && !doc.data()?.used) {
      inviteRef.update({ used: true, usedBy: user });
      return true;
    } else if (doc?.data()?.used) {
      return false;
    }
    return false;
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Invite non valide");
  }
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

const createFBAuthUser = async function (
  displayName: string,
  password: string,
  email: string
) {
  return admin.auth().createUser({
    email,
    emailVerified: false,
    password,
    displayName,
    disabled: false,
    uid: displayName,
  });
};

const createFBUser = async function (
  name: string,
  email: string,
  //TODO remove any
  embyUser: any
) {
  const coll = await admin.firestore().collection("users").get();
  const isAdmin = coll.size === 0 ? "admin" : "user";
  await admin
    .firestore()
    .collection("users")
    .doc(name)
    .set({
      name,
      email,
      emby: { User: embyUser },
    });
  await admin.firestore().collection(`users/${name}/claims`).doc(name).set({
    role: isAdmin,
  });
};

export const generateInvite = functions.https.onCall((data, context) => {
  if (!(context?.auth?.token?.role === "admin")) {
    throw new functions.https.HttpsError("permission-denied", "Not authorized");
  }
  try {
    admin
      .firestore()
      .collection("invites")
      .doc()
      .set({
        used: false,
      })
      .then(() => {
        return "invite generated";
      });
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

export const registerNewUser = functions.https.onCall(async (data, context) => {
  try {
    const coll = await admin.firestore().collection("users").get();
    const isFirst = coll.size === 0;
    let invite: any;
    if (!isFirst) {
      invite = await isInviteValid(data.inviteCode, data.name);
    }
    const embyUser = await embyUsernameExist(data.name);
    if ((isFirst || invite) && embyUser) {
      await updateEmbyPassword(data.password, embyUser.Id);
      await Promise.all([
        createFBAuthUser(data.name, data.password, data.email),
        createFBUser(data.name, data.email, embyUser),
        authenticateUserWithEmby(embyUser.Id, data.password, data.name),
      ]);
      return "user exist";
    } else if (isFirst || invite) {
      const newEmbyUser = await createUser(data.name, data.password);
      await Promise.all([
        createFBAuthUser(data.name, data.password, data.email),
        createFBUser(data.name, data.email, newEmbyUser),
        authenticateUserWithEmby(newEmbyUser.Id, data.password, data.name),
      ]);
      return "user created";
    } else {
      return "invite code invalid";
    }
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
