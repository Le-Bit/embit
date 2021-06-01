import * as fbtest from "firebase-functions-test";
import * as admin from "firebase-admin";

admin.initializeApp({ projectId: "embit-dev" }, "embit-dev");
fbtest({ projectId: "embit-dev" });

import * as myFunctions from "../src/index";

const wrapped = fbtest().wrap(myFunctions.generateInvite);
async function wrappedGenerateInvite(role: string | null) {
  return await wrapped({}, { auth: { token: { role } } });
}

describe("generateInvite", () => {
  it("Cannot create invite if not an admin", async () => {
    try {
      await wrappedGenerateInvite(null);
    } catch (error) {
      expect(error.message).toBe("Not authorized");
    }
  });

  it("Cannot create invite if not an admin with a user token", async () => {
    try {
      await wrappedGenerateInvite("user");
    } catch (error) {
      expect(error.message).toBe("Not authorized");
    }
  });

  it("Can create invite if an admin", async () => {
    wrappedGenerateInvite("admin").then((res) => {
      expect(res).toBe("invite generated");
    });
  });
});
