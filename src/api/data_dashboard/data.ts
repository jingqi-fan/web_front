import axiosInstance from "../../plugins/axios.ts";

export interface CreditCategoryStats {
    category: string
    totalAmount: number
}

// 获取信用服务统计数据
export const fetchCreditCategoryStats = () => {
    return axiosInstance.get<CreditCategoryStats[]>('/dashboard/amount_count')
}


//people_count
export const fetchUserCount = () => {
    return axiosInstance.get<number>('/dashboard/people_count')
}

export interface CountyIncome {
    county: string
    totalIncome: number
}

export function getIncomeByCounty() {
    return axiosInstance.get<CountyIncome[]>('/dashboard/income_count')
}