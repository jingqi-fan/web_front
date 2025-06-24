import axiosInstance from '../plugins/axios'
import type { HouseOrder, PlaceHouseOrderRequest, HouseOrderListParams } from '../entity/HouseOrder'

// 下单接口
export const placeHouseOrder = async (orderData: PlaceHouseOrderRequest): Promise<string> => {
  const response = await axiosInstance.post('/houseOrders/placeOrder', orderData)
  return response.data
}

// 根据用户ID获取房屋订单列表
export const getHouseOrdersByUserId = async (userId: number): Promise<HouseOrder[]> => {
  const response = await axiosInstance.get(`/houseOrders/user/${userId}`)
  return response.data
}

// 更新订单状态（支付）
export const updateHouseOrderStatus = async (orderId: number, status: number): Promise<number> => {
  const response = await axiosInstance.put('/houseOrders', {
    id: orderId,
    status: status,
    payDate: new Date().toISOString()
  })
  return response.data
}

// 获取订单详情
export const getHouseOrderById = async (orderId: number): Promise<HouseOrder> => {
  const response = await axiosInstance.get(`/houseOrders/${orderId}`)
  return response.data
}