<template>
  <p>{{ this.invites.length }}</p>
  <div v-for="invite of this.invites" :key="invite.id">
    <p>{{ invite.id }}</p>
  </div>
  <button id="generate" @click="generate">Generate</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { db } from "@/firebase";
import { generateInvite } from "@/functions";
import { IInvite } from "@/store";

export default defineComponent({
  name: "Invites",
  data: function () {
    return {
      invites: [] as IInvite[],
    };
  },
  created: async function () {
    try {
      const ref = db.collection("invites").where("used", "==", false);

      ref.onSnapshot((querySnapshot) => {
        this.invites = [];
        querySnapshot.forEach((doc) => {
          const invite = { ...doc.data(), id: doc.id } as IInvite;
          this.invites.push(invite as never);
        });
      });
    } catch (error) {
      console.error(error.message);
    }
  },
  methods: {
    generate: async function (): Promise<any> {
      try {
        return await generateInvite();
      } catch (error) {
        return error;
      }
    },
  },
});
</script>
