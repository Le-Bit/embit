<template>
  <button id="generate" @click="generateInvite">Generate</button>
  <p>{{ this.getInvites.length }}</p>
  <div v-for="invite of this.getInvites" :key="invite.id">
    <p>{{ invite.id }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useInvitesStore, IInvite } from "@/store/invites";
import { mapActions, mapGetters } from "pinia";

export default defineComponent({
  name: "Invites",
  data: function () {
    return {
      invites: [] as IInvite[],
    };
  },
  computed: {
    ...mapGetters(useInvitesStore, ["getInvites"]),
  },
  mounted: function () {
    this.initInvites();
  },
  methods: {
    ...mapActions(useInvitesStore, ["initInvites", "generateInvite"]),
  },
});
</script>
