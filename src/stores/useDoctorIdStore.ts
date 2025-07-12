import {defineStore} from "pinia";

export const useDoctorIdStore = defineStore('useDoctorIdStore', {
    state: () => ({
        doctorId: null as number | null
    }),
    persist: true,
    actions: {
        setDoctor(payload: number) {
            this.doctorId = payload
        },
        remove() {
            this.doctorId = null
        }
    }
})