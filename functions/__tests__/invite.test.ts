import * as fbtest from "firebase-functions-test";
import * as admin from "firebase-admin";

fbtest({ projectId: "fakeproject" });
admin.initializeApp({ projectId: "fakeproject" });

import * as myFunctions from "../src/index";

test("Cannot create invite if not an admin", () => {
  try {
    fbtest().wrap(myFunctions.generateInvite);
  } catch (error) {
    expect(error.message).toBe("Not authorized");
  }
});

test("Cannot create invite if not an admin with a user token", () => {
  try {
    const wrapped = fbtest().wrap(myFunctions.generateInvite);
    wrapped(
      {},
      {
        auth: {
          token: {
            role: "user",
          },
        },
      }
    );
    admin
      .firestore()
      .collection("invites")
      .get()
      .then((invites: any) => {
        expect(invites.size).toBe(1);
      });
  } catch (error) {
    expect(error.message).toBe("Not authorized");
  }
});

test("Can create invite if an admin", () => {
  const wrapped = fbtest().wrap(myFunctions.generateInvite);
  const res = wrapped(
    {},
    {
      auth: {
        token: {
          role: "admin",
        },
      },
    }
  );
  expect(res).toBe("invite generated");
});

//TODO register admin account
//TODO login with admin account
//TODO generate Invite
//TODO register regular account
//TODO login with regular account
