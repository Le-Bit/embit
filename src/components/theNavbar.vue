<template>
  <header id="nav">
    <nav>
      <span class="material-icons">menu</span>
      <router-link to="/">Home</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
      <router-link to="/admin/invites">Invites</router-link>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TheNavBar",
});
</script>
<style scoped lang="scss"></style>
