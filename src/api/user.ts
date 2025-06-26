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

// 用户注册
export const register = (data: RegisterCommand):Promise<ApiResponse>=> {
    console.log("注册")
    axiosInstance.post<Result<void>>('/user/register', data).then(res => {
        const r:ApiResponse = res.data;
        if(r.status !== 'SUCCESS'){
            ElMessage.error(r.message);
            return;
        }
        ElMessage.success('注册成功');
        return r;
    })
};

// 用户登录
export const login = async (data: LoginCommand):Promise<ApiResponse> => {
    // return await axiosInstance.post<Result<Token>>('/user/login', data).then(res => {
    //     if(res.data.status !== 'SUCCESS'){
    //         ElMessage.error(res.data.message);
    //         return;
    //     }
    //     ElMessage.success('登录成功');
    //     const tokenStore = useTokenStore();
    //     tokenStore.setToken(res.data.data);
    // })
    try{
        const res = await axiosInstance.post<Result<Token>>('/user/login', data);
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
            console.log(res.data.data)
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
        console.log(res)
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

    return await axiosInstance.post<UpdateCreditScore>(`/user/credit/update?id=${id}`, data).then(res => {
        if (res.data.status !== 'SUCCESS') {
            ElMessage.error(res.data.message);
            return;
        }
        ElMessage.success('用户信用分更新成功');
    }).catch(err => {
        ElMessage.error(`信用分更新发生异常：${err}`);
    });
}

export const getUserCreditScoreInfo = async (id: number) => {
    try {
        const res = await axiosInstance.get(`/user/credit/get?id=${id}`);
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
        };

        const userCreditScoreStore = useUserCreditScoreStore();
        userCreditScoreStore.setUserCredit(uc)


        return uc;
    } catch (err) {
        ElMessage.error(`获取用户信用分发生异常：${err}`);
        throw err;
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