import type {
    ParkingLotsSimpleInfoRes,
    ParkingLotsTypeRes,
    ParkingSpaces,
    ParkingLots,
    ParkingPreOrderInfoReq,
    ParkingPreOrderInfoRes,
    AppointmentListRes,
    ParkingFeeRes,
    ParkingNeedPayFeeRes
} from './parking_type.ts'
import axiosInstance from "../../plugins/axios.ts";

export const getRecommendParking = async (): Promise<ParkingLotsSimpleInfoRes[]> => {
    const res = await axiosInstance.get('/park/list')
    return res.data.data
}

//根据类型加载停车场
export const getParkingByType = async (
    pageNum = 1,
    pageSize = 10,
    type = 0,
    title = ''
): Promise<ParkingLotsTypeRes> => {
    const res = await axiosInstance.get('/park/type/list', {
        params: { pageNum, pageSize, type, title }
    })
    return res.data.data
}

//获取停车场车位
export const getParkingSpaces = async (lotId: number): Promise<ParkingSpaces[]> => {
    const res = await axiosInstance.get(`/park/spaces/${lotId}`)
    return res.data.data
}
//获取停车场信息
export const getParkingLotInfo = async (lotId: number): Promise<ParkingLots> => {
    const res = await axiosInstance.get(`/park/lot/${lotId}`)
    return res.data.data
}
//预支付
// System.out.println(lotId);
// System.out.println(spaceNum);
// System.out.println(startTime);
// System.out.println(endTime);
// System.out.println(id);
export const savePreOrderInfo = async (req: ParkingPreOrderInfoReq, userId: number): Promise<ParkingPreOrderInfoRes> => {
    const lotId= req.lotId
    const spaceNum= req.spaceNum
    const startTime= req.startTime
    const endTime= req.endTime
    const res = await axiosInstance.post(`/park/preorder_1/save?lotId=${lotId}&spaceNum=${spaceNum}&startTime=${startTime}&endTime=${endTime}&id=${userId}`)

    return res.data.data
}
//预约
export const orderParking = async (
    appointmentId: number,
    userId: number
): Promise<string> => {
    const res = await axiosInstance.get(`/park/order/${appointmentId}?id=${userId}`)
    return res.data.data
}
//预约订单
export const getAppointmentList = async (userId: number): Promise<AppointmentListRes[]> => {
    const res = await axiosInstance.get(`/park/appointmentList?id=${userId}`)
    return res.data.data
}
//获取费用
export const getParkingFee = async (appointId: number): Promise<ParkingFeeRes> => {
    const res = await axiosInstance.get(`/park/fee/${appointId}`)
    return res.data.data
}
//开始使用
export const startParkingUse = async (appointmentId: number): Promise<string> => {
    const res = await axiosInstance.get(`/park/startUse?appointmentId=${appointmentId}`)
    return res.data
}
//离开停车场
export const leaveParking = async (appointId: number): Promise<string> => {
    const res = await axiosInstance.get(`/park/leave/${appointId}`)
    return res.data.data
}
//费用详情
export const getFeeDetail = async (appointId: number): Promise<ParkingNeedPayFeeRes> => {
    const res = await axiosInstance.get(`/park/fee/detail/${appointId}`)
    return res.data.data
}
//支付
export const payParkingFee = async (parkingFeeId: number,appointmentId:number): Promise<string> => {
    const res = await axiosInstance.get(`/park/pay/fee/${parkingFeeId}?appointmentId=${appointmentId}`)
    return res.data.data
}
