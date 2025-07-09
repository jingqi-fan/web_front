import axiosInstance from "../../plugins/axios.ts";
import type {ActivitiesDTO, ActivityItemWithCategoryDTO, UserJoinActivityDTO} from "./user_activity_type.ts";

/** 用户参与活动项 */
export const joinActivity = async (req: { userId: number; itemId: number }) => {
    const res = await axiosInstance.post<{ code: number; data: string }>(
        '/user_activity/join',
        req
    )
    return res.data
}

/** 用户退出活动项 */
export const exitActivity = async (req: { userId: number; itemId: number }) => {
    const res = await axiosInstance.post<{ code: number; data: string }>(
        '/user_activity/exit',
        req
    )
    return res.data
}

/** 用户完成活动项 */
export const finishActivityItem = async (req: { userId: number; itemId: number }) => {
    const res = await axiosInstance.post<{ code: number; data: string }>(
        '/user_activity/finish',
        req
    )
    return res.data
}

/** 获取用户参与的所有活动项 */
export const getUserActivityList = async (userId: number) => {
    const res = await axiosInstance.get<{ code: number; data: UserJoinActivityDTO[] }>(
        '/user_activity/list',
        {
            params: { userId }
        }
    )
    return res.data
}

/** 加载所有活动（用于报名选择等） */
export const loadAllActivityItems = async () => {
    const res = await axiosInstance.get<{ code: number; data: ActivityItemWithCategoryDTO[] }>(
        '/activity/item/list'
    )
    console.log("小项",res)
    return res.data
}
/** 加载所有活动大类*/
export const loadAllActivities = async () => {
    const res = await axiosInstance.get<{ code: number; data: ActivitiesDTO[] }>(
        '/activity/list'
    )
    console.log("大类",res)
    return res.data
}
