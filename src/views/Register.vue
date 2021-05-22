<template>
  <div>
    <div>
      <label for="email">Email:</label>
      <input v-model="email" type="email" />
    </div>
    <div>
      <label for="invite">Code d'invitation:</label>
      <input
        v-model="invite"
        type="text"
        id="invite"
        placeholder="Code d'invitation"
      />
    </div>
    <div>
      <label for="name">Mot de passe:</label>
      <input v-model="password" id="password" type="password" />
    </div>
    <div>
      <label for="name">Name:</label>
      <input v-model="name" id="name" type="text" placeholder="name" />
    </div>
    <button type="submit" @click="login">Register</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/firebase";
import { checkInvite, registerUser } from "@/functions";

export default defineComponent({
  name: "Register",
  data: function () {
    return {
      name: "",
      email: "",
      password: "",
      invite: "",
    };
  },
  methods: {
    async login(): Promise<void> {
      try {
        await registerUser({
          email: this.email,
          name: this.name,
          inviteCode: this.invite,
          password: this.password,
        });
      } catch (error) {
        alert(error.message);
      }
    },
  },
});
</script>

<style lang="scss"></style>
