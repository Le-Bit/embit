import axios from "axios";
import * as functions from "firebase-functions";

export async function ombiCreateUser() {
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
