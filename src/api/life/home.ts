import axiosInstance from "../../plugins/axios.ts";
import {ElMessage} from "element-plus";
import type {BorrowingRecord} from "../../entity/life/BorrowingRecord.ts";
import type {ParkingRecord} from "../../entity/life/ParkingRecord.ts";
import type {HospitalRecord} from "../../entity/life/HospitalRecord.ts";
import type {LifeApiResponse} from "../../entity/life/LifeApiResponse.ts";

export const countBacklog=async (id:number)=>{
    try{
        const cnt1=await getBookBacklog(id)
        const cnt2=await getParkingBacklog(id)
        const cnt3=await getHospitalBacklog(id)
        return cnt1?.length + cnt2?.length + cnt3?.length;
    }catch(err){
        console.error("获取待办数量失败", err);
        ElMessage.error("获取待办数量失败");
    }
}

export const getBookBacklog = async (id: number): Promise<BorrowingRecord[] | undefined> => {
    try {
        const res = await axiosInstance.get<LifeApiResponse<BorrowingRecord[]>>(
            `/book/record?id=${id}`
        );
        if(res.data.data===null){
            return [];
        }
        console.log("getBookBacklog:", res)
        if (res.data.code === 200 && Array.isArray(res.data.data)) {
            return res.data.data;
        } else {
            ElMessage.error(res.data.msg || "无效的响应数据");
        }
    } catch (error) {
        console.error("获取图书借阅记录失败", error);
        ElMessage.error("获取图书借阅记录失败");
    }
};

export const getParkingBacklog=async (id:number)=>{
    try {
        const res=await axiosInstance.get<LifeApiResponse<ParkingRecord>>(`/park/appointmentList?id=${id}`)
        console.log("getParkingBacklog:", res)
        if(res.data.data===null){
            return [];
        }
        if (res.data.code === 200 && Array.isArray(res.data.data)) {
            return res.data.data;
        } else {
            ElMessage.error(res.data.msg || "无效的响应数据");
        }
    } catch (error) {
        console.error('获取停车预约记录失败', error);
        ElMessage.error('获取停车预约记录失败');
    }
}

export const getHospitalBacklog=async (id:number)=>{
    try {
        const res=await axiosInstance.get<LifeApiResponse<HospitalRecord>>(`/hospital/order/list?id=${id}`)
        console.log("getHospitalBacklog:", res)
        if(res.data.data===null){
            return [];
        }
        if (res.data.code === 200 && Array.isArray(res.data.data)) {
            return res.data.data;
        } else {
            ElMessage.error(res.data.msg || "无效的响应数据");
        }
    } catch (error) {
        console.error('获取就医预约记录失败', error);
        ElMessage.error('获取就医预约记录失败');
    }
}