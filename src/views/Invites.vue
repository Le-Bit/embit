<template>
  <p>{{ this.getInvites.length }}</p>
  <div v-for="invite of this.getInvites" :key="invite.id">
    <p>{{ invite.id }}</p>
  </div>
  <button id="generate" @click="generate">Generate</button>
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
    ...mapGetters(["getInvites"]),
  },
  mounted: function () {
    this.initInvites();
  },
  methods: {
    ...mapActions(["initInvites"]),
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
