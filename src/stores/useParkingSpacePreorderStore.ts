import {defineStore} from "pinia";
import type {Doctors} from "../api/life/hospital_type.ts";
import type {ParkingPreOrderInfoRes} from "../api/life/parking_type.ts";

export const useParkingSpacePreorderStore = defineStore('useParkingSpacePreorderStore', {
    state: () => ({
        preorder: null as ParkingPreOrderInfoRes | null
    }),
    persist: true,
    actions: {
        setPreorder(payload: ParkingPreOrderInfoRes) {
            this.preorder = payload
        },
        removePreorder() {
            this.preorder = null
        }
    }
})