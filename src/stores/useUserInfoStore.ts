import {defineStore} from "pinia";
import type {User} from "../entity/user.ts";

//双Token设计
export const useUserInfoStore=defineStore('useTokenStore',{
    state:()=>({
        user:null
    }),
    actions:{
        setUserInfo(payload:{ user:User }){
            this.user=payload.user;
        },
        removeUserInfo(){
            this.user=null;
        },
    }
})