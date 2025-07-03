// src/types/activity.ts
//      Integer itemId,
//     String title,
//     String content,
//     Instant startDate,
//     Instant endDate,
//     Instant publishDate,
//     String qrCode,
//     Integer number,
//     String activityTitle
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
    createTime?: string
    updateTime?: string
}

export interface ActivityItemAddCommand {
    title: string
    content: string
    startDate: string
    endDate: string
    publishDate: string
    qrCode: string
    number: number
}

export interface ModifyActivityItemCommand {
    title: string
    content: string
    startDate: string
    endDate: string
    qrCode: string
    number: number
}

// src/api/activityItem.ts

import axiosInstance from "../../plugins/axios.ts";

/** 添加活动项 */
export function addActivityItem(activityId: number, data: ActivityItemAddCommand) {
    return axiosInstance.post<string>('/activity/item/add', data, {
        params: { activityId }
    })
}

/** 删除活动项 */
export function deleteActivityItem(itemId: number) {
    return axiosInstance.delete<string>('/activity/item/delete', {
        params: { itemId }
    })
}

/** 修改活动项 */
export function modifyActivityItem(activityId: number, data: ModifyActivityItemCommand) {
    return axiosInstance.post<string>('/activity/item/modify', data, {
        params: { activityId }
    })
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