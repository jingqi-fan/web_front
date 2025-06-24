<template>
  <div class="records-page">
    <!-- 顶部返回 -->
    <div class="records-header">
      <el-button link @click="goBack">
        <el-icon style="font-size: 32px; border-radius: 50%; background: var(--card-bg);
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15); padding: 5px; cursor: pointer;">
          <ArrowLeftBold />
        </el-icon>
      </el-button>
      <h2>预订记录</h2>
    </div>

    <!-- 分类 Tabs -->
    <el-tabs v-model="activeTab" @tab-click="onTabClick">
      <el-tab-pane label="信用购物" name="shopping" />
      <el-tab-pane label="信用租房" name="rental" />
      <el-tab-pane label="酒店预订" name="hotel" />
    </el-tabs>

    <!-- 切换内容 -->
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
          <div class="empty-icon">📦</div>
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
                  <span class="order-time">{{ formatDateTime(order.startDate) }}</span>
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
                    <span class="value">{{ formatDateTime(order.startDate) }} - {{ formatDateTime(order.deadline) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">月租金：</span>
                    <span class="value price">¥{{ formatPrice(order.price) }}</span>
                  </div>
                  <div v-if="order.payDate" class="detail-item">
                    <span class="label">支付时间：</span>
                    <span class="value">{{ formatDateTime(order.payDate) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">守约状态：</span>
                    <span class="value" :class="{ 'overdue': order.promise === 1 }">
                      {{ order.promise === 0 ? '守约' : '逾期' }}
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
          <div class="empty-icon">🏠</div>
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
      <el-table
        v-else
        :data="hotelRecords"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="bookDate"     label="预订日期"    />
        <el-table-column prop="hotelName"    label="酒店名称"    />
        <el-table-column prop="typeName"     label="房型"        />
        <el-table-column prop="price"        label="总价"        />
        <el-table-column prop="checkinDate"  label="入住日期" :formatter="formatDate"   />
        <el-table-column prop="checkoutDate" label="截止日期" :formatter="formatDate" />

        <!-- 支付状态：未支付时显示按钮，已支付时文字 -->
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

        <!-- 守约状态 -->
        <el-table-column
          prop="promise"
          label="守约状态"
          width="100"
          :formatter="formatPromise"
        />
      </el-table>
    </div>

    <!-- 自定义支付弹窗 -->
    <HotelPay
      v-model="isHotelPayVisible"
      v-if="selectedReservation"
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
import { getReservationsByUserId } from '../../api/hotelReservation'
import { getHotelById } from '../../api/hotel'
import { getRoomTypesByHotel } from '../../api/roomType'
import { getOrdersByUserId, updateOrderStatus } from '../../api/order'
import { getHouseOrdersByUserId, updateHouseOrderStatus } from '../../api/houseOrder'
import type { HotelReservation } from '../../entity/HotelReservation'
import type { Hotel } from '../../entity/Hotel'
import type { RoomType } from '../../entity/RoomType'
import type { CommodityOrder } from '../../entity/Order'
import type { HouseOrder } from '../../entity/HouseOrder'
import { OrderStatus, PaymentMethod } from '../../entity/Order'
import HotelPay from './HotelPay.vue'

const router = useRouter()
function goBack() {
  router.back()
} 

const activeTab = ref<'shopping' | 'rental' | 'hotel'>('shopping')
const hotelRecords = ref<Array<HotelReservation & {
  hotelName: string
  typeName: string
}>>([])

// 信用购物订单相关
const shoppingOrders = ref<CommodityOrder[]>([])
const shoppingLoading = ref(false)

// 信用租房订单相关
const rentalOrders = ref<HouseOrder[]>([])
const rentalLoading = ref(false)

// 自定义支付弹窗状态 & 选中订单
const isHotelPayVisible = ref(false)
const selectedReservation = ref<HotelReservation & {
  hotelName: string
  typeName: string
} | null>(null)

/** 拉取并补全酒店预订记录 */
async function loadHotelRecords() {
  const uid = useUserInfoStore().user.id
  const raw = await getReservationsByUserId(uid)
  // 按预订日期降序
  raw.sort((a, b) => b.bookDate.localeCompare(a.bookDate))

  const enriched = await Promise.all(
    raw.map(async rec => {
      const hotel: Hotel = await getHotelById(rec.hotelId)
      const types: RoomType[] = await getRoomTypesByHotel(rec.hotelId)
      const rt = types.find(t => t.typeId === rec.typeId)
      return {
        ...rec,
        hotelName: hotel.hotelName,
        typeName: rt?.typeName || '未知房型'
      }
    })
  )
  hotelRecords.value = enriched
}

function onTabClick(tab: any) {
  if (tab.name === 'hotel') {
    loadHotelRecords()
  } else if (tab.name === 'shopping') {
    loadShoppingOrders()
  } else if (tab.name === 'rental') {
    loadRentalOrders()
  }
}

function formatDate(_: any, __: any, value: string) {
  return value ? value.split(' ')[0] : ''
}

/** 加载信用购物订单 */
async function loadShoppingOrders() {
  shoppingLoading.value = true
  try {
    const uid = useUserInfoStore().user.id
    shoppingOrders.value = await getOrdersByUserId(uid)
    console.log('信用购物订单:', shoppingOrders.value)
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败，请稍后重试')
  } finally {
    shoppingLoading.value = false
  }
}

// 查看订单详情
const viewOrderDetails = (order: CommodityOrder) => {
  ElMessageBox.alert(
    `订单详情\n\n订单号：#${order.id}\n商品ID：#${order.commodityId}\n购买数量：${order.amount}件\n支付方式：${getPaymentMethodText(order.method)}\n下单时间：${formatDateTime(order.orderTime)}\n${order.payTime ? `支付时间：${formatDateTime(order.payTime)}` : ''}\n收货地址：${order.address}\n\n费用明细：\n商品总价：¥${formatPrice(order.price)}\n运费：¥${formatPrice(order.freightAmount)}\n优惠折扣：-¥${formatPrice(order.discountAmount)}\n实付金额：¥${formatPrice(order.actualAmount)}`,
    '订单详情',
    {
      confirmButtonText: '确定',
      type: 'info'
    }
  )
}

// 支付订单
const payOrder = async (order: CommodityOrder) => {
  try {
    await ElMessageBox.confirm(
      `确认支付订单 #${order.id}？\n实付金额：¥${formatPrice(order.actualAmount)}`,
      '确认支付',
      {
        confirmButtonText: '确认支付',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await updateOrderStatus(order.id!, OrderStatus.COMPLETED)
    ElMessage.success('支付成功！')
    
    // 刷新订单列表
    await loadShoppingOrders()
    
  } catch (error) {
    if (error !== 'cancel') {
      console.error('支付失败:', error)
      ElMessage.error('支付失败，请稍后重试')
    }
  }
}

// 去购物
const goShopping = () => {
  router.push({ name: 'CreditShopping' })
}

// 去租房
const goRental = () => {
  router.push({ name: 'CreditRental' })
}

/** 加载信用租房订单 */
async function loadRentalOrders() {
  rentalLoading.value = true
  try {
    const userStore = useUserInfoStore()
    console.log('用户信息:', userStore.user)
    
    if (!userStore.user || !userStore.user.id) {
      console.error('用户未登录或用户ID不存在')
      ElMessage.error('请先登录')
      return
    }
    
    const uid = userStore.user.id
    console.log('正在获取用户ID为', uid, '的房屋订单')
    
    rentalOrders.value = await getHouseOrdersByUserId(uid)
    console.log('信用租房订单:', rentalOrders.value)
    console.log('订单数量:', rentalOrders.value.length)
  } catch (error) {
    console.error('获取房屋订单列表失败:', error)
    ElMessage.error('获取房屋订单列表失败，请稍后重试')
  } finally {
    rentalLoading.value = false
  }
}

// 支付房屋订单
const payRentalOrder = async (order: HouseOrder) => {
  try {
    await ElMessageBox.confirm(
      `确认支付房屋订单 #${order.id}？\n月租金：¥${formatPrice(order.price)}`,
      '确认支付',
      {
        confirmButtonText: '确认支付',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await updateHouseOrderStatus(order.id!, 1) // 1表示已支付状态
    ElMessage.success('支付成功！')
    
    // 重新加载订单列表
    await loadRentalOrders()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('支付失败:', error)
      ElMessage.error('支付失败，请稍后重试')
    }
  }
}

// 获取房屋订单状态标签类型
const getRentalStatusTagType = (status: number) => {
  switch (status) {
    case 0:
      return 'warning' // 待支付
    case 1:
      return 'success' // 已支付
    default:
      return 'info'
  }
}

// 获取房屋订单状态文本
const getRentalStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '待支付'
    case 1:
      return '已支付'
    default:
      return '未知状态'
  }
}

// 获取订单状态标签类型
const getStatusTagType = (status: number) => {
  switch (status) {
    case OrderStatus.PENDING_PAYMENT:
      return 'warning'
    case OrderStatus.COMPLETED:
      return 'success'
    default:
      return 'info'
  }
}

// 获取订单状态文本
const getStatusText = (status: number) => {
  switch (status) {
    case OrderStatus.PENDING_PAYMENT:
      return '待支付'
    case OrderStatus.COMPLETED:
      return '已完成'
    default:
      return '未知状态'
  }
}

// 获取支付方式文本
const getPaymentMethodText = (method: string) => {
  switch (method) {
    case PaymentMethod.IMMEDIATE:
      return '立即支付'
    case PaymentMethod.CASH_ON_DELIVERY:
      return '货到付款'
    default:
      return '未知方式'
  }
}

// 格式化价格
const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined) return '0.00'
  return parseFloat(price.toString()).toFixed(2)
}

// 格式化日期时间
const formatDateTime = (dateTime: string | null | undefined) => {
  if (!dateTime) return '-'
  const date = new Date(dateTime)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // 初始化时加载所有类型的数据
  loadShoppingOrders()
  loadRentalOrders()
  loadHotelRecords()
})

/** 打开自定义支付弹窗 */
function handleRepay(row: HotelReservation & { hotelName: string; typeName: string }) {
  selectedReservation.value = row
  isHotelPayVisible.value = true
}

/** 支付完成后刷新列表 */
function onPaymentSuccess() {
  isHotelPayVisible.value = false
  ElMessage.success('还款成功')
  loadHotelRecords()
}

/**
 * 守约状态格式化
 * formatter(row, column, cellValue)
 */
function formatPromise(_: any, __: any, value: number) {
  switch (value) {
    case 1: return '守约'
    case 2: return '逾期'
    default: return '未到期'
  }
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
</style>