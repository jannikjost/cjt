import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/overview",
    name: "Overview",
    component: () => import("../views/Overview.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
