import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import DocumentList from "@/views/DocumentList.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/docs",
    name: "DocumentList",
    component: DocumentList,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
