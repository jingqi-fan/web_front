import axiosInstance from "../../plugins/axios.ts";
import type {Doctor, DoctorListRes} from "./doctor_type.ts";

// 获取医生分页列表
export const getDoctorList = async (
    pageNum: number,
    pageSize: number,
    doctorId = 0,
    doctorName = ''
) => {
    const res = await axiosInstance.get<{ code: number; data: DoctorListRes }>(
        `/hospital/admin/doctor/list`,
        {
            params: { pageNum, pageSize, doctorId, doctorName }
        }
    )
    return res.data
}

// 添加医生
export const addDoctor = async (req: Doctor) => {
    const res = await axiosInstance.post<{ code: number; data: string }>(
        `/hospital/add/doctor`,
        req
    )
    return res.data
}

// 获取医生详情
export const getDoctorDetail = async (doctorId: number) => {
    const res = await axiosInstance.get<{ code: number; data: Doctor }>(
        `/hospital/doctor/detail/${doctorId}`
    )
    return res.data
}

// 更新医生信息
export const updateDoctor = async (req: Doctor) => {
    const res = await axiosInstance.post<{ code: number; data: string }>(
        `/hospital/doctor/update`,
        req
    )
    return res.data
}

// 删除医生
export const deleteDoctor = async (doctorId: number) => {
    const res = await axiosInstance.get<{ code: number; data: string }>(
        `/hospital/deleted/doctor/${doctorId}`
    )
    return res.data
}
