
import type { Commodity, CommoditySearchParams, CommodityListResponse } from "../entity/Commodity.ts";
import { ElMessage } from "element-plus";
import axiosInstance from '../plugins/axios';

// 获取商品列表
export const getCommodityList = async (params?: CommoditySearchParams): Promise<CommodityListResponse> => {
    try {
        console.log('获取商品列表，参数:', params);
        
        // 判断是否有搜索/筛选条件
        const hasSearchConditions = params && (
            params.name || 
            params.category || 
            params.minPrice !== undefined || 
            params.maxPrice !== undefined
        );
        
        let response;
        
        if (hasSearchConditions) {
            console.log('使用多条件筛选接口');
            // 有搜索条件时使用筛选接口
            response = await filterCommodities(params);
            return response;
        } else {
            console.log('使用基础列表接口');
            // 没有搜索条件时使用基础列表接口
            const requestParams = {
                page: params?.pageNum || 1,
                size: params?.pageSize || 10
            };
            
            response = await axiosInstance.get('/commodities/list', {
                params: requestParams
            });
        }
        
        // 处理 MyBatis Plus Page 对象响应
        if (response.data) {
            // 如果是包装在 Result 中的数据
            if (response.data.data) {
                return {
                    records: response.data.data.records || [],
                    total: response.data.data.total || 0,
                    size: response.data.data.size || (params?.pageSize || 10),
                    current: response.data.data.current || (params?.pageNum || 1),
                    pages: response.data.data.pages || 1
                };
            }
            // 如果直接返回 Page 对象
            else if (response.data.records) {
                return {
                    records: response.data.records,
                    total: response.data.total,
                    size: response.data.size,
                    current: response.data.current,
                    pages: response.data.pages
                };
            }
            // 兼容直接返回数组的情况
            else if (Array.isArray(response.data)) {
                return {
                    records: response.data as Commodity[],
                    total: response.data.length,
                    size: params?.pageSize || 10,
                    current: params?.pageNum || 1,
                    pages: Math.ceil(response.data.length / (params?.pageSize || 10))
                };
            }
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
        console.log('请求商品详情，ID:', id);
        const response = await axiosInstance.get(`/commodities/${id}`);
        
        console.log('商品详情API响应状态:', response.status);
        console.log('商品详情API响应头:', response.headers);
        console.log('商品详情API响应数据:', response.data);
        console.log('响应数据类型:', typeof response.data);
        
        // 检查响应是否存在
        if (!response || !response.data) {
            console.error('响应为空或无数据');
            throw new Error('Empty response from server');
        }
        
        const data = response.data;
        
        // 检查多种可能的响应格式
        // 格式1: 标准Result包装格式 { code, message, data }
        if (data.code !== undefined && data.data) {
            console.log('使用标准Result格式，code:', data.code);
            if (data.code === 200 || data.code === 0) {
                return data.data;
            } else {
                throw new Error(`API返回错误: ${data.message || '未知错误'}`);
            }
        }
        // 格式2: 直接返回商品对象（检查必要字段）
        else if (data.id && data.name && data.price !== undefined) {
            console.log('使用直接商品对象格式');
            return data as Commodity;
        }
        // 格式3: 检查是否有其他字段包含商品数据
        else if (data.commodity && data.commodity.id) {
            console.log('使用commodity字段格式');
            return data.commodity;
        }
        // 格式4: 检查是否是数组格式（可能返回单个元素的数组）
        else if (Array.isArray(data) && data.length > 0 && data[0].id) {
            console.log('使用数组格式，取第一个元素');
            return data[0];
        }
        
        console.error('无法识别的响应格式:');
        console.error('数据结构:', JSON.stringify(data, null, 2));
        console.error('数据键:', Object.keys(data));
        throw new Error(`Invalid response format: ${JSON.stringify(data)}`);
    } catch (error) {
        console.error('获取商品详情失败:', error);
        if (error.response) {
            console.error('错误响应状态:', error.response.status);
            console.error('错误响应数据:', error.response.data);
            ElMessage.error(`获取商品详情失败: ${error.response.status} ${error.response.data?.message || error.message}`);
        } else if (error.request) {
            console.error('网络请求失败:', error.request);
            ElMessage.error('网络连接失败，请检查网络设置');
        } else {
            ElMessage.error(`获取商品详情失败: ${error.message}`);
        }
        throw error;
    }
};

// 按名称搜索商品 - 直接调用后端searchByName接口
export const searchCommodityByName = async (name: string, pageNum: number = 1, pageSize: number = 10): Promise<CommodityListResponse> => {
    try {
        const response = await axiosInstance.get('/commodities/searchByName', {
            params: {
                name,
                page: pageNum,
                size: pageSize
            }
        });
        
        // 处理 MyBatis Plus Page 对象响应
        if (response.data) {
            if (response.data.data) {
                return {
                    records: response.data.data.records || [],
                    total: response.data.data.total || 0,
                    size: response.data.data.size || pageSize,
                    current: response.data.data.current || pageNum,
                    pages: response.data.data.pages || 1
                };
            } else if (response.data.records) {
                return {
                    records: response.data.records,
                    total: response.data.total,
                    size: response.data.size,
                    current: response.data.current,
                    pages: response.data.pages
                };
            }
        }
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('按名称搜索商品失败:', error);
        ElMessage.error('按名称搜索商品失败');
        throw error;
    }
};

// 按分类筛选商品 - 直接调用后端filterByCategory接口
export const filterCommodityByCategory = async (category: string, pageNum: number = 1, pageSize: number = 10): Promise<CommodityListResponse> => {
    try {
        const response = await axiosInstance.get('/commodities/filterByCategory', {
            params: {
                category,
                page: pageNum,
                size: pageSize
            }
        });
        
        // 处理 MyBatis Plus Page 对象响应
        if (response.data) {
            if (response.data.data) {
                return {
                    records: response.data.data.records || [],
                    total: response.data.data.total || 0,
                    size: response.data.data.size || pageSize,
                    current: response.data.data.current || pageNum,
                    pages: response.data.data.pages || 1
                };
            } else if (response.data.records) {
                return {
                    records: response.data.records,
                    total: response.data.total,
                    size: response.data.size,
                    current: response.data.current,
                    pages: response.data.pages
                };
            }
        }
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('按分类筛选商品失败:', error);
        ElMessage.error('按分类筛选商品失败');
        throw error;
    }
};

// 按价格范围筛选商品 - 直接调用后端filterByPriceRange接口
export const filterCommodityByPriceRange = async (minPrice?: number, maxPrice?: number, pageNum: number = 1, pageSize: number = 10): Promise<CommodityListResponse> => {
    try {
        const params: any = {
            page: pageNum,
            size: pageSize
        };
        if (minPrice !== undefined) params.minPrice = minPrice;
        if (maxPrice !== undefined) params.maxPrice = maxPrice;
        
        const response = await axiosInstance.get('/commodities/filterByPriceRange', {
            params
        });
        
        // 处理 MyBatis Plus Page 对象响应
        if (response.data) {
            if (response.data.data) {
                return {
                    records: response.data.data.records || [],
                    total: response.data.data.total || 0,
                    size: response.data.data.size || pageSize,
                    current: response.data.data.current || pageNum,
                    pages: response.data.data.pages || 1
                };
            } else if (response.data.records) {
                return {
                    records: response.data.records,
                    total: response.data.total,
                    size: response.data.size,
                    current: response.data.current,
                    pages: response.data.pages
                };
            }
        }
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('按价格范围筛选商品失败:', error);
        ElMessage.error('按价格范围筛选商品失败');
        throw error;
    }
};

// 多条件筛选商品 - 直接调用后端filter接口
export const filterCommodities = async (params: CommoditySearchParams): Promise<CommodityListResponse> => {
    try {
        const requestParams: any = {
            page: params.pageNum || 1,
            size: params.pageSize || 10
        };
        if (params.name) requestParams.name = params.name;
        if (params.category) requestParams.category = params.category;
        if (params.minPrice !== undefined) requestParams.minPrice = params.minPrice;
        if (params.maxPrice !== undefined) requestParams.maxPrice = params.maxPrice;
        
        const response = await axiosInstance.get('/commodities/filter', {
            params: requestParams
        });
        
        // 处理 MyBatis Plus Page 对象响应
        if (response.data) {
            if (response.data.data) {
                return {
                    records: response.data.data.records || [],
                    total: response.data.data.total || 0,
                    size: response.data.data.size || (params.pageSize || 10),
                    current: response.data.data.current || (params.pageNum || 1),
                    pages: response.data.data.pages || 1
                };
            } else if (response.data.records) {
                return {
                    records: response.data.records,
                    total: response.data.total,
                    size: response.data.size,
                    current: response.data.current,
                    pages: response.data.pages
                };
            }
        }
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('多条件筛选商品失败:', error);
        ElMessage.error('多条件筛选商品失败');
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