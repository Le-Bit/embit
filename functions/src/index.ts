import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ombiCreateUser } from "./ombi";
import {
  embyAuthenticateUser,
  embyCreateUser,
  embyUsernameExist,
  embyUpdatePassword,
} from "./emby";

if (process.env.TEST_ENV == "jest") {
  admin.initializeApp(
    {
      projectId: "fakeproject",
    },
    "fakeproject"
  );
} else {
  admin.initializeApp();
}

exports.claims = require("./sync");

async function serverCreateUser(name: string, password: string) {
  const embyUser = await embyCreateUser(name);
  await ombiCreateUser();
  await embyUpdatePassword(password, embyUser.Id);
  return embyUser;
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
    console.error(error.message);
    throw new functions.https.HttpsError("internal", error.message);
  }
}

const firebaseAuthCreateUser = async function (
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

const firestoreCreateUser = async function (
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

const firestoreAddEmbyToken = async function (embyUser: any, name: string) {
  await admin
    .firestore()
    .collection("users")
    .doc(name)
    .update({ emby: embyUser });
};

//TODO remove any, deconstruct data object
const createUser = async function (data: any, embyUser: any) {
  await Promise.all([
    firebaseAuthCreateUser(data.name, data.password, data.email),
    firestoreCreateUser(data.name, data.email, embyUser),
    embyAuthenticateUser(embyUser.Id, data.password),
  ]);
  await firestoreAddEmbyToken(embyUser, data.name);
};

//TODO For all Oncall Type data and context, do check on input then call function
export const registerNewUser = functions.https.onCall(async (data, context) => {
  try {
    const coll = await admin.firestore().collection("users").get();
    const isFirst = coll.size === 0;
    //TODO remove any
    let invite: any;
    if (!isFirst) {
      invite = await isInviteValid(data.inviteCode, data.name);
    }
    const embyUser = await embyUsernameExist(data.name);
    if ((isFirst || invite) && embyUser) {
      await embyUpdatePassword(data.password, embyUser.Id);
      await createUser(data, embyUser);
      return "user exist";
    } else if (isFirst || invite) {
      const newEmbyUser = await serverCreateUser(data.name, data.password);
      await createUser(data, newEmbyUser);
      return "user created";
    } else {
      return "invite code invalid";
    }
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

export const generateInvite = functions.https.onCall((data, context) => {
  if (!(context?.auth?.token?.role === "admin")) {
    throw new functions.https.HttpsError("permission-denied", "Not authorized");
  }
  try {
    admin.firestore().collection("invites").doc().set({ used: false });
    return "invite generated";
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
