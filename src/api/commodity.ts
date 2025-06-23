
import type { Commodity, CommoditySearchParams, CommodityListResponse } from "../entity/Commodity.ts";
import type { Result } from "../entity/result.ts";
import { ElMessage } from "element-plus";
import axiosInstance from '../plugins/axios';

// 获取商品列表
export const getCommodityList = async (params?: CommoditySearchParams): Promise<CommodityListResponse> => {
    try {
        const response = await axiosInstance.get('/commodities', {
            params
        });
        
        if (response.data && response.data.data) {
            return response.data.data;
        } else if (Array.isArray(response.data)) {
            // 兼容直接返回数组的情况
            return {
                records: response.data as Commodity[],
                total: response.data.length,
                size: params?.pageSize || 10,
                current: params?.pageNum || 1,
                pages: Math.ceil(response.data.length / (params?.pageSize || 10))
            };
        }
        
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('获取商品列表失败:', error);
        ElMessage.error('获取商品列表失败');
        throw error;
    }
};

// 获取商品详情
export const getCommodityDetails = async (id: number): Promise<Commodity> => {
    try {
        const response = await axiosInstance.get<Result<Commodity>>(`/commodities/${id}`);
        
        if (response.data && response.data.data) {
            return response.data.data;
        }
        
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('获取商品详情失败:', error);
        ElMessage.error('获取商品详情失败');
        throw error;
    }
};

// 获取商品分类列表
export const getCommodityCategories = async (): Promise<string[]> => {
    try {
        const response = await getCommodityList();
        const uniqueCategories = [...new Set(response.records.map(item => item.category))];
        return uniqueCategories.filter(category => category && category.trim());
    } catch (error) {
        console.error('获取分类列表失败:', error);
        // 返回默认分类
        return ['电子产品', '服装', '图书', '家居', '食品', '运动', '美妆'];
    }
};