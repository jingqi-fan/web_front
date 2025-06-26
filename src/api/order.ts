import axiosInstance from '../plugins/axios';
import type { CommodityOrder, OrderInitResponse, PlaceOrderRequest, OrderListParams } from '../entity/Order'
import { ElMessage } from 'element-plus'

// 初始化订单
export const initOrder = async (commodityId: number, userId: number): Promise<OrderInitResponse> => {
  try {
    console.log('初始化订单请求:', { commodityId, userId })
    
    const response = await axiosInstance.post('/commodity-order/init-order', null, {
      params: {
        commodityId,
        userId
      }
    })
    
    console.log('初始化订单响应:', response.data)
    
    if (response.data.code === 200) {
      return response.data.data
    } else {
      throw new Error(response.data.message || '初始化订单失败')
    }
  } catch (error) {
    console.error('初始化订单失败:', error)
    ElMessage.error('初始化订单失败')
    throw error
  }
}

// 下单
export const placeOrder = async (orderData: PlaceOrderRequest): Promise<any> => {
  try {
    console.log('下单请求:', orderData)
    
    const response = await axiosInstance.post('/commodity-order/place-order', orderData)
    
    console.log('下单响应:', response.data)
    
    if (response.data.code === 200) {
      return response.data
    } else {
      throw new Error(response.data.message || '下单失败')
    }
  } catch (error) {
    console.error('下单失败:', error)
    ElMessage.error('下单失败')
    throw error
  }
}

// 根据用户ID查询订单列表
export const getOrdersByUserId = async (userId: number): Promise<CommodityOrder[]> => {
  try {
    console.log('查询用户订单:', { userId })
    
    const response = await axiosInstance.get(`/commodity-order/user/${userId}`)
    
    console.log('用户订单响应:', response.data)
    
    if (response.data.code === 200) {
      return response.data.data || []
    } else {
      throw new Error(response.data.message || '查询订单失败')
    }
  } catch (error) {
    console.error('查询订单失败:', error)
    ElMessage.error('查询订单失败')
    throw error
  }
}

// 根据ID查询订单详情
export const getOrderById = async (id: number): Promise<CommodityOrder> => {
  try {
    console.log('查询订单详情:', { id })
    
    const response = await axiosInstance.get(`/commodity-order/select/${id}`)
    
    console.log('订单详情响应:', response.data)
    
    if (response.data.code === 200) {
      return response.data.data
    } else {
      throw new Error(response.data.message || '查询订单详情失败')
    }
  } catch (error) {
    console.error('查询订单详情失败:', error)
    ElMessage.error('查询订单详情失败')
    throw error
  }
}

// 更新订单状态
export const updateOrderStatus = async (id: number, status: number): Promise<any> => {
  try {
    console.log('更新订单状态:', { id, status })
    
    const response = await axiosInstance.put(`/commodity-order/update-status/${id}`, null, {
      params: {
        status
      }
    })
    
    console.log('更新订单状态响应:', response.data)
    
    if (response.data.code === 200) {
      return response.data
    } else {
      throw new Error(response.data.message || '更新订单状态失败')
    }
  } catch (error) {
    console.error('更新订单状态失败:', error)
    ElMessage.error('更新订单状态失败')
    throw error
  }
}