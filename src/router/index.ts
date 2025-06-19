import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Layout from "../views/Layout.vue";
import Data from "../views/data/index.vue"
import CreditBusiness from '../views/CreditBusiness.vue'
import CreditBusinessHome from '../views/CreditBusinessHome.vue'
import HotelList from '../views/HotelList.vue'
import HotelDetail from '../views/HotelDetail.vue'


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
            path: '/creditbusiness',
            name: 'CreditBusiness',
            component: CreditBusiness,
            children: [
              {
                path: '',                // 默认子路由：信用商业首页
                name: 'CreditBusinessHome',
                component: CreditBusinessHome
              },
              {
                path: 'hotel-list',      // “酒店预订”列表
                name: 'HotelList',
                component: HotelList
              },
              {
                path: 'hotel-list/:hotelId',  // 详情页
                name: 'HotelDetail',
                component: HotelDetail,
                props: true
              },
              // … credit-shopping、credit-rent 等其它子路由
            ]
          },
    ],
})

export default router
