<template>
  <button @click="generate">Generate</button>
  <p>{{ this.invites.length }}</p>
  <div v-for="invite of this.invites" :key="invite.id">
    <p>{{ invite.id }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { db } from "@/firebase";
import { generateInvite } from "@/functions";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "Invites",
  data: function () {
    return {
      invites: [],
    };
  },
  computed: {
    ...mapGetters(["getInvites"]),
  },
  created: async function () {
    await this.$store.dispatch("fetchInvites");
    const ref = db.collection("invites").where("used", "==", false);

    ref.onSnapshot((querySnapshot) => {
      this.invites = [];
      querySnapshot.forEach((doc) => {
        const invite = { ...doc.data(), id: doc.id } as any;
        this.invites.push(invite as never);
      });
    });
  },
  methods: {
    generate: async function () {
      console.log("invite generation");
      try {
        await generateInvite();
      } catch (error) {
        alert(error.message);
      }
    },
  },
});
</script>
