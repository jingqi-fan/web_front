import {defineStore} from "pinia";
import type {ConfirmPreorderRes} from "../api/life/hospital_type.ts";

export const useWillConfirmPreorderStore = defineStore('useWillConfirmPreorderStore', {
    state: () => ({
        confirmPreorder: null as ConfirmPreorderRes | null
    }),
    persist: true,
    actions: {
        setThis(payload: ConfirmPreorderRes) {
            this.confirmPreorder = payload
        },
        removeThis() {
            this.confirmPreorder = null
        }
    }
})