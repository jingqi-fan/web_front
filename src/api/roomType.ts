// src/api/roomType.ts

import type { RoomType } from '../entity/RoomType'
import axiosInstance from '../plugins/axios'

/**
 * 获取指定酒店的所有房型
 */
export async function getRoomTypesByHotel(hotelId: number): Promise<RoomType[]> {
  const res = await axiosInstance.get<RoomType[]>(`/hotels/${hotelId}/room-types`)
  return res.data
}