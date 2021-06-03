<template>
  <the-nav-bar />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "pinia";
import { useAuthStore } from "@/store/auth";
import TheNavBar from "@/components/theNavbar.vue";

export default defineComponent({
  name: "App",
  components: {
    TheNavBar,
  },
  mounted: function () {
    this.authAction();
  },
  methods: {
    ...mapActions(useAuthStore, ["authAction"]),
  },
});
</script>

<style lang="scss"></style>
