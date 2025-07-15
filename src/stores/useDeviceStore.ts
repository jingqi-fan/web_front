import {defineStore} from "pinia";

//双Token设计
export const useDeviceStore=defineStore('device',{
    state:()=>({
        device:'123456' as string
    }),
    persist: true,
    actions:{
        setDevice(device:string){
            this.device=device;
            console.log(device)
        },
        removeDevice(){
            this.device='123456';
        }
    }
})