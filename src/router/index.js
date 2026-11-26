import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/views/Home.vue")
    },
    {
      path: "/encantamientos",
      component: () => import("@/views/Encantamientos.vue")
    },
    {
      path: "/guardados",
      component: () => import("@/views/Guardados.vue")
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/NotFound.vue")
    },
    {
      path: "/detalle/:id",
      component: () => import("@/views/Detalle.vue")
    }
  ],
})

export default router
