import {ElMessage} from "element-plus";

export interface ItemDTO{
    itemId:number;
    title:string;
    content:string;
    startDate:string;
    endDate:string;
    publishDate:string;
    qrCode:string;
    number:number;
    activityTitle:string;
}
export interface ActivityItem {
    id: number
    activityId: number
    title: string
    content: string
    startDate: string // ISO string
    endDate: string
    publishDate: string
    qrCode: string
    number: number
    activityType:string
    createTime?: string
    updateTime?: string
}

export interface ActivityItemAddCommand {
    title: string
    content: string
    startDate: string
    endDate: string
    publishDate: string
    activityType:string
    qrCode: string
    number: number
}

export interface ModifyActivityItemCommand {
    itemId: number
    title: string
    content: string
    startDate: string
    endDate: string
    qrCode: string
    number: number
    activityType:string
}
import axiosInstance from "../../plugins/axios.ts";

/** 添加活动项 */
export const  addActivityItem=async (activityId:number,data: ActivityItemAddCommand)=> {
    const res= await  axiosInstance.post<string>(`/activity/item/add?activityId=${activityId}`, data)
    if(res.data.status!=='SUCCESS'){
        ElMessage.error(res.data.message)
        return
    }
    ElMessage.success("添加成功")
    return res.data
}

/** 删除活动项 */
export function deleteActivityItem(itemId: number) {
    return axiosInstance.delete<string>('/activity/item/delete', {
        params: { itemId }
    })
}

/** 修改活动项 */
export function modifyActivityItem(id:number,data: ModifyActivityItemCommand) {
    return axiosInstance.post<string>(`/activity/item/modify?activityId=${id}`, data)
}

/** 获取活动项详情 */
export function getActivityItemDetail(itemId: number) {
    return axiosInstance.get<ActivityItem>('/activity/item/detail', {
        params: { itemId }
    })
}
export const loadAllActivityItems =async () => {
    const res=await axiosInstance.get('/activity/item/list')
    console.log("item list =" ,res)
    if(res.data.status!=='SUCCESS'){
        ElMessage.error("加载失败")
        return []
    }
    return res.data.data
}