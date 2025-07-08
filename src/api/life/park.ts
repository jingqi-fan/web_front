import axiosInstance from "../../plugins/axios.ts"
import type {
    ParkingLotsSimpleInfoRes,
    ParkingLotsTypeRes,
    ParkingLots,
    ParkingSpaces,
    ParkingPreOrderInfoReq,
    ParkingPreOrderInfoRes,
    AppointmentListRes,
    ParkingFeeRes,
    ParkingNeedPayFeeRes,
    ParkingLotPageRes
} from './type.ts'

import { ElMessage } from 'element-plus'

// 获取推荐停车场列表
export const getRecommendParking = async () => {
    const res = await axiosInstance.get<{ code: number; data: ParkingLotsSimpleInfoRes[] }>('/park/list')
    return res.data
}

// 获取当前积分
export const getScore = async (id: number) => {
    const res = await axiosInstance.get<{ code: number; data: string }>(`/park/score`, {
        params: { id }
    })
    return res.data
}

// 获取停车场列表（根据类型）
export const getParkingByType = async (pageNum = 1, pageSize = 10, type = 0, title = '') => {
    const res = await axiosInstance.get<{ code: number; data: ParkingLotsTypeRes }>('/park/type/list', {
        params: { pageNum, pageSize, type, title }
    })
    return res.data
}

// 获取车位信息
export const getSpaces = async (lotId: number) => {
    const res = await axiosInstance.get<{ code: number; data: ParkingSpaces[] }>(`/park/spaces/${lotId}`)
    return res.data
}

// 获取停车场详细信息
export const getParkingLotInfoById = async (lotId: number) => {
    const res = await axiosInstance.get<{ code: number; data: ParkingLots }>(`/park/lot/${lotId}`)
    return res.data
}

// 保存/修改预约预下单信息
export const savePreOrderInfo = async (req: ParkingPreOrderInfoReq, id: number) => {
    const res = await axiosInstance.post<{ code: number; data: ParkingPreOrderInfoRes }>(
        `/park/preOrder/save?id=${id}`,
        req
    )
    return res.data
}

// 确认预约下单
export const orderParking = async (appointmentId: number, id: number) => {
    const res = await axiosInstance.get<{ code: number; data: string }>(`/park/order/${appointmentId}`, {
        params: { id }
    })
    return res.data
}

// 我的预约列表
export const getAppointmentList = async (id: number) => {
    const res = await axiosInstance.get<{ code: number; data: AppointmentListRes[] }>(`/park/appointmentList`, {
        params: { id }
    })
    return res.data
}

// 获取停车费用
export const getFee = async (appointId: number) => {
    const res = await axiosInstance.get<{ code: number; data: ParkingFeeRes }>(`/park/fee/${appointId}`)
    return res.data
}

// 开始使用停车位
export const startUse = async (appointmentId: number) => {
    const res = await axiosInstance.get<{ code: number; data: string }>(`/park/startUse`, {
        params: { appointmentId }
    })
    return res.data
}

// 离场
export const leaveParking = async (appointId: number) => {
    const res = await axiosInstance.get<{ code: number; data: string }>(`/park/leave/${appointId}`)
    return res.data
}

// 获取支付详情
export const getFeeDetail = async (appointId: number) => {
    const res = await axiosInstance.get<{ code: number; data: ParkingNeedPayFeeRes }>(
        `/park/fee/detail/${appointId}`
    )
    return res.data
}

// 进行支付
export const payParkingFee = async (parkingFeeId: number) => {
    const res = await axiosInstance.get<{ code: number; data: string }>(`/park/pay/fee/${parkingFeeId}`)
    return res.data
}

// 管理员分页获取停车场
export const getAdminParkingLot = async (pageNum = 1, pageSize = 10, type = 0, title = '') => {
    const res = await axiosInstance.get<{ code: number; data: ParkingLotPageRes }>(`/park/admin/list`, {
        params: { pageNum, pageSize, type, title }
    })
    console.log("管理员获取停车场列表,res=", res)
    return res.data
}

// 管理员删除停车场
export const deletedParkLot = async (parkingLotId: number) => {
    const res = await axiosInstance.get<{ code: number; data: string }>(`/park/admin/deleted/${parkingLotId}`)
    return res.data
}

// 管理员更新停车场信息
export const updateParkingLot = async (data: ParkingLots) => {
    const res = await axiosInstance.post<{ code: number; data: string }>(`/park/admin/update/parkingLot`, data)
    if (res.data.code !== 200) {
        ElMessage.error('编辑停车场信息失败')
    }
    return res.data
}

// 管理员添加停车场
export const saveParkingLots = async (data: ParkingLots) => {
    const res = await axiosInstance.post('/park/admin/parkingLot/save', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return res.data
}