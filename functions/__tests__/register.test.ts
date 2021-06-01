import * as fbtest from "firebase-functions-test";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp({ projectId: "embit-dev" }, "embit-dev");
fbtest({ projectId: "embit-dev" }).mockConfig({
  emby: { url: "http://localhost", key: "fooo" },
  ombi: { key: "barr", url: "https://localhost" },
});

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

import * as myFunctions from "../src/index";

async function cleanAll() {
  await fbtest().firestore.clearFirestoreData({ projectId: "embit-dev" });
  await admin
    .auth()
    .listUsers()
    .then((elem) => {
      elem.users.forEach((user) => {
        admin.auth().deleteUser(user.uid);
      });
    });
}

async function createDummyAdminAccount() {
  mockedAxios.get.mockResolvedValue({
    data: { Items: [{ Name: "string_test1", Id: "3" }] },
  });
  mockedAxios.post.mockResolvedValue({
    data: { User: { Name: "string_test1", Id: "3" } },
  });
  const wrapped = fbtest().wrap(myFunctions.registerNewUser);
  await wrapped(
    {
      name: "string_test1",
      password: "manage007",
      email: "test1@example.com",
    },
    {}
  );
}

describe("account generation", () => {
  beforeAll(async () => {
    await cleanAll();
  });
  afterEach(async () => {
    await cleanAll();
  });

  const wrapped = fbtest().wrap(myFunctions.registerNewUser);
  async function wrappedRegisterNewUser(
    name: string | null,
    password: string | null,
    email: string | null,
    inviteCode: string | null,
    suffix: string
  ) {
    name += suffix;
    password += suffix;
    email += suffix;
    inviteCode += suffix;
    return await wrapped({ name, password, email, inviteCode }, {});
  }
  const name = "string_test1";
  const password = "manage007";
  const email = "test1@example.com";
  mockedAxios.get.mockRejectedValue("Network error: Something went wrong");
  mockedAxios.post.mockRejectedValue("Network error: Something went wrong");

  it("create a admin account", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        data: { Items: [{ Name: "string_test2", Id: "3" }] },
      })
      .mockResolvedValueOnce({
        data: { Items: [{ Name: "string_test1", Id: "3" }] },
      });

    mockedAxios.post.mockResolvedValue({
      data: { User: { Name: "string_test1", Id: "3" } },
    });

    const res = await wrappedRegisterNewUser(name, password, email, null, "");
    expect(res).toBe("user created");
  });

  it("dont create a account with a bad invite code", async () => {
    await createDummyAdminAccount();
    mockedAxios.post.mockResolvedValue({
      data: { User: { Name: "string_test2", Id: "3" } },
    });
    mockedAxios.get.mockResolvedValue({
      data: { Items: [{ Name: "string_test2", Id: "3" }] },
    });
    const res = await wrappedRegisterNewUser(name, password, email, "2", "2");

    expect(res).toBe("invite code invalid");
  });

  it("dont create a account with a used invite code", async () => {
    await createDummyAdminAccount();

    admin.firestore().collection("invites").doc("testInvite2").set({
      used: true,
      usedBy: "otherUser",
    });

    mockedAxios.post.mockResolvedValue({
      data: { User: { Name: "string_test2", Id: "2" } },
    });
    mockedAxios.get.mockResolvedValue({
      data: { Items: [{ Name: "string_test2", Id: "2" }] },
    });
    const res = await wrapped(
      {
        name: "string_test2",
        password: "manage007",
        email: "test2@example.com",
        inviteCode: "testInvite2",
      },
      {}
    );

    expect(res).toBe("invite code invalid");
  });

  it("create an account with an invite code", async () => {
    await createDummyAdminAccount();

    admin.firestore().collection("invites").doc("testInvite2").set({
      used: false,
    });

    mockedAxios.post.mockResolvedValue({
      data: { User: { Name: "string_test2", Id: "2" } },
    });
    mockedAxios.get.mockResolvedValue({
      data: { Items: [{ Name: "string_test2", Id: "2" }] },
    });
    const res = await wrapped(
      {
        name: "string_test2",
        password: "manage007",
        email: "test2@example.com",
        inviteCode: "testInvite2",
      },
      {}
    );

    expect(res).toBe("user exist");
  });
});
