<template>
  <div>
    <div>
      <input v-model="email" type="email" />
    </div>
    <div>
      <input v-model="password" type="password" />
    </div>
    <button type="submit" @click="login(email, password)">Login</button>
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
      password: "",
    };
  },
  methods: {
    async login(email: string, password: string): Promise<any> {
      try {
        await auth.signInWithEmailAndPassword(email, password);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
</script>

<style></style>
