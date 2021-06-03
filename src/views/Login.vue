<template>
  <div>
    <div>
      <input v-model="email" type="email" />
    </div>
    <div>
      <input v-model="password" type="password" />
    </div>
    <button type="submit" @click="signInAction(email, password)">Login</button>
    <button type="submit" @click="signOutAction()">Logout</button>
  </div>
  <div v-if="isUserAuth">
    <p>coucou</p>
    <p>{{ this.getUser }}</p>
    <p>{{ this.isAdmin }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "pinia";
import { useAuthStore } from "@/store/auth";

export default defineComponent({
  name: "Login",
  data: function () {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    ...mapGetters(useAuthStore, ["getUser", "isUserAuth", "isAdmin"]),
  },
  methods: {
    ...mapActions(useAuthStore, ["signOutAction", "signInAction"]),
  },
});
</script>

<style></style>
