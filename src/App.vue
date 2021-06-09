<template>
  <the-nav-bar />
  <button @click="setError('lol')">ToggleToast</button>
  <router-view />
  <the-toast />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "pinia";
import { useAuthStore } from "./store/auth";
import { useToastStore } from "./store/toast";
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
    ...mapActions(useToastStore, ["setError"]),
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
