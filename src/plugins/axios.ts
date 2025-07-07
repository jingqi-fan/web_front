//plugins/axios.ts
import axios, {AxiosError, type AxiosResponse} from "axios";
import {ElMessage} from "element-plus";
import {useTokenStore} from "../stores";
import {useDeviceStore} from "../stores/useDeviceStore.ts";
import {refreshToken} from "../api/user.ts";
import router from "../router";


const baseURL = "/api";
const axiosInstance = axios.create({ baseURL });

//请求拦截器
// 添加全局状态管理
let isRefreshing = false;
let requestQueue: (() => void)[] = [];

// 请求拦截器 - 专门处理 token 刷新
axiosInstance.interceptors.request.use(
    
    
    async (config) => {
        
        
        if (config.url?.includes('/user/register')) {
            return config; // 直接返回配置，不进行Token处理
        }
        const tokenStore = useTokenStore();
        const deviceStore=useDeviceStore()
        if (tokenStore.token) {
            const isExpiringSoon = checkTokenExpiry(tokenStore.token.accessToken);

            // 仅处理非刷新请求的 token 更新
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

// 响应拦截器 - 只处理错误响应
axiosInstance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        
        const { response, config } = error;
        const tokenStore = useTokenStore();

        // 统一处理 401 错误
        if (response?.status === 401) {
            ElMessage.error('会话已过期，请重新登录');
            tokenStore.removeToken();
            setTimeout(tokenStore.logout, 1000);
            return Promise.reject(error);
        }

        // 其他错误处理逻辑保持不变
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

// 辅助函数：检查Token是否即将过期
function checkTokenExpiry(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp*1000 ; // 转换为毫秒
        return expiry - Date.now() < 5 * 60; // 5分钟内过期
    } catch (e) {
        return false;
    }
}

//响应拦截器

export default axiosInstance;