import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { functions, db } from "../firebase";

const generateInvite = functions.httpsCallable("generateInvite");

export interface IInvite {
  id: string;
  used: boolean;
  usedBy?: string;
}

export interface State {
  invites: IInvite[];
}

export const useInvitesStore = defineStore({
  id: "invites",
  state(): State {
    return {
      invites: [],
    };
  },
  getters: {
    getInvites: function (state) {
      return state.invites;
    },
  },
  actions: {
    initInvites() {
      const auth = useAuthStore();
      if (auth.isAdmin) {
        const ref = db.collection("invites").where("used", "==", false);

        ref.onSnapshot((querySnapshot) => {
          this.invites = [];
          querySnapshot.forEach((doc) => {
            const invite = { ...doc.data(), id: doc.id } as IInvite;
            this.invites.push(invite);
          });
        });
      }
    },
    generateInvite() {
      const auth = useAuthStore();
      if (auth.isAdmin) {
        try {
          generateInvite();
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
});
