import { defineStore } from 'pinia'
import {ref} from "vue";

export const useRouterStore=defineStore('router',()=>{
    const selectedRouter=ref('');
    const setRouter=(newRouter:string)=>{
        selectedRouter.value = newRouter;
    }
    const removeRouter=()=>{
        selectedRouter.value = '';
    }

    return {
        selectedRouter,
        setRouter,
        removeRouter
    }
})

export default useRouterStore;