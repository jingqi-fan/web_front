//plugins/axios.ts
import axios, {AxiosError, type AxiosResponse} from "axios";
import {ElMessage} from "element-plus";
import {useTokenStore} from "../stores";
import {useDeviceStore} from "../stores/useDeviceStore.ts";
import {refreshToken} from "../api/user.ts";
import router from "../router";


const baseURL = "/api";
const axiosInstance = axios.create({ baseURL });

let isRefreshing = false;
let requestQueue: (() => void)[] = [];

// 请求拦截器
axiosInstance.interceptors.request.use(
    
    
    async (config) => {
        
        
        if (config.url?.includes('/user/register')) {
            return config;
        }
        const tokenStore = useTokenStore();
        const deviceStore=useDeviceStore()
        if (tokenStore.token) {
            const isExpiringSoon = checkTokenExpiry(tokenStore.token.accessToken);

            if (isExpiringSoon && !config.url?.includes('/refresh')) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    try {
                        const newToken = await refreshToken({
                            accessToken: tokenStore.token.accessToken,
                            refreshToken: tokenStore.token.refreshToken,
                            userId: tokenStore.token.userId,
                            device: getDeviceId()
                        });

                        // 更新存储中的 token
                        tokenStore.setToken(newToken);
                        config.headers.Authorization = `Bearer ${newToken.accessToken}`;

                    } catch (error) {
                        tokenStore.removeToken();
                        tokenStore.logout();
                        return Promise.reject(error);
                    } finally {
                        isRefreshing = false;
                        requestQueue.forEach(cb => cb());
                        requestQueue = [];
                    }
                } else {
                    return new Promise((resolve) => {
                        requestQueue.push(() => {
                            // 使用刷新后的新 token
                            config.headers.Authorization = `Bearer ${tokenStore.token.accessToken}`;
                            resolve(config);
                        });
                    });
                }
            } else {
                
                config.headers.Authorization = `Bearer ${tokenStore.token.accessToken}`;
            }
        }
        console.log("config==>",config.headers.Authorization)
        
        return config;
    },

    
    error => {
        router.push('/login')
        Promise.reject(error)
    }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        
        const { response, config } = error;
        const tokenStore = useTokenStore();

        // 401
        if (response?.status === 401) {
            ElMessage.error('会话已过期，请重新登录');
            tokenStore.removeToken();
            setTimeout(tokenStore.logout, 1000);
            return Promise.reject(error);
        }

        if (response) {
            switch (response.status) {
                case 400:
                case 403:
                case 500:
                    ElMessage.error(response.data?.message || "服务异常");

                    break;
                default:
                    console.log("ERR");
                    
                    ElMessage.error("服务异常");
            }
            console.log("响应拦截·",response)
        } else if (error.request) {
            ElMessage.error("网络请求未响应");
        } else {
            ElMessage.error("请求错误: " + error.message);
        }
        return Promise.reject(error);
    }
);

// Token是否将过期
function checkTokenExpiry(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp*1000 ;
        return expiry - Date.now() < 5 * 60; // 5分钟
    } catch (e) {
        return false;
    }
}

export default axiosInstance;