import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/index.vue'
import Login from '../views/login/index.vue'
import Layout from "../views/Layout.vue";
import Data from "../views/data/index.vue"
import CreditBusiness from '../views/CreditBusiness/CreditBusiness.vue'
import CreditBusinessHome from '../views/CreditBusiness/CreditBusinessHome.vue'
import HotelList from '../views/CreditBusiness/HotelList.vue'
import HotelDetail from '../views/CreditBusiness/HotelDetail.vue'
import Welcome from '../views/welcome/index.vue'
import Personal from '../views/personal/index.vue'
import {ElMessage} from "element-plus";
import {getUserCreditScoreInfo, getUserInfo} from "../api/user.ts";
import {useUserCreditScoreStore} from "../stores/useUserCreditScore.ts";
import {useUserInfoStore} from "../stores/useUserInfoStore.ts";
import {useTokenStore} from "../stores";
import Records from '../views/CreditBusiness/Records.vue';


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
            path: '/welcome',
            name: 'welcome',
            component: Welcome,
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
            path: '/personal',
            name: 'personal',
            component: Personal,
            beforeEnter: async (to, from, next) => {
                const tokenStore = useTokenStore();
                const userInfoStore = useUserInfoStore();
                const userCreditScoreStore = useUserCreditScoreStore();

                try {
                    if (!userInfoStore.user) {
                        const userInfo = await getUserInfo(tokenStore.token.userId);
                    }
                    if (!userCreditScoreStore.score) {
                        const score = await getUserCreditScoreInfo(userInfoStore.user.id);
                    }
                    next();
                } catch (e) {
                    ElMessage.error("加载用户信息失败，请重新登录");
                    next('/login');
                }
            }
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
                path: 'records',                // 预订记录汇总
                name: 'Records',
                component: Records
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
