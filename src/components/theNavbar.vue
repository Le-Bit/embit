<template>
  <header id="nav">
    <nav>
      <router-link class="nav-link" to="/admin/invites">Invites</router-link>
      <router-link class="nav-link" to="/">Home</router-link>
      <router-link class="nav-link" to="/register">Register</router-link>
      <router-link to="/login">
        <div class="login-button">Login</div>
      </router-link>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TheNavBar",
});
</script>

<style scoped lang="scss">
header {
  position: sticky;
  font-size: 1.15em;
  margin: 8px 8px 8px 0px;
  top: 8px;
  height: 48px;
  border-radius: 0px 32px 32px 0px;
  text-align: right;
  background-color: white;
  box-shadow: 0 2px 5px 1px rgba(64, 60, 67, 0.16);
  font-family: montserrat, sans-serif;

  .login-button {
    display: inline-block;
    background-color: hsl(240, 62%, 73%);
    margin: 8px;
    padding: 4px;
    border-radius: 4px;
    color: white;
    text-decoration: none;
    margin-right: 16px;
  }

  .nav-link {
    padding: 4px 4px;
    text-decoration: none;
    position: relative;
    width: max-content;
  }

  .nav-link::after {
    content: "";
    background: hsl(315, 62%, 73%);
    position: absolute;
    width: calc(100% - 8px);
    left: 4px;
    bottom: 0px;
    height: 4px;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 500ms ease;
  }

  .router-link-active::after {
    content: "";
    transform-origin: left;
    transform: scaleX(1);
  }
}
</style>
