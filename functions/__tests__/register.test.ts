import * as fbtest from "firebase-functions-test";
import * as admin from "firebase-admin";
import axios from "axios";

fbtest({ projectId: "fakeproject" }).mockConfig({
  emby: { url: "http://localhost", key: "fooo" },
  ombi: { key: "barr", url: "https://localhost" },
});
admin.initializeApp({ projectId: "fakeproject" });

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

import * as myFunctions from "../src/index";

async function cleanAll() {
  fbtest().firestore.clearFirestoreData({ projectId: "fakeproject" });
  admin
    .auth()
    .listUsers()
    .then((elem) => {
      elem.users.forEach((user) => {
        admin.auth().deleteUser(user.uid);
      });
    });
}

beforeAll(async () => {
  cleanAll();
});

describe("account generation", () => {
  it("create a admin account", async () => {
    mockedAxios.get.mockRejectedValue("Network error: Something went wrong");
    mockedAxios.post.mockRejectedValue("Network error: Something went wrong");
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
    const wrapped = fbtest().wrap(myFunctions.registerNewUser);
    const res = await wrapped(
      {
        name: "string_test1",
        password: "manage007",
        email: "test1@example.com",
      },
      {}
    );
    expect(res).toBe("user created");
  });

  it("create a admin account with invite code", async () => {
    admin.firestore().collection("invites").doc("testInvite").set({
      used: false,
    });
    mockedAxios.get.mockRejectedValue("Network error: Something went wrong");
    mockedAxios.post.mockRejectedValue("Network error: Something went wrong");
    mockedAxios.get.mockResolvedValue({
      data: { Items: [{ Name: "string_test2", Id: "3" }] },
    });
    mockedAxios.post.mockResolvedValue({
      data: { User: { Name: "string_test2", Id: "3" } },
    });
    const wrapped = fbtest().wrap(myFunctions.registerNewUser);
    const res = await wrapped(
      {
        name: "string_test2",
        password: "manage007",
        email: "test2@example.com",
        inviteCode: "testInvite",
      },
      {}
    );
    expect(res).toBe("user exist");
  });

  it("dont create a admin account with a bad invite code", async () => {
    admin.firestore().collection("invites").doc("testInvite").set({
      used: false,
    });
    mockedAxios.get.mockRejectedValue("Network error: Something went wrong");
    mockedAxios.post.mockRejectedValue("Network error: Something went wrong");
    mockedAxios.get.mockResolvedValue({
      data: { Items: [{ Name: "string_test3", Id: "3" }] },
    });
    mockedAxios.post.mockResolvedValue({
      data: { User: { Name: "string_test3", Id: "3" } },
    });
    const wrapped = fbtest().wrap(myFunctions.registerNewUser);
    await wrapped(
      {
        name: "string_test3",
        password: "manage007",
        email: "test3@example.com",
        inviteCode: "testInvite",
      },
      {}
    );

    mockedAxios.get.mockRejectedValue("Network error: Something went wrong");
    mockedAxios.post.mockRejectedValue("Network error: Something went wrong");
    mockedAxios.get.mockResolvedValue({
      data: { Items: [{ Name: "string_test4", Id: "3" }] },
    });
    mockedAxios.post.mockResolvedValue({
      data: { User: { Name: "string_test4", Id: "3" } },
    });
    const wrapped2 = fbtest().wrap(myFunctions.registerNewUser);
    const res = await wrapped2(
      {
        name: "string_test4",
        password: "manage007",
        email: "test4@example.com",
        inviteCode: "teddstInvite",
      },
      {}
    );
    expect(res).toBe("invite code invalid");
  });

  it("dont create a admin account with a used invite code", async () => {
    admin.firestore().collection("invites").doc("testInvite2").set({
      used: false,
    });
    mockedAxios.get.mockRejectedValue("Network error: Something went wrong");
    mockedAxios.post.mockRejectedValue("Network error: Something went wrong");
    mockedAxios.get.mockResolvedValue({
      data: { Items: [{ Name: "string_test5", Id: "3" }] },
    });
    mockedAxios.post.mockResolvedValue({
      data: { User: { Name: "string_test5", Id: "3" } },
    });
    const wrapped = fbtest().wrap(myFunctions.registerNewUser);
    await wrapped(
      {
        name: "string_test5",
        password: "manage007",
        email: "test5@example.com",
        inviteCode: "testInvite2",
      },
      {}
    );

    mockedAxios.get.mockRejectedValue("Network error: Something went wrong");
    mockedAxios.post.mockRejectedValue("Network error: Something went wrong");
    mockedAxios.get.mockResolvedValue({
      data: { Items: [{ Name: "string_test6", Id: "3" }] },
    });
    mockedAxios.post.mockResolvedValue({
      data: { User: { Name: "string_test6", Id: "3" } },
    });
    const wrapped2 = fbtest().wrap(myFunctions.registerNewUser);
    const res = await wrapped2(
      {
        name: "string_test6",
        password: "manage007",
        email: "test6@example.com",
        inviteCode: "testInvite2",
      },
      {}
    );
    expect(res).toBe("invite code invalid");
  });
});
