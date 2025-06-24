import axiosInstance from '../plugins/axios'
import type { House, HouseSearchParams, HouseListResponse } from "../entity/House.ts";
import type { HouseDetails, HouseDetailsResponse } from "../entity/HouseDetails.ts";
import type { Result } from "../entity/result.ts";
import { ElMessage } from "element-plus";

// 根据ID获取房屋基本信息
export const getHouseById = async (id: number): Promise<House> => {
    try {
        const response = await axiosInstance.get(`/houses/${id}`);
        return response.data;
    } catch (error) {
        console.error('获取房屋信息失败:', error);
        ElMessage.error('获取房屋信息失败');
        throw error;
    }
};
// 获取房源列表
export const getHouseList = async (params?: HouseSearchParams): Promise<HouseListResponse> => {
    try {
        console.log('获取房源列表，参数:', params);
        
        // 判断是否有搜索/筛选条件
        const hasSearchConditions = params && (
            params.title || 
            params.district || 
            params.rentalType || 
            params.minPrice !== undefined || 
            params.maxPrice !== undefined
        );
        
        let response;
        
        if (hasSearchConditions) {
            console.log('使用多条件筛选接口');
            // 有搜索条件时使用筛选接口
            response = await filterHouses(params);
            return response;
        } else {
            console.log('使用基础列表接口');
            // 没有搜索条件时使用基础列表接口
            const requestParams = {
                page: params?.pageNum || 1,
                size: params?.pageSize || 10
            };
            
            response = await axiosInstance.get<Result<HouseListResponse>>('/houses/list', {
                params: requestParams
            });
        }
        
        // 处理不同格式的响应数据
        let pageData;
        if (response.data && response.data.data) {
            // 数据包装在 Result 中
            pageData = response.data.data;
        } else if (response.data && typeof response.data === 'object' && 'records' in response.data) {
            // 直接返回 Page 对象
            pageData = response.data;
        } else if (Array.isArray(response.data)) {
            // 兼容直接返回数组的情况
            pageData = {
                records: response.data as House[],
                total: response.data.length,
                size: (params?.pageSize || 10),
                current: (params?.pageNum || 1),
                pages: Math.ceil(response.data.length / (params?.pageSize || 10))
            };
        } else {
            throw new Error('Invalid response format');
        }
        
        // 确保返回正确的分页格式
         return {
             records: pageData.records || [],
             total: pageData.total || 0,
             size: pageData.size || (params?.pageSize || 10),
             current: pageData.current || (params?.pageNum || 1),
             pages: pageData.pages || Math.ceil((pageData.total || 0) / (params?.pageSize || 10))
         };
    } catch (error) {
        console.error('获取房源列表失败:', error);
        ElMessage.error('获取房源列表失败');
        throw error;
    }
};

// 根据标题搜索房源 - 直接调用后端searchByTitle接口
export const searchHouseByTitle = async (title: string, pageNum: number = 1, pageSize: number = 10): Promise<HouseListResponse> => {
    try {
        const response = await axiosInstance.get('/houses/searchByTitle', {
            params: {
                title,
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
        console.error('按标题搜索房源失败:', error);
        ElMessage.error('按标题搜索房源失败');
        throw error;
    }
};

// 多条件筛选房源 - 直接调用后端filter接口
export const filterHouses = async (params: HouseSearchParams): Promise<HouseListResponse> => {
    try {
        const requestParams: any = {
            page: params.pageNum || 1,
            size: params.pageSize || 10
        };
        if (params.title) requestParams.title = params.title;
        if (params.district) requestParams.district = params.district;
        if (params.rentalType) requestParams.rentalType = params.rentalType;
        if (params.minPrice !== undefined) requestParams.minPrice = params.minPrice;
        if (params.maxPrice !== undefined) requestParams.maxPrice = params.maxPrice;
        
        const response = await axiosInstance.get('/houses/filter', {
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
        console.error('多条件筛选房源失败:', error);
        ElMessage.error('多条件筛选房源失败');
        throw error;
    }
};

// 获取房源详情
export const getHouseDetails = async (id: number): Promise<HouseDetailsResponse> => {
    try {
        console.log('请求房源详情，ID:', id);
        const response = await axiosInstance.get(`/house-details/${id}`);
        
        console.log('房源详情API响应状态:', response.status);
        console.log('房源详情API响应头:', response.headers);
        console.log('房源详情API响应数据:', response.data);
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
        // 格式2: 直接返回HouseDetailsResponse格式（包含houseDetails和house字段）
        else if (data.houseDetails && data.house) {
            console.log('使用直接HouseDetailsResponse格式');
            return data as HouseDetailsResponse;
        }
        // 格式3: 检查是否是单独的房源详情对象（需要转换为HouseDetailsResponse格式）
        else if (data.id && data.houseId) {
            console.log('使用单独房源详情对象格式，需要转换');
            // 这种情况下，需要额外获取房源基本信息
            throw new Error('需要完整的房源详情和基本信息');
        }
        // 格式4: 检查是否是数组格式（可能返回单个元素的数组）
        else if (Array.isArray(data) && data.length > 0) {
            console.log('使用数组格式，取第一个元素');
            const firstItem = data[0];
            if (firstItem.houseDetails && firstItem.house) {
                return firstItem;
            }
        }
        
        console.error('无法识别的响应格式:');
        console.error('数据结构:', JSON.stringify(data, null, 2));
        console.error('数据键:', Object.keys(data));
        throw new Error(`Invalid response format: ${JSON.stringify(data)}`);
    } catch (error) {
        console.error('获取房源详情失败:', error);
        if (error.response) {
            console.error('错误响应状态:', error.response.status);
            console.error('错误响应数据:', error.response.data);
            ElMessage.error(`获取房源详情失败: ${error.response.status} ${error.response.data?.message || error.message}`);
        } else if (error.request) {
            console.error('网络请求失败:', error.request);
            ElMessage.error('网络连接失败，请检查网络设置');
        } else {
            ElMessage.error(`获取房源详情失败: ${error.message}`);
        }
        throw error;
    }
};

// 按区域筛选房源 - 直接调用后端filterByDistrict接口
export const filterHouseByDistrict = async (district: string, pageNum: number = 1, pageSize: number = 10): Promise<HouseListResponse> => {
    try {
        const response = await axiosInstance.get('/houses/filterByDistrict', {
            params: {
                district,
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
        console.error('按区域筛选房源失败:', error);
        ElMessage.error('按区域筛选房源失败');
        throw error;
    }
};

// 按租赁类型筛选房源 - 直接调用后端filterByRentalType接口
export const filterHouseByRentalType = async (rentalType: string, pageNum: number = 1, pageSize: number = 10): Promise<HouseListResponse> => {
    try {
        const response = await axiosInstance.get('/houses/filterByRentalType', {
            params: {
                rentalType,
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
        console.error('按租赁类型筛选房源失败:', error);
        ElMessage.error('按租赁类型筛选房源失败');
        throw error;
    }
};

// 按价格范围筛选房源 - 直接调用后端filterByPriceRange接口
export const filterHouseByPriceRange = async (minPrice?: number, maxPrice?: number, pageNum: number = 1, pageSize: number = 10): Promise<HouseListResponse> => {
    try {
        const params: any = {
            page: pageNum,
            size: pageSize
        };
        if (minPrice !== undefined) params.minPrice = minPrice;
        if (maxPrice !== undefined) params.maxPrice = maxPrice;
        
        const response = await axiosInstance.get('/houses/filterByPriceRange', {
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
        console.error('按价格范围筛选房源失败:', error);
        ElMessage.error('按价格范围筛选房源失败');
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