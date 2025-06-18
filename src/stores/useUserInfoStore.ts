import {defineStore} from "pinia";
import type {User} from "../entity/user.ts";

//双Token设计
export const useUserInfoStore=defineStore('useTokenStore',{
    state:()=>({
        user:null
    }),
    actions:{
        setUserInfo(payload:User){
            this.user=payload;
        },
        removeUserInfo(){
            this.user=null;
        },
    }
})