import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Layout from "../views/Layout.vue";
import Data from "../views/data/index.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/home',
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/info',
            name: 'info',
            component: Layout
        },
        {
            path: '/map',
            name: 'map',
            component: Data
        }
    ],
})

export default router
