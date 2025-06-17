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

// 用户注册
export const register = (data: RegisterCommand):Promise<ApiResponse>=> {
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
    await axiosInstance.post<Result<Token>>('/user/login', data).then(res => {
        if(res.data.status !== 'SUCCESS'){
            ElMessage.error(res.data.message);
            return;
        }
        ElMessage.success('登录成功');
        const tokenStore = useTokenStore();
        tokenStore.setToken(res.data.data);
        return res;
    })
};

export const getUserInfo = async (userId: string) => {
    try {
        const res = await axiosInstance.get<Result<any>>(`/user/info?userId=${userId}`);
        //const userInfoStore=useUserInfoStore();

        if (res?.data?.data) {

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
    console.log("data=",data)
    data.device = "web"
    try {
        const res = await axiosInstance.post<Result<Token>>('/user/refresh', data);
        // ✅ 添加有效性检查
        if (res?.data?.data) {
            const tokenStore = useTokenStore();
            tokenStore.setToken(res.data.data);
            return res.data.data; // 返回有效数据
        }
        throw new Error('刷新Token失败：响应数据无效');
    } catch (error) {
        console.error('刷新Token异常', error);
        throw error;
    }
};
export  const updateUserInfo =async (uuid:String,data:UpdateUserInfo)=>{
    await axiosInstance.post<UpdateUserInfo>(`/user/update?uuid=${uuid}`,data).then(res => {
        if(res.data.status !== 'SUCCESS'){
            ElMessage.error(res.data.message);
            return;
        }
        ElMessage.success('更新成功');
        return res;
    }).catch(err=>{
        ElMessage.error("更新信息异常：",err);
    })
}