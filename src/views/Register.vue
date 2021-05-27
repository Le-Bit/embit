<template>
  <div>
    <div>
      <label for="email">Email:</label>
      <input id="email" v-model="email" type="email" />
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
    <button type="submit" @click="register(name, email, password, invite)">
      Register
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";

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
    ...mapActions(["signUpAction", "signInAction"]),
    async register(
      name: string,
      email: string,
      password: string,
      inviteCode: string
    ): Promise<any> {
      this.signUpAction({ name, email, inviteCode, password });
    },
  },
});
</script>

<style lang="scss"></style>
