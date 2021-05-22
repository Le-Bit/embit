import { functions } from "@/firebase";

const _checkInvite = functions.httpsCallable("checkInvite");
export const registerUser = functions.httpsCallable("registerNewUser");
export const generateInvite = functions.httpsCallable("generateInvite");

interface IInvite {
  invite: string;
}
export const checkInvite = function (invite: IInvite): Promise<any> {
  return _checkInvite(invite);
};
