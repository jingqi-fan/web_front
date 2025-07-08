// src/stores/parkingOrder.ts
import { defineStore } from 'pinia'

export const useParkingOrderStore = defineStore('parkingOrder', {
    state: () => ({
        preOrderInfo: null as null | Record<string, any>
    }),
    actions: {
        setPreOrderInfo(info: Record<string, any>) {
            this.preOrderInfo = info
        },
        clearPreOrderInfo() {
            this.preOrderInfo = null
        }
    }
})
