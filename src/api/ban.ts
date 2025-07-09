// src/api/ban.ts
import axiosInstance from '../plugins/axios'

// 封禁恢复结果接口
export interface BanRecoveryResult {
  userId: number
  canRecover: boolean
  unpaidHouseOrders: number
  unpaidHotelOrders: number
  unpaidCommodityOrders?: number
  reasons: string[]
}

/**
 * 检查用户恢复资格
 * @param userId 用户ID
 * @returns 恢复资格检查结果
 */
export const checkRecoveryEligibility = async (userId: number): Promise<BanRecoveryResult> => {
  const response = await axiosInstance.get('/houses/recovery-eligibility', {
    params: { userId }
  })
  return response.data
}

/**
 * 恢复用户（统一接口）
 * @param userId 用户ID
 * @returns 恢复结果消息
 */
export const recoverUser = async (userId: number): Promise<string> => {
  const response = await axiosInstance.post('/houses/recover', null, {
    params: { userId }
  })
  return response.data
}

/**
 * 检查用户是否被封禁
 * @param userId 用户ID
 * @returns 1表示被封禁，0表示未被封禁
 */
export const checkBanStatus = async (userId: number): Promise<number> => {
  const response = await axiosInstance.get('/houses/checkban', {
    params: { userId }
  })
  return response.data
}