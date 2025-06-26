import {defineStore} from "pinia";

//双Token设计
export const useDeviceStore=defineStore('device',{
    state:()=>({
        device:''
    }),
    persist: true,
    actions:{
        setDevice(payload:{ device:string;}){
            this.device=payload.device;
        },
        removeDevice(){
            this.device='';
        }
    }
})