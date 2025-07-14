import router from './index'; // 路由实例
import { useUserInfoStore } from '@/stores/useUserInfoStore';

router.beforeEach((to, from, next) => {
    const userStore = useUserInfoStore();
    const isLoggedIn = !!userStore.user;

    const whiteList = ['/home', '/login', '/register', '/doctor/login', '/manager','/doctor/check','/doctor/check_list/:id','/doctor/drug_list/:id'];

    if (whiteList.includes(to.path)) {
        // 白名单直接放行
        next();
    } else {
        if (isLoggedIn) {
            next();
        } else {
            // 拦截未登录用户
            next('/login');
        }
    }
});
