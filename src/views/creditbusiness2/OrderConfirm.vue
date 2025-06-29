<template>
  <div class="order-confirm-page">
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
        <div class="header-title">确认订单</div>
        <div class="header-placeholder"></div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 订单确认内容 -->
    <div v-else-if="commodity" class="confirm-content">
      <!-- 商品信息卡片 -->
      <el-card class="commodity-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon class="card-icon"><Box /></el-icon>
            <span>商品信息</span>
          </div>
        </template>
        <div class="commodity-info">
          <div class="commodity-image">
            <img :src="commodity.img" :alt="commodity.name" @error="handleImageError" />
          </div>
          <div class="commodity-details">
            <h3 class="commodity-name">{{ commodity.name }}</h3>
            <div class="commodity-meta">
              <span class="price">¥{{ formatPrice(commodity.price) }}</span>
              <span class="quantity">x{{ quantity }}</span>
            </div>
            <div class="commodity-shop">
              <el-icon><Shop /></el-icon>
              <span>{{ commodity.shop }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 收货地址卡片 -->
      <el-card class="address-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon class="card-icon"><Location /></el-icon>
            <span>收货地址</span>
          </div>
        </template>
        <el-input
          v-model="orderForm.address"
          type="textarea"
          :rows="3"
          placeholder="请输入详细的收货地址"
          maxlength="200"
          show-word-limit
          class="address-input" />
      </el-card>

      <!-- 支付方式卡片 -->
      <el-card class="payment-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon class="card-icon"><CreditCard /></el-icon>
            <span>支付方式</span>
          </div>
        </template>
        <el-radio-group v-model="orderForm.method" class="payment-options">
          <el-radio value="0" class="payment-option">
            <div class="payment-content">
              <el-icon class="payment-icon"><Wallet /></el-icon>
              <div class="payment-info">
                <div class="payment-title">立即支付</div>
                <div class="payment-desc">下单后立即完成支付</div>
              </div>
            </div>
          </el-radio>
          <el-radio value="1" class="payment-option">
            <div class="payment-content">
              <el-icon class="payment-icon"><Van /></el-icon>
              <div class="payment-info">
                <div class="payment-title">货到付款</div>
                <div class="payment-desc">商品送达后再付款</div>
              </div>
            </div>
          </el-radio>
        </el-radio-group>
      </el-card>

      <!-- 费用明细卡片 -->
      <el-card class="cost-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon class="card-icon"><Money /></el-icon>
            <span>费用明细</span>
          </div>
        </template>
        <div class="cost-details">
          <div class="cost-item">
            <span class="cost-label">商品总价</span>
            <span class="cost-value">¥{{ formatPrice(commodity.price * quantity) }}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">运费</span>
            <span class="cost-value">¥20.00</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">优惠折扣</span>
            <span class="cost-value discount">-¥{{ formatPrice(discount) }}</span>
          </div>
          <el-divider />
          <div class="cost-item total">
            <span class="cost-label">实付金额</span>
            <span class="cost-value total-amount">¥{{ formatPrice(totalAmount) }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 底部操作栏 -->
    <div v-if="!loading && commodity" class="bottom-actions">
      <div class="total-info">
        <div class="total-label">实付金额</div>
        <div class="total-price">¥{{ formatPrice(totalAmount) }}</div>
      </div>
      <el-button 
        type="primary" 
        size="large" 
        @click="submitOrder"
        :loading="submitting"
        class="submit-btn">
        <el-icon><Check /></el-icon>
        {{ submitting ? '提交中...' : '确认下单' }}
      </el-button>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="!loading" class="error-state">
      <div class="error-icon">😕</div>
      <div class="error-text">商品信息加载失败</div>
      <div class="error-hint">请检查网络连接后重试</div>
      <el-button @click="fetchCommodityDetails" type="primary" style="margin-top: 16px;">
        重新加载
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Box,
  Shop,
  Location,
  CreditCard,
  Wallet,
  Van,
  Money,
  Check
} from '@element-plus/icons-vue'
import { getCommodityDetails } from '../../api/commodity'
import { placeOrder } from '../../api/order'
import type { Commodity } from '../../entity/Commodity'
import type { PlaceOrderRequest } from '../../entity/Order'
import { useUserInfoStore } from '../../stores/useUserInfoStore'
import { useUserCreditScoreStore } from '../../stores/useUserCreditScore'

// 路由相关
const route = useRoute()
const router = useRouter()

// 用户信息和信用分
const userInfoStore = useUserInfoStore()
const userCreditStore = useUserCreditScoreStore()

// 响应式数据
const commodity = ref<Commodity | null>(null)
const loading = ref(true)
const submitting = ref(false)
const quantity = ref(1)
const discount = ref(0) // 折扣金额

// 订单表单
const orderForm = ref<PlaceOrderRequest>({
  userId: userInfoStore.user?.id || 1, // 从用户状态获取用户ID
  commodityId: 0,
  method: '0', // 默认立即支付
  amount: 1,
  address: ''
})

// 计算折扣金额（根据信用分）
const calculateDiscount = () => {
  if (!commodity.value || !userCreditStore.score) return 0
  
  const creditScore = userCreditStore.score.creditScore
  const totalPrice = commodity.value.price * quantity.value
  
  // 根据信用分计算折扣比例
  let discountRate = 0
  if (creditScore >= 800) {
    discountRate = 0.1 // 10%折扣
  } else if (creditScore >= 700) {
    discountRate = 0.05 // 5%折扣
  } else if (creditScore >= 600) {
    discountRate = 0.02 // 2%折扣
  }
  
  return totalPrice * discountRate
}

// 计算属性
const totalAmount = computed(() => {
  if (!commodity.value) return 0
  const subtotal = commodity.value.price * quantity.value
  const freight = 20
  const discountAmount = calculateDiscount()
  discount.value = discountAmount
  return subtotal + freight - discountAmount // 商品总价 + 运费 - 折扣
})

// 获取商品详情
const fetchCommodityDetails = async () => {
  loading.value = true
  try {
    const commodityId = Number(route.query.commodityId)
    const qty = Number(route.query.quantity) || 1
    
    if (!commodityId) {
      ElMessage.error('商品ID不能为空')
      goBack()
      return
    }
    
    quantity.value = qty
    orderForm.value.commodityId = commodityId
    orderForm.value.amount = qty
    orderForm.value.userId = userInfoStore.user?.id || 1 // 确保使用正确的用户ID
    
    commodity.value = await getCommodityDetails(commodityId)
    console.log('商品详情:', commodity.value)
    console.log('用户信息:', userInfoStore.user)
    console.log('用户信用分:', userCreditStore.score)
  } catch (error) {
    console.error('获取商品详情失败:', error)
    ElMessage.error('获取商品详情失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/api/placeholder/400/300'
}

// 格式化价格
const formatPrice = (price: number) => {
  if (price === null || price === undefined) return '0.00'
  return parseFloat(price.toString()).toFixed(2)
}

// 提交订单
const submitOrder = async () => {
  // 验证表单
  if (!orderForm.value.address.trim()) {
    ElMessage.warning('请填写收货地址')
    return
  }
  
  if (orderForm.value.address.trim().length < 10) {
    ElMessage.warning('请填写详细的收货地址（至少10个字符）')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确认下单？\n商品：${commodity.value?.name}\n数量：${quantity.value}件\n总金额：¥${formatPrice(totalAmount.value)}`,
      '确认订单',
      {
        confirmButtonText: '确认下单',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    submitting.value = true
    
    // 计算并设置费用明细
    const subtotal = commodity.value!.price * quantity.value
    const freight = 20
    const discountAmount = calculateDiscount()
    
    orderForm.value.price = subtotal
    orderForm.value.freightAmount = freight
    orderForm.value.discountAmount = discountAmount
    orderForm.value.actualAmount = subtotal + freight - discountAmount
    
    console.log('提交订单数据:', orderForm.value)
    
    const result = await placeOrder(orderForm.value)
    
    ElMessage.success('下单成功！')
    
    // 跳转回商品列表页面
    router.push({
      name: 'CreditShopping'
    })
    
  } catch (error) {
    if (error !== 'cancel') {
      console.error('下单失败:', error)
      ElMessage.error('下单失败，请稍后重试')
    }
  } finally {
    submitting.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchCommodityDetails()
})
</script>

<style scoped>
.order-confirm-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 100px;
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
  max-width: 800px;
  margin: 0 auto;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  flex: 1;
  text-align: center;
}

.header-placeholder {
  width: 80px;
}

.loading-container {
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.confirm-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.commodity-card,
.address-card,
.payment-card,
.cost-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.card-icon {
  font-size: 18px;
  color: #3498db;
}

.commodity-info {
  display: flex;
  gap: 16px;
  padding: 16px 0;
}

.commodity-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.commodity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.commodity-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.commodity-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  line-height: 1.4;
}

.commodity-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #e74c3c;
}

.quantity {
  font-size: 16px;
  color: #7f8c8d;
}

.commodity-shop {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #7f8c8d;
  font-size: 14px;
}

.address-input {
  margin-top: 16px;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.payment-option {
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  margin: 0;
}

.payment-option:hover {
  border-color: #3498db;
  background: #f8fafc;
}

.payment-option.is-checked {
  border-color: #3498db;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
}

.payment-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-icon {
  font-size: 24px;
  color: #3498db;
}

.payment-info {
  flex: 1;
}

.payment-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.payment-desc {
  font-size: 14px;
  color: #7f8c8d;
}

.cost-details {
  padding: 16px 0;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.cost-label {
  font-size: 14px;
  color: #7f8c8d;
}

.cost-value {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.cost-value.discount {
  color: #27ae60;
}

.cost-item.total {
  padding: 16px 0 8px 0;
}

.cost-item.total .cost-label {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.total-amount {
  font-size: 20px;
  font-weight: 700;
  color: #e74c3c;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px 24px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
}

.total-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.total-label {
  font-size: 14px;
  color: #7f8c8d;
}

.total-price {
  font-size: 24px;
  font-weight: 700;
  color: #e74c3c;
}

.submit-btn {
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.error-text {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.error-hint {
  font-size: 14px;
  color: #7f8c8d;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .confirm-content {
    padding: 16px;
  }
  
  .commodity-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .commodity-image {
    width: 120px;
    height: 120px;
  }
  
  .payment-options {
    gap: 12px;
  }
  
  .payment-option {
    padding: 12px;
  }
  
  .bottom-actions {
    flex-direction: column;
    gap: 16px;
    padding: 20px 16px;
  }
  
  .submit-btn {
    width: 100%;
    padding: 16px;
  }
}
</style>