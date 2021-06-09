import { Auth, functions } from "../firebase";
import firebase from "firebase/app";
import { defineStore } from "pinia";

const registerUser = functions.httpsCallable("registerNewUser");

export interface State {
  user: firebase.User | null;
  claims: firebase.auth.IdTokenResult | null;
  error: any;
}

export const useAuthStore = defineStore({
  id: "auth",
  state(): State {
    return {
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
      return state.claims?.claims?.role === "admin";
    },
  },
  actions: {
    signInAction(email: string, password: string) {
      Auth.signInWithEmailAndPassword(email, password)
        .then(() => this.authAction())
        .catch((error) => (this.error = error));
    },
    signOutAction() {
      Auth.signOut()
        .then(() => (this.user = null))
        .catch((error) => (this.error = error));
    },
    authAction() {
      console.log("authAction called");
      Auth.onAuthStateChanged((user) => {
        console.log("auth state changed");
        console.log(user?.getIdTokenResult());
        console.log(this.isAdmin);
        if (user) {
          this.user = user;
          Auth.currentUser
            ?.getIdTokenResult()
            .then((idTokenResult) => (this.claims = idTokenResult))
            .then(() => console.log(this.isAdmin))
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
          Auth.signInWithEmailAndPassword(email, password).then(() =>
            this.authAction()
          );
        })
        .catch((error) => (this.error = error));
    },
  },
});
