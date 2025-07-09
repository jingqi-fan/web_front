import axiosInstance from '../../plugins/axios.ts'
import type {AddDepartmentReq, DepartmentPageRes, Departments} from "./department_type.ts";

// 获取科室分页列表
export const getDepartmentList = async (
    pageNum: number,
    pageSize: number,
    departmentId = 0,
    departmentName = ''
) => {
    const res = await axiosInstance.get<{ code: number; data: DepartmentPageRes }>(
        `/hospital/admin/department/list`,
        {
            params: { pageNum, pageSize, departmentId, departmentName }
        }
    )
    return res.data
}

// 添加科室
export const addDepartment = async (req: AddDepartmentReq) => {
    const res = await axiosInstance.post<{ code: number; data: string }>(
        `/hospital/add/fee`,
        req
    )
    return res.data
}

// 获取科室详情
export const getDepartmentDetail = async (departmentId: number) => {
    const res = await axiosInstance.get<{ code: number; data: Departments }>(
        `/hospital/department/detail/${departmentId}`
    )
    return res.data
}

// 更新科室信息
export const updateDepartment = async (req: Departments) => {
    const res = await axiosInstance.post<{ code: number; data: string }>(
        `/hospital/department/update`,
        req
    )
    return res.data
}

// 删除科室
export const deleteDepartment = async (departmentId: number) => {
    const res = await axiosInstance.get<{ code: number; data: string }>(
        `/hospital/department/deleted/${departmentId}`
    )
    return res.data
}
