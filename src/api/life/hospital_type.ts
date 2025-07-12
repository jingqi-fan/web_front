// 推荐医生
export interface RecommendDoctorsRes {
    doctorId: number
    doctorName: string
    departmentName: string
    doctorTitle: number
    doctorSpecialty: string
    image: string
}

// 科室信息
export interface Departments {
    id: number
    departmentName: string
    departmentType: number
    departmentIntroduction: string
    deleted: number
    createdAt: string
    updatedAt: string
}

// 医生信息
export interface Doctors {
    id: number
    doctorName: string
    doctorTitle: number
    doctorSpecialty: string
    departmentId: number
    image: string
    phone: string
    email: string
    createdAt: string
    updatedAt: string
}

// 医生列表返回结构
export interface DoctorListInfoRes {
    departmentName: string
    doctorsList: Doctors[]
}

// 预下单请求体
export interface HospitalPreOrderReq {
    doctorId: number
    reason: string
}

// 预下单响应体
export interface HospitalPreOrderInfoRes {
    departmentName: string
    doctorName: string
    doctorTitle: string
    creatTimeStr: string
    userInfo: User
    appointmentId: number
    score: number
}

// 用户基础信息
export interface User {
    id: number
    username: string
    nickname?: string
    avatar?: string
    phone?: string
    email?: string
    creditScore?: number
}
// 预约信息
export interface Appointments {
    id: number
    createTimeStr: string
    departmentId: number
    doctorId: number
    status: number
}
// 我的预约信息
export interface MyAppointmentRes {
    appointmentId: number
    departmentName: string
    doctorName: string
    doctorTitleStr: string
    createTimeStr: string
    status: number
}

// 患者列表信息
export interface PatientInfoRes {
    user: User
    appointments: Appointments
}



// 检查项目响应体
export interface ExaminationInfoRes {
    patientId: number
    examinationItemsList: ExaminationItems[]
}

// 检查项
export interface ExaminationItems {
    id: number
    itemName: string
    departmentId: number
    itemPrice: number
    itemDescription: string
    createdAt: string
    updatedAt: string
}

// 保存检查项目请求体
export interface ExamSaveReq {
    patientId: number
    itemIdList: number[]
}

// 药品信息响应体
export interface DrugInfoRes {
    patientId: number
    prescriptionDrugsList: PrescriptionDrugs[]
}
// 保存药品请求体
export interface DrugSaveReq {
    patientId: number
    drugsUsageList: DrugsUsage[]
}
// 药品信息
export interface PrescriptionDrugs {
    id: number
    drugName: string
    drugSpecification: string
    drugPrice: number
    drugStock: number
    createdAt: string
    updatedAt: string
}
// 药品用法
export interface DrugsUsage extends PrescriptionDrugs{
    drugId: number
    dosage: string
    usage1: string
}

// 诊断结果详情
export interface ResultDetailRes {
    user: User
    appointments: Appointments
    diagnosisRecords: DiagnosisRecords
    orders: ExaminationOrders[]
    prescriptions: Prescriptions[]
}

// 诊断记录
export interface DiagnosisRecords {
    diagnosisResult: string
    createdAt: string
}

// 检查订单
export interface ExaminationOrders {
    id: number
    itemName: string
    itemPrice: number
    status: number
}

// 处方记录
export interface Prescriptions {
    id: number
    drugName: string
    dosage: string
    usage1: string
}

// 预支付信息
export interface PreFeeRes {
    priceTotal: string
    feeId: number
}
export interface UserInfoRes{
    city: string
    county: string
    createTime: string
    email: string
    gender: string
    id: number
    nickName: string
    password: string
    phone: string
    profilePicture: string
    province: string
    township: string
    updateTime: string
    username: string
    uuid: string
}
export interface ConfirmPreorderRes{
    appointmentId: number
    creatTimeStr: string
    departmentName: string
    doctorName: string
    doctorTitle: string
    score: number
    userInfo: UserInfoRes
    fee: number
}
