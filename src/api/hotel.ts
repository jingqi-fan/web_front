// src/api/hotel.ts
import axios from '../plugins/axios'
import type { Hotel } from '../entity/Hotel'
import axiosInstance from '../plugins/axios'

/**
 * 条件筛选酒店列表
 */
export async function filterHotels(criteria: {
  minScore?: number,
  location?: string,
  minPrice?: number,
  maxPrice?: number
}): Promise<Hotel[]> {
  const res = await axiosInstance.get<Hotel[]>('/hotels/filter', { params: criteria })
  return res.data
}

/**
 * 精确名称搜索酒店
 */
export async function searchHotelsByName(name?: string): Promise<Hotel[]> {
  const res = await axiosInstance.get<Hotel[]>('/hotels/search', { params: { name } })
  return res.data
}

/**
 * 根据 ID 获取酒店详情
 */
export async function getHotelById(hotelId: number): Promise<Hotel> {
  const res = await axiosInstance.get<Hotel>(`/hotels/${hotelId}`)
  return res.data
}