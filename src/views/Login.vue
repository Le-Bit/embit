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
import firebase from "firebase/app";
import "firebase/auth";

import { db } from "@/db";

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
    login(): any {
      console.log(this.email, this.password);
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          function (user) {
            console.log(user);
            return user;
          },
          function (err) {
            console.log(err);
            return err;
          }
        )
        .then(() => {
          console.log(firebase.auth().currentUser?.getIdTokenResult());
        });
    },
  },
});
</script>

<style></style>
