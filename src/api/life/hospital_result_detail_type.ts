// User 用户信息
export interface User {
    id: number
    uuid: string
    password: string
    nickName: string
    username: string
    profilePicture: string
    phone: string
    email: string
    gender: string
    province: string
    city: string
    county: string
    township: string
    createTime: string
    updateTime: string
}

// Appointments 预约信息
export interface Appointments {
    id: number
    userId: number
    doctorId: number
    departmentId: number
    appointmentTime: string
    reason: string
    contactPhone: string
    appointmentStatus: number
    createdAt: string
    updatedAt: string
}

// DiagnosisRecords 诊断记录
export interface DiagnosisRecords {
    id: number
    appointmentId: number
    doctorId: number
    diagnosisResult: string
    createdAt: string
    updatedAt: string
}

// ExaminationItems 检查项（嵌套于 orders 中）
export interface ExaminationItems {
    id: number
    itemName: string
    departmentId: number
    itemPrice: number
    itemDescription: string
    createdAt: string
    updatedAt: string
}

// ExaminationOrders 检查单
export interface ExaminationOrders {
    id: number
    appointmentId: number
    doctorId: number
    itemId: number
    orderStatus: number
    createdAt: string
    updatedAt: string
    examinationItem: ExaminationItems
}

// PrescriptionDrugs 药品详细信息（嵌套于 Prescriptions）
export interface PrescriptionDrugs {
    id: number
    drugName: string
    drugSpecification: string
    drugPrice: number
    drugStock: number
    createdAt: string
    updatedAt: string
}

// Prescriptions 处方记录
export interface Prescriptions {
    id: number
    appointmentId: number
    doctorId: number
    drugId: number
    dosage: string
    usage1: string
    prescriptionStatus: number
    createdAt: string
    updatedAt: string
    drugInfo: PrescriptionDrugs
}

// Fees 医疗费用
export interface Fees {
    id: number
    appointmentId: number
    examinationFee: number
    drugFee: number
    diagnosisFee: number
    totalFee: number
    discount: number | 0
    actualPayment: number
    paymentStatus: number
    createdAt: string
    updatedAt: string
}

// 最终接收对象：诊断详情页返回结构
export interface ResultDetailResType {
    user: User
    appointments: Appointments
    diagnosisRecords: DiagnosisRecords
    orders: ExaminationOrders[]
    prescriptions: Prescriptions[]
    reason: string
    diagnosisResult: string
    fees: Fees
}
