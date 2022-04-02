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
    // route level code-splitting
    // this generates a separate chunk (overview.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "overview" */ "../views/Overview.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () =>
      import(/* webpackChunkName: "settings" */ "../views/Settings.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
