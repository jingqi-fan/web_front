import {defineStore} from "pinia";
import type {ParkingOrderInfo} from "../entity/parkingOrderInfo.ts";

export const useParkingOrderPayStore = defineStore('useParkingOrderPayStore', {
    state: () => ({
        parkingPay: null as ParkingOrderInfo | null
    }),
    persist: true,
    actions: {
        setPay(payload: ParkingOrderInfo) {
            this.parkingPay = payload
        },
        removePay() {
            this.parkingPay = null
        }
    }
})