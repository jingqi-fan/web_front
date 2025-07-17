import router from './index'; // 路由实例
import { useUserInfoStore } from '@/stores/useUserInfoStore';
import {useUserCreditScoreStore} from "../stores/useUserCreditScore.ts";
import {UserCreditScore} from "../entity/user_credit_score.ts";
import type {User} from "../entity/user.ts";
import {ElMessage} from "element-plus";

router.beforeEach((to, from, next) => {
    const userStore = useUserInfoStore();
    const isLoggedIn = !!userStore.user;
    const path = to.path;

    const staticWhiteList = [
        '/personal', '/home', '/login', '/register', '/doctor/login', '/doctor/check','/manager','/manager/dataCenter','/publish/manager/overview','/publish/manager/prosocial/type',
        '/publish/manager/prosocial/item','/publish/manager/book/manager','/publish/manager/parking/manager','/publish/manager/hospital/department',
        '/publish/manager/hospital/doctor','/manager/examine'
    ];

    const dynamicWhiteList = [
        /^\/manager\/.*/,
        /^\/doctor\/check_list\/\d+$/,
        /^\/doctor\/drug_list\/\d+$/
    ];
    // 静态路径匹配
    const isStaticWhite = staticWhiteList.includes(path);

    // 动态路径匹配
    const isDynamicWhite = dynamicWhiteList.some(regex => regex.test(path));

    if (isStaticWhite || isDynamicWhite) {
        next(); // 满足任一规则即放行
    } else {
        const userCreditScoreStore=useUserCreditScoreStore();
        const ucs:UserCreditScore=userCreditScoreStore.score
        const userInfoStore=useUserInfoStore()
        const userInfo:User=userInfoStore.user
        if(ucs===null || ucs.status!==3 || userInfo===null || userInfo.updated===0){
            if (to.path !== '/personal') {
                ElMessage.warning("请先完善个人信息");
                next('/personal');
            } else {
                next();
            }

        }else{
            if (isLoggedIn) {
                next();
            } else {
                next('/login');
            }
        }

    }
});
