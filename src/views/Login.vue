<template>
  <div>
    <div>
      <input v-model="email" type="email" />
    </div>
    <div>
      <input v-model="password" type="password" />
    </div>
    <button type="submit" @click="login(email, password)">Login</button>
    <button type="submit" @click="logout()">Login</button>
  </div>
  <p>{{ this.getUser }}</p>
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
    ...mapGetters(["getUser", "isUserAuth"]),
  },
  methods: {
    ...mapActions(["signOutAction", "signInAction"]),
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
