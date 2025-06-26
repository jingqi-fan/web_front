import {defineStore} from "pinia";
import type {UserCreditScore} from "../entity/user_credit_score.ts";

//双Token设计
export const useUserCreditScoreStore=defineStore('UserCreditScore',{
    state:()=>({
        score:null as UserCreditScore | null
    }),
    persist: true,
    actions:{
        setUserCredit(payload:UserCreditScore){
            this.score=payload;
        },
        removeUserCredit(){
            this.score=null;
        },
    }
})