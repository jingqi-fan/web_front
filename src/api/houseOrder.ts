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

// 更新订单状态（支付）- 已弃用，请使用payHouseOrder方法
// 此方法存在潜在风险，可能会意外修改其他字段
export const updateHouseOrderStatus = async (orderId: number, status: number): Promise<number> => {
  console.warn('updateHouseOrderStatus方法已弃用，请使用payHouseOrder方法进行支付操作');
  
  // 为了安全起见，先获取完整的订单信息
  const existingOrder = await getHouseOrderById(orderId);
  
  // 只更新必要的字段，确保不修改deadline等关键字段
  const updateData = {
    id: orderId,
    userId: existingOrder.userId,
    houseId: existingOrder.houseId,
    deadline: existingOrder.deadline, // 明确保持原有的deadline
    startDate: existingOrder.startDate, // 明确保持原有的startDate
    status: status,
    price: existingOrder.price,
    orderTime: existingOrder.orderTime,
    payDate: new Date().toISOString(),
    promise: existingOrder.promise
  }
  
  const response = await axiosInstance.put('/houseOrders', updateData)
  return response.data
}

// 获取订单详情
export const getHouseOrderById = async (orderId: number): Promise<HouseOrder> => {
  const response = await axiosInstance.get(`/houseOrders/${orderId}`)
  return response.data
}

// 支付房屋订单
export const payHouseOrder = async (orderId: number): Promise<string> => {
  const response = await axiosInstance.post(`/houseOrders/pay/${orderId}`)
  return response.data
}

// 更新守约状态
export const updateComplianceStatus = async (): Promise<string> => {
  const response = await axiosInstance.post('/houseOrders/updateCompliance')
  return response.data
}