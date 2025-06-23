import axiosInstance from "../plugins/axios";
import type { House, HouseSearchParams, HouseListResponse } from "../entity/House.ts";
import type { HouseDetails, HouseDetailsResponse } from "../entity/HouseDetails.ts";
import type { Result } from "../entity/result.ts";
import { ElMessage } from "element-plus";

// 获取房源列表
export const getHouseList = async (params?: HouseSearchParams): Promise<HouseListResponse> => {
    try {
        const response = await axiosInstance.get<Result<HouseListResponse>>('/houses', {
            params
        });
        
        if (response.data && response.data.data) {
            return response.data.data;
        } else if (Array.isArray(response.data)) {
            // 兼容直接返回数组的情况
            return {
                records: response.data as House[],
                total: response.data.length,
                size: params?.pageSize || 10,
                current: params?.pageNum || 1,
                pages: Math.ceil(response.data.length / (params?.pageSize || 10))
            };
        }
        
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('获取房源列表失败:', error);
        ElMessage.error('获取房源列表失败');
        throw error;
    }
};

// 根据标题搜索房源
export const searchHouseByTitle = async (title: string, pageNum: number = 1, pageSize: number = 10): Promise<HouseListResponse> => {
    return getHouseList({
        title,
        pageNum,
        pageSize
    });
};

// 多条件筛选房源
export const filterHouses = async (params: HouseSearchParams): Promise<HouseListResponse> => {
    return getHouseList(params);
};

// 获取房源详情
export const getHouseDetails = async (id: number): Promise<HouseDetailsResponse> => {
    try {
        const response = await axiosInstance.get<Result<HouseDetailsResponse>>(`/house-details/${id}`);
        
        if (response.data && response.data.data) {
            return response.data.data;
        }
        
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('获取房源详情失败:', error);
        ElMessage.error('获取房源详情失败');
        throw error;
    }
};

// 获取区域列表
export const getDistrictOptions = async (): Promise<string[]> => {
    try {
        const response = await getHouseList();
        const uniqueDistricts = [...new Set(response.records.map(item => item.district))];
        return uniqueDistricts.filter(district => district && district.trim());
    } catch (error) {
        console.error('获取区域列表失败:', error);
        // 返回默认区域
        return ['西湖区', '拱墅区', '江干区', '下城区', '上城区', '滨江区', '萧山区', '余杭区'];
    }
};