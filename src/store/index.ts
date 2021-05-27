import { createStore, Store } from "vuex";
import { auth } from "@/firebase";
import { registerUser } from "../functions";
import { InjectionKey } from "vue";

export interface IInvite {
  id: string;
  used: boolean;
  usedBy?: string;
}

export interface State {
  invites: IInvite[];
  user: any;
  error: any;
}

export const key: InjectionKey<Store<State>> = Symbol();

const initialState = (): State => {
  return {
    invites: [],
    user: null,
    error: null,
  };
};
export const store = createStore<State>({
  state: initialState(),
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
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
    getInvites: function (state) {
      return state.invites;
    },
  },
  actions: {
    signInAction({ commit }, payload) {
      auth
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then((response) => {
          commit("setUser", response);
        })
        .catch((error) => {
          commit("setError", error);
        });
    },
    signOutAction({ commit }) {
      auth
        .signOut()
        .then(() => {
          commit("setUser", null);
        })
        .catch((error) => {
          commit("setError", error);
        });
    },
    authAction({ commit }) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          commit("setUser", user);
        } else {
          commit("setUser", null);
        }
      });
    },
    signUpAction({ commit, dispatch }, payload) {
      registerUser({
        email: payload.email,
        password: payload.password,
        inviteCode: payload.inviteCode,
        name: payload.name,
      })
        .then((response) => {
          commit("setUser", response);
        })
        .catch((error) => {
          commit("setError", error);
        });
    },
  },
  modules: {},
});
