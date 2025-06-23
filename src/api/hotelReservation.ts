import axiosInstance from '../plugins/axios'
import type { HotelReservation } from '../entity/HotelReservation'

/**
 * 创建酒店预订记录
 * POST /hotels/reservation
 */
export async function createReservation(
  data: HotelReservation
): Promise<HotelReservation> {
  console.log("createReservation",data)
  const res = await axiosInstance.post<HotelReservation>(
    `/hotels/reservation`,
    data
  )
  return res.data
}


/**
 * 获取某用户的所有酒店预订记录
 */
export async function getReservationsByUserId(
  userId: number
): Promise<HotelReservation[]> {
  const res = await axiosInstance.get<HotelReservation[]>(
    `/hotels/reservation?userId=${userId}`
  )
  return res.data
}

/**
 * 对指定订单进行还款
 * PUT /hotels/reservation/{orderId}/repay
 */
export async function repayReservation(
  orderId: number
): Promise<HotelReservation> {
  const res = await axiosInstance.put<HotelReservation>(
    `/hotels/reservation/${orderId}/repay`
  )
  return res.data
}