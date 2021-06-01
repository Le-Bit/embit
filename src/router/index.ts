import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { useStore } from "@/store/pinia";

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
    beforeEnter: (to, from) => {
      const store = useStore();
      return store.isAdmin;
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
