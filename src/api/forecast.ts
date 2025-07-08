// src/api/forecast.ts
import axiosInstance from '../plugins/axios'

/**
 * 获取指定酒店在给定日期的未来 7 天入住率预测
 * @param hotelId 酒店 ID
 * @param currentDate 当前日期，格式 "yyyy-MM-dd"
 */
export async function getOccupancyForecast(
  hotelId: number,
  currentDate: string
): Promise<Record<string, number>> {
  const res = await axiosInstance.get<Record<string, number>>(
    `/hotels/occupancy?hotelId=${hotelId}&currentDate=${currentDate}`
  );
  return res.data;
}