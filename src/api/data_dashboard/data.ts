import axiosInstance from "../../plugins/axios.ts";

export interface CreditCategoryStats {
    category: string
    totalAmount: number
}

// 获取信用服务统计数据   总
export const fetchCreditCategoryStats = () => {
    return axiosInstance.get<CreditCategoryStats[]>('/dashboard/amount_count')
}
//按照城区
export function fetchCreditStatsByCounty(county: string) {
    return axiosInstance.get('/dashboard/amount_count_by_county', {
        params: { county }
    });
}
// 守约率
export const fetchCompletionRate = () => {
    return axiosInstance.get<number>('/dashboard/completion_rate')
}
//Top
export interface TopUser{
    nickName: string
    dimensionScore: number
    dimensionType: string
}
export const  getTopUsersByDimension=async () =>{
    const res=await axiosInstance.get<TopUser[]>("/dashboard/top_users");
    console.log(res)
    return res.data;
}

//people_count
export const fetchUserCount = () => {
    return axiosInstance.get<number>('/dashboard/people_count')
}

//使用量统计
export const fetchUsingCount = () => {
    return axiosInstance.get<number>('/dashboard/use_count')
}

export interface CountyIncome {
    county: string
    totalIncome: number
}

export function getIncomeByCounty() {
    return axiosInstance.get<CountyIncome[]>('/dashboard/income_count')
}

export interface DistrictScoreStats {
    county: string
    min: number
    q1: number
    median: number
    q3: number
    max: number
}

export function fetchScoreBoxPlot() {
    return axiosInstance.get<DistrictScoreStats[]>('/dashboard/credit_score')
}
export interface CreditRecordSimpleDTO {
    userId: number
    recordType: string
    amount: number
    status: string
}

export function fetchLatestCreditRecords() {
    return axiosInstance.get<CreditRecordSimpleDTO[]>('/dashboard/latest');
}