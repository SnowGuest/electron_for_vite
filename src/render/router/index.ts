import { RouteRecordRaw, createWebHashHistory, createRouter } from "vue-router"
const routes: Array<RouteRecordRaw> = [{
    path: "/",
    redirect: "/home",
},
{
    path: "/home",
    component: () => import("@/view/home/index.vue")
}]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router