<template>
  <div class="order-list-page">
    <!-- 头部导航 -->
    <div class="header">
      <div class="header-content">
        <el-button 
          @click="goBack" 
          type="primary" 
          :icon="ArrowLeft" 
          class="back-btn">
          返回
        </el-button>
        <div class="header-title">我的订单</div>
        <el-button 
          @click="refreshOrders" 
          type="primary" 
          :icon="Refresh" 
          class="refresh-btn">
          刷新
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="6" animated />
    </div>

    <!-- 订单列表 -->
    <div v-else-if="orders.length > 0" class="orders-content">
      <div class="orders-list">
        <el-card 
          v-for="order in orders" 
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Refresh
} from '@element-plus/icons-vue'
import { getOrdersByUserId, updateOrderStatus } from '../../api/order'
import type { CommodityOrder } from '../../entity/Order'
import { OrderStatus, PaymentMethod } from '../../entity/Order'

// 路由相关
const route = useRoute()
const router = useRouter()

// 响应式数据
const orders = ref<CommodityOrder[]>([])
const loading = ref(true)
const userId = ref(1) // 默认用户ID，实际应用中应从用户状态获取

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  try {
    const userIdParam = route.query.userId
    if (userIdParam) {
      userId.value = Number(userIdParam)
    }
    
    console.log('获取用户订单:', userId.value)
    orders.value = await getOrdersByUserId(userId.value)
    console.log('订单列表:', orders.value)
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 刷新订单
const refreshOrders = () => {
  fetchOrders()
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 去购物
const goShopping = () => {
  router.push({ name: 'CreditShopping' })
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
    await fetchOrders()
    
  } catch (error) {
    if (error !== 'cancel') {
      console.error('支付失败:', error)
      ElMessage.error('支付失败，请稍后重试')
    }
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

// 组件挂载时获取数据
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-list-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.back-btn,
.refresh-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
}

.back-btn:hover,
.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  flex: 1;
  text-align: center;
}

.loading-container {
  padding: 40px;
  max-width: 1000px;
  margin: 0 auto;
}

.orders-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.order-time {
  font-size: 14px;
  color: #7f8c8d;
}

.status-tag {
  font-weight: 600;
}

.order-content {
  padding: 16px 0;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.detail-label {
  font-size: 14px;
  color: #7f8c8d;
  min-width: 80px;
  flex-shrink: 0;
}

.detail-value {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.detail-value.address {
  line-height: 1.4;
  word-break: break-all;
}

.price-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-label {
  font-size: 14px;
  color: #7f8c8d;
}

.price-value {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.price-item.total {
  padding-top: 8px;
  border-top: 1px solid #e1e8ed;
  margin-top: 4px;
}

.price-item.total .price-label {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.total-amount {
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 0 0 0;
  border-top: 1px solid #f0f0f0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 14px;
  color: #7f8c8d;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .orders-content {
    padding: 16px;
  }
  
  .order-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .order-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .detail-item {
    flex-direction: column;
    gap: 4px;
  }
  
  .detail-label {
    min-width: auto;
  }
}
</style>