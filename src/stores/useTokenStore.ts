import {defineStore} from "pinia";
import router from "../router";
import type {Token} from "../entity/registerCommand.ts";

//双Token设计
export const useTokenStore = defineStore('token', {
    state: () => ({
        token: null as Token | null
    }),
    actions: {
        setToken(payload: Token) {
            const now = Math.floor(Date.now() / 1000);
            payload.accessExpires = now + payload.accessExpires;
            payload.refreshExpires = now + payload.refreshExpires;
            this.token = payload;
            localStorage.setItem('token', JSON.stringify(payload));
        },
        removeToken() {
            this.token = null;
            localStorage.removeItem('token');
        },
        logout() {
            this.removeToken();
            router.push("/login");
        },
        // 检查Token是否即将过期
        isTokenExpiringSoon(threshold = 300): boolean {
            if (!this.token) return true;
            const now = Math.floor(Date.now() / 1000);
            return this.token.accessExpires - now < threshold;
        }
    }
})