import {defineStore} from "pinia";
import type {Doctors} from "../api/life/hospital_type.ts";

export const useHospitalHomePreorderDoctor = defineStore('useHospitalHomePreorderDoctor', {
    state: () => ({
        doctor: null as Doctors | null
    }),
    persist: true,
    actions: {
        setDoctor(payload: Doctors) {
            this.doctor = payload
        },
        remove() {
            this.doctor = null
        }
    }
})