<template>
  <div>
    <div>
      <input v-model="email" type="email" />
    </div>
    <div>
      <input v-model="password" type="password" />
    </div>
    <div>
      <input v-model="name" type="text" placeholder="name" />
    </div>
    <button type="submit" @click="login">Register</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { db } from "@/db";

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
    login(): void {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          function (user) {
            return user;
          },
          function (err) {
            alert(err.message);
            return err;
          }
        )
        .then((user) => {
          var userUid = user.user.uid;
          db.collection("users")
            .doc(userUid)
            .set({
              email: this.email,
              name: this.name,
              password: this.password,
              claims: {
                role: "user",
              },
            });
          return "ok";
        })
        .then(() => {
          console.log(firebase.auth().currentUser?.getIdTokenResult());
        });
    },
  },
});
</script>

<style lang="scss">
</style>
