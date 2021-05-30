<template>
  <div>
    <div>
      <input v-model="email" type="email" />
    </div>
    <div>
      <input v-model="password" type="password" />
    </div>
    <button type="submit" @click="login(email, password)">Login</button>
    <button type="submit" @click="logout()">Logout</button>
  </div>
  <div v-if="isUserAuth">
    <p>coucou</p>
    <p>{{ this.getUser }}</p>
    <p>{{ this.isAdmin }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "Login",
  data: function () {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    ...mapGetters(["getUser", "isUserAuth", "isAdmin"]),
  },
  mounted: function () {
    this.authAction();
  },
  methods: {
    ...mapActions(["signOutAction", "signInAction", "authAction"]),
    login(email: string, password: string) {
      this.signInAction({ email, password });
    },
    logout() {
      this.signOutAction();
    },
  },
});
</script>

<style></style>
