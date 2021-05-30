<template>
  <button id="generate" @click="generate">Generate</button>
  <p>{{ this.getInvites.length }}</p>
  <div v-for="invite of this.getInvites" :key="invite.id">
    <p>{{ invite.id }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { generateInvite } from "@/functions";
import { IInvite } from "@/store";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "Invites",
  data: function () {
    return {
      invites: [] as IInvite[],
    };
  },
  computed: {
    ...mapGetters(["getInvites", "isAdmin"]),
  },
  mounted: function () {
    if (this.isAdmin) {
      this.initInvites();
    }
  },
  methods: {
    ...mapActions(["initInvites"]),
    generate: function () {
      try {
        generateInvite();
      } catch (error) {
        console.error(error);
      }
    },
  },
});
</script>
