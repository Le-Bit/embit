import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { useAuthStore } from "../store/auth";

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "Home", component: () => import("../views/Home.vue") },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    beforeEnter: (to, from) => {
      const store = useAuthStore();
      return !store.isUserAuth;
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    beforeEnter: (to, from) => {
      const store = useAuthStore();
      return !store.isUserAuth;
    },
  },
  {
    path: "/admin/invites",
    name: "Invites",
    component: () => import("../views/Invites.vue"),
    beforeEnter: (to, from) => {
      const store = useAuthStore();
      return store.isAdmin;
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
