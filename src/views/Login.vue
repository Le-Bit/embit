<template>
  <div>
    <div>
      <input v-model="email" type="email" />
    </div>
    <div>
      <input v-model="password" type="password" />
    </div>
    <button type="submit" @click="login">Login</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { auth } from "@/firebase";

export default defineComponent({
  name: "Login",
  data: function () {
    return {
      email: "",
      name: "",
      password: "",
    };
  },
  methods: {
    async login(): Promise<any> {
      await auth.signInWithEmailAndPassword(this.email, this.password);
    },
  },
});
</script>

<style></style>
