// private Integer id;
// private String parkingLotName;
// private String parkingLotLocation;
// private Integer parkingLotType;
// private Integer totalSpaces;
// private String image;
// private Integer leftCount;
// private Integer price;
// private Integer deleted;
// private Date createdAt;
// private Date updatedAt;

export interface ParkingLot{
    id:number,
    parkingLotName:string,
    parkingLotLocation:string,
    parkingLotType:number,
    totalSpaces:number,
    image:string,
    leftCount:number,
    price:number,
    deleted:number,
    createdAt:string,
    updatedAt:string
}

//获取默认推荐的停车场
import axiosInstance from "../../plugins/axios.ts";
import {ElMessage} from "element-plus";

export const getRecommendParking=async ()=>{
    try{
        const res=await axiosInstance.get(`/park/list`)
        console.log("获取推荐停车场,res=",res)
        if(res.data.code!==200){
            ElMessage.error("获取推荐停车场失败")
            return null
        }
        return res.data.data
    }catch(err){
        ElMessage.error("获取推荐停车场异常")
        console.log("获取推荐停车场异常-->",err)
        return null
    }
}
export const getAdminParkingLot=async ()=>{
    try{
        const res=await axiosInstance.get(`/park/admin/list`)
        if(res.data.code!==200){
            ElMessage.error("获取管理员停车场失败")
            return null
        }
        return res.data.data
    }catch(err){
        ElMessage.error("获取管理员停车场异常")
        console.log("获取管理员停车场异常-->",err)
        return null
    }
}
export const deletedParkLot=async (id:number)=>{
    try{
        const res=await axiosInstance.get(`/park/admin/deleted/${id}`)
        if(res.data.code!==200){
            ElMessage.error("删除停车场失败")
            console.log("删除停车场失败-->",res.data.data)
            return null
        }
        return res.data.data
    }catch(err){
        ElMessage.error("发生异常")
        console.log("删除停车场异常-->",err)
        return null
    }
}
export const updateParkingLot=async (data:ParkingLot)=>{
    try{
        const res=await axiosInstance.post(`/park/admin/update/parkingLot`,data)
        if(res.data.code!==200){
            ElMessage.error("更新停车场失败")
            console.log("更新停车场失败-->",res.data.data)
            return null
        }
        return res.data.data
    }catch(err){
        ElMessage.error("发生异常")
        console.log("更新停车场异常-->",err)
        return null
    }
}