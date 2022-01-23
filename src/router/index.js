import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from "@/components/HelloWorld";


Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/helloworld'
  },
  {
    path: '/helloworld',
    name: 'helloworld',
    component: HelloWorld
  },

]
const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes
})
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
