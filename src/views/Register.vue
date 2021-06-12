<template>
  <form>
    <div class="form__elem">
      <label for="name">Name:</label>
      <input v-model="name" id="name" type="text" placeholder="Pseudo" />
    </div>
    <div class="form__elem">
      <label for="email">Email:</label>
      <input id="email" v-model="email" type="email" placeholder="email" />
    </div>
    <div class="form__elem">
      <label for="name">Mot de passe:</label>
      <input
        v-model="password"
        id="password"
        type="password"
        placeholder="password"
      />
    </div>
    <div class="form__elem">
      <label for="invite">Code d'invitation:</label>
      <input
        v-model="invite"
        type="text"
        id="invite"
        placeholder="Code d'invitation"
      />
    </div>
    <button type="submit" @click="signUpAction(email, password, invite, name)">
      Register
    </button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "pinia";
import { useAuthStore } from "../store/auth";

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
    ...mapActions(useAuthStore, ["signUpAction"]),
  },
});
</script>

<style scoped lang="scss"></style>
