import { auth, db } from "@/firebase";
import { registerUser } from "../functions";
import { defineStore } from "pinia";

export interface IInvite {
  id: string;
  used: boolean;
  usedBy?: string;
}

export interface State {
  invites: IInvite[];
  user: any;
  claims: any;
  error: any;
}

export const useStore = defineStore({
  id: "store",
  state(): State {
    return {
      invites: [],
      user: null,
      claims: null,
      error: null,
    };
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getError(state) {
      return state.error;
    },
    isUserAuth(state) {
      return !!state.user;
    },
    isAdmin(state) {
      return state.claims?.role === "admin";
    },
    getInvites: function (state) {
      return state.invites;
    },
  },
  actions: {
    signInAction(email: string, password: string) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((response) => (this.user = response))
        .catch((error) => (this.error = error));
    },
    signOutAction() {
      auth
        .signOut()
        .then(() => (this.user = null))
        .catch((error) => (this.error = error));
    },
    authAction() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.user = user;
          auth.currentUser
            ?.getIdTokenResult()
            .then((idTokenResult) => (this.claims = idTokenResult.claims))
            .catch((error) => (this.error = error));
        } else {
          this.user = null;
          this.claims = null;
        }
      });
    },
    signUpAction(
      email: string,
      password: string,
      inviteCode: string,
      name: string
    ) {
      registerUser({ email, password, inviteCode, name })
        .then(() => {
          auth
            .signInWithEmailAndPassword(email, password)
            .then((response) => (this.user = response));
        })
        .catch((error) => (this.error = error));
    },
    initInvites() {
      const ref = db.collection("invites").where("used", "==", false);

      ref.onSnapshot((querySnapshot) => {
        this.invites = [];
        querySnapshot.forEach((doc) => {
          const invite = { ...doc.data(), id: doc.id } as IInvite;
          this.invites.push(invite);
        });
      });
    },
  },
});
