import axios from "axios";
import * as functions from "firebase-functions";

//
//TODO remove call to firestore from this function
export async function embyAuthenticateUser(id: string, password: string) {
  const result = await axios.post(
    `${
      functions.config().emby.url
    }/emby/Users/${id}/Authenticate?X-Emby-Client=Embit&X-Emby-Device-Name=EmbitServer&X-Emby-Device-Id=CloudFunction&X-Emby-Client-Version=NA`,
    {
      Pw: password,
    }
  );
  return result.data;
}

export async function embyCreateUser(name: string) {
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

export async function embyUsernameExist(name: string) {
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

export async function embyUpdatePassword(
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
