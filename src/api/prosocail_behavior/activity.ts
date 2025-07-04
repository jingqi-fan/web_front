// 定义接口类型
import axiosInstance from "../../plugins/axios.ts";

interface ActivityDTO {
    id: number
    logo: string
    title: string
    introduce: string
    content: string
    sponsor: string
    address: string
}
//String logo,String title,String introduce,String content,String sponsor,String address
interface AddActivityTypeCommand {
    logo: string
    title: string
    introduce: string
    content: string
    sponsor: string
    address: string
}
//String logo,String title,String introduce,String content,String sponsor,String address
interface ModifyActivityCommand {
    logo: string
    title: string
    introduce: string
    content: string
    sponsor: string
    address: string
}
interface Result<T> {
    code: number
    message: string
    data: T
}

export const loadActivityType=async ()=>{
    const res=await axiosInstance.get('/activity/list')
    console.log("activity load list=",res)
    return res.data
}
export const addActivityType=async (data:AddActivityTypeCommand)=>{

    const res=await axiosInstance.post('/activity/add',data)
    console.log("activity add list=",res)
    return res.data
}
export const deleteActivityType=async (id:number,logo)=>{
    const res=await axiosInstance.get(`/activity/delete?id=${id}&logo=${logo}`)
    console.log("activity delete list=",res)
    return res.data
}
export const updateActivityType=async (id:number,data:ModifyActivityCommand)=>{
    console.log(`修改,id=${id},data=${data}`)
    const res=await axiosInstance.post(`/activity/modify?id=${id}`,data)
    console.log("activity update list=",res)
    return res.data
}
export const loadActivityItem=async (id:number)=>{
    const res=await axiosInstance.get(`/activity/item_list?id=${id}`)
    console.log("activity item list=",res)
    return res.data
}
