import axiosInstance from "../plugins/axios.ts";
import type {RegisterCommand} from "../entity/registerCommand.ts";
import type {Result} from "../entity/result.ts";
import type {LoginCommand} from "../entity/loginCommand.ts";
import type {Token} from "../entity/token.ts";
import type {RefreshTokenCommand} from "../entity/refreshTokenCommand.ts";
import {useTokenStore} from "../stores";
import {ElMessage} from "element-plus";
import type {ApiResponse} from "../entity/response.ts";
import type {UpdateUserInfo} from "../entity/updateUserInfo.ts";
import {useUserInfoStore} from "../stores/useUserInfoStore.ts";
import {UpdateCreditScore} from "../entity/updateCreditScore.ts";
import router from "../router";
import type {UserCreditScore} from "../entity/user_credit_score.ts";
import {useUserCreditScoreStore} from "../stores/useUserCreditScore.ts";
import {useDeviceStore} from "../stores/useDeviceStore.ts";

// 用户注册
export const register = (data: RegisterCommand):Promise<ApiResponse>=> {
    return axiosInstance.post<Result<void>>('/user/register', data).then(res => {
        const r:ApiResponse = res.data;
        if(res?.data?.status !== 'SUCCESS'){
            ElMessage.error(r.message);
            return;
        }
        ElMessage.success('注册成功,请登录!');
        return r;
    })
};

// 用户登录
export const login = async (data: LoginCommand):Promise<ApiResponse> => {
    try{
        const res = await axiosInstance.post<Result<Token>>('/user/login', data);
        console.log("登录结果==> ",res)
        if (res?.data?.status === 'SUCCESS') {
            const tokenStore = useTokenStore();
            tokenStore.setToken(res.data.data);
            return res.data;
        } else {
            ElMessage.error(`登录失败${res.data.message}`);
            throw new Error('无效的响应数据');
        }
    }catch (error){
        console.error('登录失败', error);
        ElMessage.error('登录失败');
        throw error;
    }
};

export const AdminLogin = async (data:LoginCommand):Promise<ApiResponse> => {
    try{
        const res = await axiosInstance.post<Result<Token>>('/user/admin/login', data);
        console.log("管理员登录结果==> ",res)
        if (res?.data?.status === 'SUCCESS') {
            const tokenStore = useTokenStore();
            tokenStore.setToken(res.data.data);
            return res.data;
        } else {
            ElMessage.error(`登录失败${res.data.message}`);
            throw new Error('无效的响应数据');
        }
    }catch (error){
        console.error('登录失败', error);
        ElMessage.error('登录失败');
        throw error;
    }
};

export const getUserInfo = async (userId: string) => {
    try {
        const res = await axiosInstance.get<Result<any>>(`/user/info?userId=${userId}`);
        const userInfoStore=useUserInfoStore();
        if (res?.data?.data) {
            userInfoStore.setUserInfo(res.data.data);
            
            return res.data.data;
        }
        throw new Error('无效的响应数据');
    } catch (error) {
        console.error('获取用户信息失败', error);
        throw error;
    }
};
// 刷新Token
export const refreshToken = async (data: RefreshTokenCommand) => {
    try {
        const res = await axiosInstance.post<Result<Token>>('/user/refresh', data);
        if (res?.data?.data) {
            const tokenStore = useTokenStore();
            tokenStore.setToken(res.data.data);
            return res.data.data;
        }
        ElMessage.error('刷新Token失败：响应数据无效,请重新登录');
        await router.push('/login');
    } catch (error) {
        ElMessage.error('刷新Token失败,请重新登录');
        await router.push('/login');
        throw error;
    }
};
export  const updateUserInfo =async (uuid:String,data:UpdateUserInfo)=>{
    return await axiosInstance.post<UpdateUserInfo>(`/user/update?uuid=${uuid}`,data).then(res => {
        if(res.data.status !== 'SUCCESS'){
            ElMessage.error(res.data.message);
            return;
        }
        getUserInfo(uuid);
        ElMessage.success('更新成功');
    }).catch(err=>{
        ElMessage.error(`更新信息异常：${err}`);
    })
}
export const updateUserCreditScore=async (id:number,data:UpdateCreditScore)=>{
    return await axiosInstance.post<UpdateCreditScore>(`/user/credit/improveInfo?id=${id}`, data).then(res => {
        if (res.data.status !== 'SUCCESS') {
            ElMessage.error(res.data.message);
            return;
        }
        ElMessage.success('用户信用分更新成功');
    }).catch(err => {
        ElMessage.error(`信用分更新发生异常：${err}`);
    });
}
export const getUserCreditScore = async (id: number) => {
    const res=await axiosInstance.get<Result<any>>(`/user/credit/score?id=${id}`);
    console.log("getUserCreditScore",res)

    return res.data.data;
}
export const getUserCreditScoreInfo = async (id: number) => {
    try {
        const res = await axiosInstance.get<Result<any>>(`/user/credit/get?id=${id}`);
        console.log("getUserCreditScoreInfo",res)
        if (res.data.status !== 'SUCCESS') {
            ElMessage.error(res.data.message);
            return;
        }

        const uc: UserCreditScore = {
            accountType: res.data.data.accountType,
            annualIncome: res.data.data.annualIncome,
            createTime: res.data.data.createTime,
            creditScore: res.data.data.creditScore,
            creditUpdateTime: res.data.data.updateTime,
            id: res.data.data.id,
            idNumber: res.data.data.idNumber,
            jobType: res.data.data.jobType,
            maritalStatus: res.data.data.maritalStatus,
            qualification: res.data.data.qualification,
            updateTime: res.data.data.updateTime,
            status:res.data.data.status,
            idCardFront: res.data.data.idCardFront,
            idCardBack: res.data.data.idCardBack,
            workProof: res.data.data.workProof,
            educationProof: res.data.data.educationProof,
            incomeProof: res.data.data.incomeProof,
        };

        const userCreditScoreStore = useUserCreditScoreStore();
        userCreditScoreStore.setUserCredit(uc)
        return uc;
    } catch (err) {
        ElMessage.error(`获取用户信用分发生异常：${err}`);
    }
};

export const validator=async ()=>{
    return await axiosInstance.get(`/user/validator`).then(res => {
        if (res.data.status !== 'SUCCESS') {
            ElMessage.error(res.data.message);
            return;
        }
        ElMessage.success('用户信用分更新成功');
    }).catch(err => {
        ElMessage.error(`信用分更新发生异常：${err}`);
    });
}
export const userLogout = async (id:string,deviceId:string) => {
    return await axiosInstance.get(`/user/logout?userId=${id}&device=${deviceId}`).then(res => {
        console.log("api调用成功",res)
        if (res.data.status !== 'SUCCESS') {
            ElMessage.error(res.data.message);
            return;
        }
        const userInfoStore=useUserInfoStore();
        const userCreditScoreStore=useUserCreditScoreStore();
        const userTokenStore=useTokenStore();
        const deviceStore=useDeviceStore();
        userInfoStore.removeUserInfo()
        userCreditScoreStore.removeUserCredit()
        userTokenStore.removeToken()
        deviceStore.removeDevice()
        return res
    }).catch(err => {
        ElMessage.error(`退出登录发生异常：${err}`);
    })
}
export const updateAvatar=async (userId:number,avatarUrl:string)=>{
    return await axiosInstance.get(`/user/avatar/update?userId=${userId}&url=${avatarUrl}`,avatarUrl).then(res => {
        if (res.data.status !== 'SUCCESS') {
            ElMessage.error(res.data.message);
            return;
        }
        getUserInfo(userId)
        ElMessage.success('头像更新成功');
    }).catch(err => {
        ElMessage.error(`头像更新发生异常：${err}`);
    }).catch(err => {
        ElMessage.error(`头像更新发生异常：${err}`);
    })
}

export const getUcsList=async ()=>{
    const res= await axiosInstance.get(`/admin/ucs/list`)
    if(res.data.status !== 'SUCCESS'){
        ElMessage.error(res.data.message);
        return;
    }
    console.log("getUcsList res",res.data.data)
    return res.data.data;
}
export interface FinishCheckCommand{
    checkId:number;
    userId:number;
    status:number;
    message:string;
    stepResults:string;
}
export const ucsCheckFinish=async (command:FinishCheckCommand)=>{
    const res=await axiosInstance.post(`/user/credit/admin/update`,command)
    console.log(res)
}

//排行榜
//排行榜
export const getTopCreditUsers = async () => {
    return new Promise<{ avatar: string; score: number; area: string }[]>(resolve => {
        setTimeout(() => {
            resolve([
                {
                    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                    score: 780,
                    area: '上城区'
                },
                {
                    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                    score: 765,
                    area: '西湖区'
                },
                {
                    avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
                    score: 745,
                    area: '滨江区'
                },
                {
                    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
                    score: 730,
                    area: '拱墅区'
                },
                {
                    avatar: 'https://randomuser.me/api/portraits/men/27.jpg',
                    score: 715,
                    area: '萧山区'
                }
            ])
        }, 500)
    })
}
import { ref } from 'vue'
export interface RankUser {
    userId: number
    nickName: string
    profilePicture: string
    score: number
    area?: string
    avatar?:string
}

export const rankList = ref<RankUser[]>([])

export const loadRankWithCounty = async () => {
    // 第一步：获取排行
    const res1 = await axiosInstance.get('/credit/rank')
    console.log("排行数据：",res1.data)
    const users: RankUser[] = res1.data.data || []
    console.log(users)

    // 第二步：提取 userId 并查询县区
    const ids = users.map(u => u.userId)
    const res2= await axiosInstance.post('/user/county', {ids})
    console.log("地区数据：",res2.data.data)
    const idToCounty = res2?.data?.data || {}

    // 第三步：合并地区字段到排行列表中
    rankList.value = users.map(u => ({
        ...u,
        area: idToCounty[u.userId].county || '未知',
        avatar:idToCounty[u.userId].avatar || "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    }))
    return rankList.value.splice(0,5)
}
