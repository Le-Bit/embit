import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { store } from "@/store";

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "Home", component: () => import("../views/Home.vue") },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/admin/invites",
    name: "Invites",
    component: () => import("../views/Invites.vue"),
    beforeEnter: (to, from) => store.getters.isAdmin,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
