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
import HouseOrder from '../views/creditbusiness2/HouseOrder.vue';


import ManageHome from "../views/creditManage/creditProfile.vue"
import CreditDimension from "../views/creditManage/creditDimension.vue"
import CreditTask from "../views/creditManage/creditTask.vue"

import House  from "../views/creditbusiness2/House.vue"
import HouseDetails  from "../views/creditbusiness2/HouseDetails.vue"
import Commodity  from "../views/creditbusiness2/Commodity.vue"
import CommodityDetails  from "../views/creditbusiness2/CommodityDetails.vue"
import OrderConfirm from "../views/creditbusiness2/OrderConfirm.vue"
import OrderList from "../views/creditbusiness2/OrderList.vue"

import CreditLife from "../views/credit_life/index.vue"
import Parking from "../views/credit_life/parking/index.vue"
import Library from "../views/credit_life/library/index.vue"
import Hospital from "../views/credit_life/hospital/index.vue"
import Chat from "../views/welcome/components/ProsocialUserCenter.vue"
import HospitalOrderDetail from "../views/credit_life/hospital/components/OrderDetail.vue"
import UserProsocialCenter from "../views/welcome/components/ProsocialUserCenter.vue"
import PreorderByDepartment from "../views/credit_life/hospital/PreorderByDepartment.vue"
import PreorderQuick from "../views/credit_life/hospital/components/PreorderQuick.vue"
import HospitalPreorderConfirm from "../views/credit_life/hospital/components/PreorderConfirm.vue"
import ParkingHome from "../views/credit_life/parking/index.vue"
import ParkingLots from "../views/credit_life/parking/ParkingLots.vue"
///管理员
import Manager from "../views/manager/index.vue"
import ManagerLogin from "../views/manager/component/ManagerLogin.vue"
import ManagerMainPage from "../views/manager_main/index.vue"
import Overview from "../views/manager_main/Overview.vue"
import ProsocialType from "../views/manager_main/prosocial_behavior/ProcialTypeManager.vue"
import ProsocialItem from "../views/manager_main/prosocial_behavior/ProsocialItemManager.vue"
import BookManager from "../views/manager_main/book/BookManager.vue"
import DepartmentManager from "../views/manager_main/hospital/DepartmentManager.vue"
import DoctorManager from "../views/manager_main/hospital/DoctorManager.vue"
import ParkingManager from "../views/manager_main/parking/ParkingManager.vue"
import ExamineImprove from "../views/manager_main/examine_and_approve/index.vue"
import MyOrder from "../views/credit_life/hospital/components/MyOrder.vue";
import PreorderInfo from "../views/credit_life/hospital/components/PreorderInfo.vue";
import BorrowBookList from "../views/credit_life/library/BorrowBook.vue";
import DoctorLogin from "../views/credit_life/library/DoctorLogin.vue";
import DoctorCheck from "../views/credit_life/library/DoctorCheck.vue";
import CheckListSystem from "../views/credit_life/library/CheckListSystem.vue";
import DrugListSystem from "../views/credit_life/library/DrugListSystem.vue";
import PayHospitalOrder from "../views/credit_life/hospital/components/PayHospitalOrder.vue";
import ParkingSpace from "../views/credit_life/parking/ParkingSpace.vue";
import ConfirmPreorder from "../views/credit_life/parking/ConfirmPreorder.vue";
import ParkingMyOrder from "../views/credit_life/parking/ParkingMyOrder.vue";
import FeeDetail from "../views/credit_life/parking/FeeDetail.vue";
import PayBorrowBooks from "../views/credit_life/library/PayBorrowBooks.vue";
import MyBooksOrder from "../views/credit_life/library/MyBooksOrder.vue";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/manager/examine',
            name: 'examine_improve',
            component:ExamineImprove
        },
        {
            path: '/prosocial_user',
            name: 'UserProsocialCenter',
            component: UserProsocialCenter
        },
        {
            path: '/life/hospital_order_home',
            redirect: '/life/hospital_order_home/preorder'
        },
        {
            path: '/parking/home',
            name: 'ParkingHome',
            component: ParkingHome
        },
        {
            path:'/parking/lots',
            name:'ParkingLots',
            component:ParkingLots
        },
        {
            path:'/parking/lot/:id',
            name:'ParkingLotId',
            component:ParkingSpace
        },
        {
            path:'/parking/space/my_order',
            name:'ParkingMyOrder',
            component: ParkingMyOrder
        },
        {
            path:'/parking/order/detail/:id',
            name:'ParkingOrderDetail',
            component: FeeDetail
        },
        {
            path:'/parking/order/confirm/pre',
            name:'ParkingOrderConfirm',
            component:ConfirmPreorder
        },
        {
            path: '/doctor/check',
            name: 'DoctorCheck',
            component: DoctorCheck
        },
        {
            path: '/doctor/order/pay/:id',
            name: 'PayHospitalOrder',
            component: PayHospitalOrder
        },
        {
            path: '/doctor/login',
            name:'DoctorLogin',
            component:DoctorLogin
        },
        {
            path: '/doctor/check_list/:id',
            name: 'CheckListSys',
            component: CheckListSystem
        },
        {
            path: '/doctor/drug_list/:id',
            name: 'DrugListSys',
            component: DrugListSystem
        },
        {
            path:'/book/my_order',
            name:'BooksOrder',
            component:MyBooksOrder
        },
        {
            path:'/life/book/list',
            name:'BorrowBook',
            component: BorrowBookList
        },
        {
            path:'/book/pay/:id',
            name:'PayBorrowBook',
            component: PayBorrowBooks
        },
        {
            path: '/life/hospital_order_home',
            name: 'HospitalOrderHome',
            component: PreorderByDepartment,
            children:[
                {
                    path: '/life/hospital_order_home/preorder',
                    name: 'HospitalPreorder',
                    component: PreorderQuick,
                },
                {
                    path: '/life/hospital_order_home/myorder',
                    name: 'HospitalMyOrder',
                    component: MyOrder,
                },
                {
                    path:'/life/hospital_order_home/preorder_info',
                    name:'PreorderPreorderInfo',
                    component: PreorderInfo
                },
                {
                    path: '/life/hospital_order_home/preorder_confirm',
                    name: 'HospitalPreorderConfirm',
                    component: HospitalPreorderConfirm
                },
                {
                    path:'/life/hospital_order_home/order_detail/:id',
                    name: 'HospitalOrderDetail',
                    component: HospitalOrderDetail
                }
            ]
        },
        {
            path: '/manager/manager',
            redirect: '/publish/manager/overview',
            component: ManagerMainPage,
            children:[
                {
                    path: '/publish/manager/overview',
                    name: 'overview',
                    component: Overview
                },
                {
                    path: '/publish/manager/prosocial/type',
                    name: 'prosocial_type',
                    component: ProsocialType
                },
                {
                    path: '/publish/manager/prosocial/item',
                    name: 'prosocial_item',
                    component: ProsocialItem
                },
                {
                    path: '/publish/manager/book/manager',
                    name: 'book_manager',
                    component: BookManager
                },
                {
                    path: '/publish/manager/parking/manager',
                    name: 'parking_manager',
                    component: ParkingManager
                },
                {
                    path: '/publish/manager/hospital/department',
                    name: 'hospital_department',
                    component: DepartmentManager
                },
                {
                    path: '/publish/manager/hospital/doctor',
                    name: 'hospital_doctor',
                    component: DoctorManager
                }
            ]
        },

        {
            path: '/',
            redirect: '/home',
        },
        {
            path: '/life',
            name: 'Life',
            component: CreditLife
        },
        {
            path: '/life/parking',
            name: 'parking',
            component: Parking
        },
        {
            path: '/life/library',
            name: 'library',
            component: Library
        },

        {
            path: '/life/hospital',
            name: 'hospital',
            component: Hospital
        },
        {
            path: '/managerLogin',
            name: 'managerLogin',
            component: ManagerLogin
        },
        {
            path: '/chat',
            name: 'chat',
            component: Chat
        },
        {
            path: '/manager',
            name: 'manager',
            component: Manager
        },
        {
            path: '/manageHouse',
            name: 'manageHouse',
            component: ManageHome
        },
        {
            path: '/creditDimension',
            name: 'creditDimension',
            component: CreditDimension
        },
        {
            path: '/creditTask',
            name: 'creditTask',
            component: CreditTask
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
            path: '/manager/dataCenter',
            name: 'data',
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
            path: '/order-confirm',
            name: 'OrderConfirm',
            component: OrderConfirm
        },

        {
            path: '/order-list',
            name: 'OrderList',
            component: OrderList
        },

        {
            path: '/house-details/:id',
            name: 'HouseDetails',
            component: HouseDetails,
            props: true
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
                path: 'credit-shopping',  // 信用购物
                name: 'CreditShopping',
                component: Commodity
              },
              {
                path: 'credit-shopping/details/:id',  // 商品详情页
                name: 'CommodityDetailsInCredit',
                component: CommodityDetails,
                props: true
              },
              {
                path: 'order-confirm',  // 订单确认页
                name: 'OrderConfirmInCredit',
                component: OrderConfirm
              },
              {
                path: 'order-list',  // 订单列表页
                name: 'OrderListInCredit',
                component: OrderList
              },
              {
                path: 'credit-rent',      // 便捷租房
                name: 'CreditRental',
                component: House
              },
              {
                path: 'credit-rent/details/:id',  // 房源详情页
                name: 'HouseDetailsInCredit',
                component: HouseDetails,
                props: true
              },
              {
                path: 'credit-rent/order/:id',  // 房屋下单页
                name: 'HouseOrderInCredit',
                component: HouseOrder,
                props: true
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
              }
            ]
        }
    ],
})

export default router
