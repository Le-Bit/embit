import { createStore, Store } from "vuex";
import { db } from "@/firebase";
import { InjectionKey } from "vue";

export interface IInvite {
  id: string;
  used: boolean;
  usedBy?: string;
}

export interface State {
  invites: IInvite[];
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    invites: [],
  },
  mutations: {
    getInvitescmt(state, payload) {
      state.invites = [];
      state.invites = payload;
    },
  },
  getters: {
    getInvites: function (state) {
      return state.invites;
    },
  },
  actions: {
    fetchInvites(context) {
      const invites: IInvite[] = [];
      const ref = db.collection("invites");

      ref.onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const invite = { ...doc.data(), id: doc.id } as any;
          invites.push(invite as never);
          context.commit("getInvitescmt");
        });
      });
    },
  },
  modules: {},
});
