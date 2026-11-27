import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.path === from.path) return false
    return { top: 0, behavior: "instant" }
  },
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
      alias: "/favoritos",
      component: () => import("@/views/Guardados.vue")
    },
    {
      path: "/detalle/:id",
      component: () => import("@/views/Detalle.vue")
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/NotFound.vue")
    }
  ],
})

export default router
