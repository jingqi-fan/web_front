<template>
  <div class="records-page">
    <!-- 顶部返回 -->
    <div class="records-header">
      <el-button type="text" @click="goBack">
        <el-icon
          style="font-size: 32px; border-radius: 50%; background: var(--card-bg);
                 box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15); padding: 5px; cursor: pointer;"
        >
          <ArrowLeftBold />
        </el-icon>
      </el-button>
      <h2>预订记录</h2>
    </div>
    <!-- Tabs 切换 -->
    <el-tabs v-model="activeTab" @tab-click="onTabClick">
      <el-tab-pane label="信用购物" name="shopping" />
      <el-tab-pane label="信用租房" name="rental" />
      <el-tab-pane label="酒店预订" name="hotel" />
    </el-tabs>
    <!-- 表格内容 -->
    <div class="records-content">
      <!-- 信用购物订单列表 -->
      <div v-if="activeTab === 'shopping'">
        <!-- 加载状态 -->
        <div v-if="shoppingLoading" class="loading-container">
          <el-skeleton :rows="6" animated />
        </div>
        <!-- 订单列表 -->
        <div v-else-if="shoppingOrders.length > 0" class="orders-content">
          <div class="orders-list">
            <el-card 
              v-for="order in shoppingOrders" 
              :key="order.id" 
              class="order-card" 
              shadow="never">
              <div class="order-header">
                <div class="order-info">
                  <span class="order-id">订单号：#{{ order.id }}</span>
                  <span class="order-time">{{ formatDateTime(order.orderTime) }}</span>
                </div>
                <el-tag 
                  :type="getStatusTagType(order.finished)" 
                  class="status-tag">
                  {{ getStatusText(order.finished) }}
                </el-tag>
              </div>
              <div class="order-content">
                <div class="order-details">
                  <div class="detail-item">
                    <span class="detail-label">商品ID：</span>
                    <span class="detail-value">#{{ order.commodityId }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">购买数量：</span>
                    <span class="detail-value">{{ order.amount }}件</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">支付方式：</span>
                    <span class="detail-value">{{ getPaymentMethodText(order.method) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">收货地址：</span>
                    <span class="detail-value address">{{ order.address }}</span>
                  </div>
                </div>
                <div class="price-section">
                  <div class="price-item">
                    <span class="price-label">商品总价：</span>
                    <span class="price-value">¥{{ formatPrice(order.price) }}</span>
                  </div>
                  <div class="price-item">
                    <span class="price-label">运费：</span>
                    <span class="price-value">¥{{ formatPrice(order.freightAmount) }}</span>
                  </div>
                  <div class="price-item">
                    <span class="price-label">优惠折扣：</span>
                    <span class="price-value discount">-¥{{ formatPrice(order.discountAmount) }}</span>
                  </div>
                  <div class="price-item total">
                    <span class="price-label">实付金额：</span>
                    <span class="price-value total-amount">¥{{ formatPrice(order.actualAmount) }}</span>
                  </div>
                </div>
              </div>
              <div class="order-actions">
                <el-button 
                  size="small" 
                  @click="viewOrderDetails(order)">
                  查看详情
                </el-button>
                <el-button 
                  v-if="order.finished === 1" 
                  type="primary" 
                  size="small" 
                  @click="payOrder(order)">
                  立即支付
                </el-button>
                <el-button 
                  v-if="order.finished === 2 && order.payTime" 
                  type="success" 
                  size="small" 
                  disabled>
                  已完成
                </el-button>
              </div>
            </el-card>
          </div>
        </div>
        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-icon"></div>
          <div class="empty-text">暂无订单</div>
          <div class="empty-hint">快去购买心仪的商品吧</div>
          <el-button 
            @click="goShopping" 
            type="primary" 
            style="margin-top: 16px;">
            去购物
          </el-button>
        </div>
      </div>
      <!-- 信用租房订单列表 -->
      <div v-else-if="activeTab === 'rental'">

        <!-- 加载状态 -->
        <div v-if="rentalLoading" class="loading-container">
          <el-skeleton :rows="6" animated />
        </div>
        <!-- 订单列表 -->
        <div v-else-if="rentalOrders.length > 0" class="orders-content">
          <div class="orders-list">
            <el-card 
              v-for="order in rentalOrders" 
              :key="order.id" 
              class="order-card" 
              shadow="never">
              <div class="order-header">
                <div class="order-info">
                  <span class="order-id">订单号：#{{ order.id }}</span>
                  <span class="order-time">下单时间：{{ order.orderTime ? formatDateTimeBeijing(order.orderTime) : '未知时间' }}</span>
                </div>
                <el-tag 
                  :type="getRentalStatusTagType(order.status)" 
                  class="status-tag">
                  {{ getRentalStatusText(order.status) }}
                </el-tag>
              </div>
              <div class="order-content">
                <div class="order-details">
                  <div class="detail-item">
                    <span class="label">房屋ID：</span>
                    <span class="value">#{{ order.houseId }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">租期：</span>
                    <span class="value">{{ formatDateTimeBeijing(order.startDate) }} - {{ formatDateTimeBeijing(order.deadline) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">总租金：</span>
                    <span class="value price">¥{{ formatPrice(order.price) }}</span>
                  </div>
                  <div v-if="order.payDate" class="detail-item">
                    <span class="label">支付时间：</span>
                    <span class="value">{{ formatDateTimeBeijing(order.payDate) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">守约状态：</span>
                    <span class="value" :class="getPromiseStatusClass(order)">
                      {{ formatPromiseStatus(order) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="order-actions">
                <el-button 
                  v-if="order.status === 0" 
                  type="warning" 
                  size="small" 
                  @click="payRentalOrder(order)">
                  立即支付
                </el-button>
                <el-button 
                  v-if="order.status === 1" 
                  type="success" 
                  size="small" 
                  disabled>
                  已支付
                </el-button>
              </div>
            </el-card>
          </div>
        </div>
        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-icon"></div>
          <div class="empty-text">暂无租房订单</div>
          <div class="empty-hint">快去租赁心仪的房屋吧</div>
          <el-button 
            @click="goRental" 
            type="primary" 
            style="margin-top: 16px;">
            去租房
          </el-button>
        </div>
      </div>
      <!-- 酒店预订记录 -->
      <div v-else-if="activeTab === 'hotel'">
        <!-- 判断酒店数据是否为空 -->
       <div v-if="hotelRecords.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <div class="empty-text">暂无酒店预订记录</div>
        <div class="empty-hint">快去预订心仪的酒店吧</div>
        <el-button 
          @click="goHotel" 
          type="primary" 
          style="margin-top: 16px;">
          去预订酒店
        </el-button>
       </div>
       <div v-else><el-table
          :data="hotelRecords"
          stripe
          style="width: 100%;"
        >
          <!-- 1. 订单号 -->
          <el-table-column prop="orderId" label="订单号" width="80" />
          <!-- 原有列 -->
          <el-table-column
            prop="bookDate"
            label="预订日期"
            :formatter="formatDate"
          />
          <el-table-column prop="hotelName" label="酒店名称" />
          <el-table-column prop="typeName" label="房型" />
          <el-table-column prop="price" label="总价" />
          <el-table-column
            prop="checkinDate"
            label="入住日期"
            :formatter="formatDate"
          />
          <el-table-column
            prop="checkoutDate"
            label="截止日期"
            :formatter="formatDate"
          />
          <!-- 支付状态 -->
          <el-table-column label="支付状态" width="120">
            <template #default="{ row }">
              <el-button
                v-if="row.isPay === 0"
                type="warning"
                size="mini"
                @click="handleRepay(row)"
              >
                点击还款
              </el-button>
              <span v-else>已支付</span>
            </template>
          </el-table-column>
          <!-- 2. 守约状态 细化 -->
          <el-table-column label="守约状态" width="140">
            <template #default="{ row }">
              <span v-if="row.promise === 0">{{ formatRemainingDays(row) }}</span>
              <span v-else-if="row.promise === 1">守约</span>
              <span v-else-if="row.promise === 2">逾期{{ formatOverdueDays(row) }}天</span>
            </template>
          </el-table-column>
          <!-- 3. 取消预订 -->
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button
                v-if="row.isPay === 0 && isBeforeCheckin(row.checkinDate)"
                type="danger"
                size="mini"
                @click="handleCancel(row)"
              >
                取消预订
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
        
      </div>
    </div>
    <!-- 支付弹窗 -->
    <HotelPay
      v-if="selectedReservation"
      v-model="isHotelPayVisible"
      :reservation="selectedReservation"
      @success="onPaymentSuccess"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserInfoStore } from '../../stores/useUserInfoStore'
import {
  getReservationsByUserId,
  repayReservation,
  cancelReservation
} from '../../api/hotelReservation'
import { getHotelById } from '../../api/hotel'
import { getRoomTypesByHotel } from '../../api/roomType'
import { getOrdersByUserId, updateOrderStatus } from '../../api/order'
import { getHouseOrdersByUserId, payHouseOrder } from '../../api/houseOrder'
import type { HotelReservation } from '../../entity/HotelReservation'
import type { CommodityOrder } from '../../entity/Order'
import type { HouseOrder } from '../../entity/HouseOrder'
import { OrderStatus, PaymentMethod } from '../../entity/Order'
import HotelPay from './HotelPay.vue'
// 路由 & 返回
const router = useRouter()
function goBack() {
  router.back()
}
// Tabs 与数据
const activeTab = ref<'shopping' | 'rental' | 'hotel'>('shopping')
const shoppingOrders = ref<CommodityOrder[]>([])
const shoppingLoading = ref(false)
const rentalOrders = ref<HouseOrder[]>([])
const rentalLoading = ref(false)

const hotelRecords = ref<(HotelReservation & {
  hotelName: string
  typeName: string
})[]>([])
// 支付弹窗控制
const isHotelPayVisible = ref(false)
const selectedReservation = ref<HotelReservation & {
  hotelName: string
  typeName: string
} | null>(null)
/** 拉取并补全酒店预订记录 **/
async function loadHotelRecords() {
  const uid = useUserInfoStore().user.id
  let raw = await getReservationsByUserId(uid)
  raw.sort((a, b) => b.bookDate.localeCompare(a.bookDate))
  hotelRecords.value = await Promise.all(
    raw.map(async rec => {
      const hotel = await getHotelById(rec.hotelId)
      const types = await getRoomTypesByHotel(rec.hotelId)
      const rt = types.find(t => t.typeId === rec.typeId)
      return {
        ...rec,
        hotelName: hotel.hotelName,
        typeName: rt?.typeName || '未知房型'
      }
    })
  )
}
/** 加载信用购物订单 **/
async function loadShoppingOrders() {
  shoppingLoading.value = true
  try {
    const uid = useUserInfoStore().user.id
    shoppingOrders.value = await getOrdersByUserId(uid)
  } catch {
    ElMessage.error('获取订单列表失败，请稍后重试')
  } finally {
    shoppingLoading.value = false
  }
}
/** 加载信用租房订单 **/
async function loadRentalOrders() {
  rentalLoading.value = true
  try {
    const uid = useUserInfoStore().user.id
    rentalOrders.value = await getHouseOrdersByUserId(uid)
  } catch {
    ElMessage.error('获取房屋订单列表失败，请稍后重试')
  } finally {
    rentalLoading.value = false
  }
}
// Tabs 切换
function onTabClick(tab: any) {
  if (tab.name === 'shopping') {
    loadShoppingOrders()
  } else if (tab.name === 'rental') {
    loadRentalOrders()
  } else if (tab.name === 'hotel') {
    loadHotelRecords()
  }
}
// 初始化：加载默认 Tab 数据
onMounted(() => {
  loadShoppingOrders()
  loadRentalOrders()
  loadHotelRecords()
})
// 查看订单详情
function viewOrderDetails(order: CommodityOrder) {
  ElMessageBox.alert(
    `订单详情\n\n订单号：#${order.id}\n商品ID：#${order.commodityId}\n购买数量：${order.amount}件\n支付方式：${getPaymentMethodText(order.method)}\n下单时间：${formatDateTime(order.orderTime)}\n${order.payTime ? `支付时间：${formatDateTime(order.payTime)}` : ''}\n收货地址：${order.address}\n\n费用明细：\n商品总价：¥${formatPrice(order.price)}\n运费：¥${formatPrice(order.freightAmount)}\n优惠折扣：-¥${formatPrice(order.discountAmount)}\n实付金额：¥${formatPrice(order.actualAmount)}`,
    '订单详情',
    { confirmButtonText: '确定', type: 'info' }
  )
}
// 支付购物订单
async function payOrder(order: CommodityOrder) {
  try {
    await ElMessageBox.confirm(
      `确认支付订单 #${order.id}？\n实付金额：¥${formatPrice(order.actualAmount)}`,
      '确认支付',
      { confirmButtonText: '确认支付', cancelButtonText: '取消', type: 'warning' }
    )
    await updateOrderStatus(order.id!, OrderStatus.COMPLETED)
    ElMessage.success('支付成功！')
    loadShoppingOrders()
  } catch (error: any) {
    if (error !== 'cancel') ElMessage.error('支付失败，请稍后重试')
  }
}
// 支付租房订单
async function payRentalOrder(order: HouseOrder) {
  try {
    await ElMessageBox.confirm(
      `确认支付房屋订单 #${order.id}？\n月租金：¥${formatPrice(order.price)}`,
      '确认支付',
      { confirmButtonText: '确认支付', cancelButtonText: '取消', type: 'warning' }
    )
    await payHouseOrder(order.id!)
    ElMessage.success('支付成功！')
    loadRentalOrders()
  } catch (error: any) {
    if (error !== 'cancel') ElMessage.error('支付失败，请稍后重试')
  }
}
// 打开还款弹窗
function handleRepay(row: typeof selectedReservation.value) {
  selectedReservation.value = row
  isHotelPayVisible.value = true
}
// 支付完成回调
function onPaymentSuccess() {
  isHotelPayVisible.value = false
  ElMessage.success('还款成功')
  loadHotelRecords()
}
// 取消预订
async function handleCancel(row: HotelReservation & { hotelName: string; typeName: string }) {
  try {
    await ElMessageBox.confirm(
      `确定要取消该酒店预订吗？订单号：${row.orderId}`,
      '取消确认',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    await cancelReservation(row.orderId)
    ElMessage.success('取消预订成功')
    loadHotelRecords()
  } catch (err: any) {
    if (err !== 'cancel') ElMessage.error('取消预订失败：' + (err.message || err))
  }
}
// 工具函数
function formatDate(_: any, __: any, value: string) {
  return value ? value.split(' ')[0] : ''
}
function formatDateTime(dateTime: string | null | undefined) {
  if (!dateTime) return '-'
  const date = new Date(dateTime)
  return date.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

// 北京时间格式化函数
function formatDateTimeBeijing(dateString: string | null | undefined) {
  if (!dateString) return '未知时间'
  const date = new Date(dateString)
  // 直接使用北京时区格式化，不需要手动加8小时
  return date.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Shanghai'
  })
}
function formatPrice(price: number | null | undefined) {
  return price == null ? '0.00' : parseFloat(price.toString()).toFixed(2)
}
function getRentalStatusTagType(status: number) {
  return status === 0 ? 'warning' : status === 1 ? 'success' : 'info'
}
function getRentalStatusText(status: number) {
  return status === 0 ? '待支付' : status === 1 ? '已支付' : '未知状态'
}
function getStatusTagType(status: number) {
  switch (status) {
    case OrderStatus.PENDING_PAYMENT: return 'warning'
    case OrderStatus.COMPLETED: return 'success'
    default: return 'info'
  }
}
function getStatusText(status: number) {
  switch (status) {
    case OrderStatus.PENDING_PAYMENT: return '待支付'
    case OrderStatus.COMPLETED: return '已完成'
    default: return '未知状态'
  }
}
function getPaymentMethodText(method: string) {
  return method === PaymentMethod.IMMEDIATE
    ? '立即支付'
    : method === PaymentMethod.CASH_ON_DELIVERY
      ? '货到付款'
      : '未知方式'
}
function diffDays(late: string, early: string) {
  const dLate = new Date(late.split(' ')[0]).getTime()
  const dEarly = new Date(early.split(' ')[0]).getTime()
  return Math.floor((dLate - dEarly) / (1000 * 3600 * 24))
}
function formatRemainingDays(row: any) {
  const today = new Date().toISOString().split('T')[0]
  return `剩余${diffDays(row.checkoutDate, today)}天`
}
function formatOverdueDays(row: { checkoutDate: string; payDate?: string }) {
  const baseDate = row.payDate ? row.payDate.split(' ')[0] : new Date().toISOString().split('T')[0]
  return diffDays(baseDate, row.checkoutDate)
}
function isBeforeCheckin(checkin: string) {
  const today = new Date().toISOString().split('T')[0]
  return new Date(today).getTime() < new Date(checkin.split(' ')[0]).getTime()
}

// 房屋订单守约状态格式化
function formatPromiseStatus(order: any) {
  const today = new Date().toISOString().split('T')[0]
  const deadline = order.deadline ? order.deadline.split(' ')[0] : null
  
  if (!deadline) return '未知状态'
  
  // promise状态说明：
  // 0: 守约/剩余天数 (未支付且未到期 或 已支付且在截止日期前支付)
  // 1: 逾期天数 (未支付且已过期)
  // 2: 固定逾期状态 (已支付但在截止日期后支付)
  
  if (order.promise === 0) {
    // 已支付的情况
    if (order.status === 1) {
      return '守约'
    }
    // 未支付的情况
    else if (order.status === 0) {
      const remainingDays = diffDays(deadline, today)
      if (remainingDays > 0) {
        return `剩余${remainingDays}天`
      } else if (remainingDays === 0) {
        return '今日到期'
      } else {
        // remainingDays < 0，表示已经逾期
        const overdueDays = Math.abs(remainingDays)
        return `逾期${overdueDays}天`
      }
    }
    return '守约'
  } else if (order.promise === 1) {
    // 未支付且已逾期
    const overdueDays = diffDays(today, deadline)
    return `逾期${overdueDays}天`
  } else if (order.promise === 2) {
    // 已支付但逾期支付，显示固定逾期天数
    const payDate = order.payDate ? order.payDate.split(' ')[0] : today
    const overdueDays = diffDays(payDate, deadline)
    return `逾期${overdueDays}天`
  }
  
  return '未知状态'
}

// 房屋订单守约状态样式类
function getPromiseStatusClass(order: any) {
  if (order.promise === 1 || order.promise === 2) {
    return { 'overdue': true }
  } else if (order.promise === 0 && order.status === 0) {
    const today = new Date().toISOString().split('T')[0]
    const deadline = order.deadline ? order.deadline.split(' ')[0] : null
    if (deadline) {
      const remainingDays = diffDays(deadline, today)
      // 如果已经逾期（remainingDays < 0），应用逾期样式
      if (remainingDays < 0) {
        return { 'overdue': true }
      }
      // 未支付但还有剩余时间，显示警告色
      else if (remainingDays <= 3 && remainingDays > 0) {
        return { 'warning': true }
      }
    }
  }
  return {}
}
</script>
<style scoped>
.records-page {
  padding: 24px;
}
.records-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.records-header h2 {
  flex: 1;
  text-align: center;
  margin: 0;
}
.records-header .el-button {
  padding: 0;
}
.records-content {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
}
/* 订单列表样式 */
.orders-content {
  padding: 20px;
}
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.order-card {
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}
.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.order-id {
  font-weight: 600;
  color: #303133;
  font-size: 16px;
}
.order-time {
  color: #909399;
  font-size: 14px;
}
.status-tag {
  font-weight: 500;
}
.order-content {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}
.order-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.detail-item {
  display: flex;
  align-items: center;
}
.detail-label {
  color: #606266;
  font-size: 14px;
  min-width: 80px;
}
.detail-value {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}
.detail-value.address {
  max-width: 300px;
  word-break: break-all;
}
.price-section {
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}
.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price-label {
  color: #606266;
  font-size: 14px;
}
.price-value {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}
.price-value.discount {
  color: #67c23a;
}
.price-item.total {
  padding-top: 6px;
  border-top: 1px solid #e4e7ed;
  margin-top: 6px;
}
.total-amount {
  color: #e6a23c !important;
  font-size: 16px !important;
  font-weight: 600 !important;
}
.order-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.loading-container {
  padding: 20px;
}
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}
.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}
.empty-text {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #606266;
}
.empty-hint {
  font-size: 14px;
  color: #909399;
}
.price {
  font-weight: 600;
  color: #e74c3c;
}
.overdue {
  color: #e74c3c;
  font-weight: 600;
}
.warning {
  color: #e6a23c;
  font-weight: 600;
}
</style>

