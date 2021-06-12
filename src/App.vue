<template>
  <the-nav-bar />
  <router-view />
  <the-toast />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "pinia";
import { useAuthStore } from "./store/auth";
import TheNavBar from "./components/theNavbar.vue";
import TheToast from "./components/TheToast.vue";

export default defineComponent({
  name: "App",
  components: {
    TheNavBar,
    TheToast,
  },
  data: function () {
    return {
      toast: false,
    };
  },
  mounted: function () {
    this.authAction();
  },
  methods: {
    ...mapActions(useAuthStore, ["authAction"]),
  },
});
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
body {
  margin: 0px;
  background: linear-gradient(hsl(315, 62%, 73%), hsl(270, 62%, 73%));
  height: 100vh;
}
</style>
