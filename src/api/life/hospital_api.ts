import type {
    RecommendDoctorsRes,
    Departments,
    DoctorListInfoRes,
    Doctors,
    HospitalPreOrderReq,
    HospitalPreOrderInfoRes,
    MyAppointmentRes,
    PatientInfoRes,
    ExamSaveReq,
    ExaminationInfoRes,
    DrugSaveReq,
    DrugInfoRes,
    ResultDetailRes,
    PreFeeRes
} from './hospital_type.ts'
import axiosInstance from "../../plugins/axios.ts";
import type {AppointmentDetailRes} from "./hospital_result_detail_type.ts"; // 假设你有对应的类型定义文件

// 推荐医生列表
export const getRecommendDoctor = async () => {
    const res = await axiosInstance.get<{ data: RecommendDoctorsRes[] }>('/hospital/recommend')
    return res.data.data
}

// 获取科室列表
export const getDepartments = async (departmentType: number) => {
    const res = await axiosInstance.get<{ data: Departments[] }>('/hospital/department/list', {
        params: { departmentType }
    })
    return res.data.data
}

// 获取医生列表
export const getDoctors = async (departmentId: number) => {
    const res = await axiosInstance.get<{ data: DoctorListInfoRes }>('/hospital/doctors/list', {
        params: { departmentId }
    })
    return res.data.data
}

// 获取医生详情
export const getDoctorDetail = async (doctorId: number) => {
    const res = await axiosInstance.get<{ data: Doctors }>('/hospital/doctors/details', {
        params: { doctorId }
    })
    return res.data.data
}

// 预下单预约
export const getPreOrderInfo = async (req: HospitalPreOrderReq, id: number) => {
    const res = await axiosInstance.post(`/hospital/pre/order?id=${id}`, req)
    console.log("预下单预约",res)
    return res.data
}

// 确认预约
export const confirmOrder = async (appointmentId: number) => {
    const res = await axiosInstance.get<{ data: string }>('/hospital/order', {
        params: { appointmentId }
    })
    console.log("确认预约",res)
    return res.data
}

// 我的预约列表
export const getMyAppointments = async (id:number) => {
    const res = await axiosInstance.get<{ data: MyAppointmentRes[] }>(`/hospital/order/list?id=${id}`)
    console.log("预约列表",res)
    return res.data.data
}

// 取消预约
export const cancelAppointment = async (appointmentId: number) => {
    const res = await axiosInstance.get<{ data: string }>(`/hospital/cancel/appoint/${appointmentId}`)
    return res.data.data
}

// 查询患者列表
export const getPatientsList = async (doctorId:number) => {
    const res = await axiosInstance.get<{ data: PatientInfoRes[] }>('/hospital/patients/list', {
        params: { doctorId }
    })
    return res.data.data
}

// 当前接诊患者
export const getCurrentCheckPatient = async () => {
    const res = await axiosInstance.get<{ data: PatientInfoRes }>('/hospital/checking')
    return res.data.data
}

// 开始接诊
export const startCheck = async (patientId: number,doctorId:number) => {
    const res = await axiosInstance.get<{ data: string }>('/hospital/start/check', {
        params: { patientId,doctorId }
    })
    return res.data.data
}

// 结束接诊
export const finishCheck = async (patientId: number,doctorId:number) => {
    const res = await axiosInstance.get<{ data: string }>('/hospital/finish/check', {
        params: { patientId ,doctorId}
    })
    return res.data.data
}

// 获取检查项目
export const getExamList = async (departmentId: number, itemName: string, patientId: number) => {
    const res = await axiosInstance.get<{ data: ExaminationInfoRes }>('/hospital/examination/list', {
        params: { departmentId, itemName, patientId }
    })
    return res.data.data
}

// 保存检查项目
export const saveExamList = async (req: ExamSaveReq,id:number) => {
    const res = await axiosInstance.post<{ data: string }>(`/hospital/save/examination?doctorId=${id}`, req)
    return res.data.data
}

// 获取药品列表
export const getDrugs = async (drugName: string, patientId: number) => {
    const res = await axiosInstance.get<{ data: DrugInfoRes }>('/hospital/drug/list', {
        params: { drugName, patientId }
    })
    return res.data.data
}

// 保存处方药品
export const saveDrugs = async (req: DrugSaveReq,id:number) => {
    const res = await axiosInstance.post<{ data: string }>(`/hospital/save/drug?doctorId=${id}`, req)
    return res.data.data
}

// 保存诊断结果
export const saveDiagnosis = async (patientId: number, diagnosisResult: string) => {
    const res = await axiosInstance.get<{ data: string }>(`/hospital/save/diagnosis?patientId=${patientId}&diagnosisResult=${diagnosisResult}`)
    return res.data.data
}
//医护登录
export const doctorLogin=async (phone:string,password:string)=>{
    const res=await axiosInstance.post(`/hospital/login?phone=${phone}&password=${password}`)
    return res.data.data
}

// 获取诊断详情
export const getResultDetail = async (appointmentId: number,id:number) => {
    const res = await axiosInstance.get<{ data: AppointmentDetailRes }>('/hospital/result/detail', {
        params: { appointmentId,id }
    })
    return res.data.data
}

// 获取预支付费用
export const getPrePayFee = async (appointmentId: number) => {
    const res = await axiosInstance.get<{ data: PreFeeRes }>('/hospital/pre/fee', {
        params: { appointmentId }
    })
    return res.data.data
}

// 支付治疗费用
export const payFee = async (feeId: number) => {
    const res = await axiosInstance.get<{ data: string }>('/hospital/pay/fee', {
        params: { feeId }
    })
    return res.data.data
}
