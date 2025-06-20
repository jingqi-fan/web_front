import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Layout from "../views/Layout.vue";
import Data from "../views/data/index.vue"

import House  from "../views/House.vue"
import HouseDetails  from "../views/HouseDetails.vue"
import Commodity  from "../views/Commodity.vue"
import CommodityDetails  from "../views/CommodityDetails.vue"
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
        },

        {
            path: '/house',
            name: 'house',
            component: House
        },

        {
            path: '/commodity',
            name: 'commodity',
            component: Commodity
        },

        {
            path: '/commodity-details/:id',
            name: 'commodity-details',
            component: CommodityDetails,
            props: true
        },



        {
            path: '/house-details/:id',
            name: 'HouseDetails',
            component: HouseDetails,
            props: true // 允许将路由参数作为 props 传递给组件
          }

    



    ],
})

export default router
