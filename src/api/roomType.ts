// src/api/roomType.ts
import axios from '../plugins/axios'
import type { RoomType } from '../entity/RoomType'

/**
 * 获取指定酒店的所有房型
 */
export async function getRoomTypesByHotel(hotelId: number): Promise<RoomType[]> {
  const res = await axios.get<RoomType[]>(`/hotels/${hotelId}/room-types`)
  return res.data
}