<template>
  <div class="commodity-details-page">
    <!-- 头部导航 -->
    <div class="header">
      <div class="header-content">
        <el-button 
          class="back-btn" 
          @click="goBack" 
          circle 
          size="large"
          type="info">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-title">商品详情</div>
        <div class="header-actions">
         
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton animated>
        <template #template>
          <div class="skeleton-carousel">
            <el-skeleton-item variant="image" style="width: 100%; height: 400px;" />
          </div>
          <div style="padding: 24px;">
            <el-skeleton-item variant="h1" style="width: 60%; margin-bottom: 16px;" />
            <el-skeleton-item variant="text" style="width: 40%; margin-bottom: 24px;" />
            <div style="display: flex; gap: 16px; margin-bottom: 24px;">
              <el-skeleton-item variant="text" style="width: 100px;" />
              <el-skeleton-item variant="text" style="width: 100px;" />
              <el-skeleton-item variant="text" style="width: 100px;" />
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>

    <!-- 商品详情内容 -->
    <div v-else-if="commodity" class="details-content">
      <!-- 图片轮播 -->
      <div class="carousel-section">
        <el-carousel 
          :interval="5000" 
          type="card" 
          height="400px"
          indicator-position="outside">
          <el-carousel-item 
            v-for="(img, index) in imageList" 
            :key="index"
            class="carousel-item">
            <img 
              :src="img" 
              :alt="`商品图片${index + 1}`"
              class="carousel-image"
              @error="handleImageError" />
          </el-carousel-item>
        </el-carousel>
        
        <!-- 图片数量指示器 -->
        <div class="image-count">
          <el-icon><Picture /></el-icon>
          <span>{{ imageList.length }}张图片</span>
        </div>
      </div>

      <!-- 商品基本信息 -->
      <div class="info-section">
        <div class="price-area">
          <div class="price">
            <span class="price-symbol">¥</span>
            <span class="price-number">{{ formatPrice(commodity.price) }}</span>
          </div>
          <div class="category-badge">
            <el-tag type="success" size="large">{{ commodity.category }}</el-tag>
          </div>
        </div>

        <h1 class="commodity-title">{{ commodity.name }}</h1>
        <div class="shop-info">
          <el-icon class="shop-icon"><Shop /></el-icon>
          <span>{{ commodity.shop }}</span>
        </div>
      </div>

      <!-- 商品详细信息卡片 -->
      <div class="details-cards">
        <!-- 基础信息卡片 -->
        <el-card class="info-card" shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon class="card-icon"><Box /></el-icon>
              <span>商品信息</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">商品名称</div>
              <div class="info-value">{{ commodity.name }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">商品分类</div>
              <div class="info-value">{{ commodity.category }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">销售店铺</div>
              <div class="info-value">{{ commodity.shop }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">库存数量</div>
              <div class="info-value">{{ commodity.inventory }}件</div>
            </div>
            <div class="info-item">
              <div class="info-label">商品ID</div>
              <div class="info-value">#{{ commodity.id }}</div>
            </div>
          </div>
        </el-card>

        <!-- 购买操作卡片 -->
        <el-card class="action-card" shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon class="card-icon"><CreditCard /></el-icon>
              <span>购买选项</span>
            </div>
          </template>
          <div class="action-content">
            <div class="quantity-selector">
              <label class="quantity-label">购买数量：</label>
              <el-input-number 
                v-model="quantity" 
                :min="1" 
                :max="commodity.inventory"
                size="large"
                class="quantity-input" />
            </div>
            <div class="total-price">
              <span class="total-label">总价：</span>
              <span class="total-amount">¥{{ formatPrice(commodity.price * quantity) }}</span>
            </div>
            <div class="action-buttons">
              <el-button 
                type="primary" 
                size="large" 
                @click="goToCheckout"
                class="checkout-btn"
                :disabled="commodity.inventory === 0">
                <el-icon><CreditCard /></el-icon>
                {{ commodity.inventory === 0 ? '暂时缺货' : '立即购买' }}
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else class="error-state">
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
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  View,
  Share,
  Heart,
  Plus,
  Minus
} from '@element-plus/icons-vue'
import { getCommodityDetails } from '../api/commodity.ts'
import type { Commodity } from '../entity/Commodity.ts'

// 路由相关
const route = useRoute()
const router = useRouter()

// 响应式数据
const commodity = ref(null)
const loading = ref(true)
const quantity = ref(1)

// 删除API_BASE_URL，使用新的API架构

// 计算属性
const imageList = computed(() => {
  if (!commodity.value) return []
  
  console.log('商品数据:', commodity.value)
  
  try {
    // 优先处理detailImgs字段（可能包含images数组）
    if (commodity.value.detailImgs) {
      console.log('detailImgs原始数据:', commodity.value.detailImgs)
      
      let parsedData = commodity.value.detailImgs
      
      // 如果是字符串，尝试解析JSON
      if (typeof parsedData === 'string') {
        parsedData = JSON.parse(parsedData)
      }
      
      console.log('解析后的detailImgs:', parsedData)
      
      // 检查是否有images字段
      if (parsedData && parsedData.images && Array.isArray(parsedData.images) && parsedData.images.length > 0) {
        console.log('使用detailImgs中的images数组:', parsedData.images)
        return parsedData.images
      }
      
      // 如果detailImgs直接是数组
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        console.log('使用detailImgs数组:', parsedData)
        return parsedData
      }
    }
    
    // 检查是否直接有images字段
    if (commodity.value.images && Array.isArray(commodity.value.images) && commodity.value.images.length > 0) {
      console.log('使用直接的images字段:', commodity.value.images)
      return commodity.value.images
    }
    
    // 否则使用主图片
    if (commodity.value.img) {
      console.log('使用主图片:', commodity.value.img)
      return [commodity.value.img]
    }
    
    // 如果都没有，返回默认图片
    console.log('使用默认图片')
    return ['/api/placeholder/400/300']
  } catch (error) {
    console.error('解析图片数据失败:', error)
    return commodity.value.img ? [commodity.value.img] : ['/api/placeholder/400/300']
  }
})

// 获取商品详情
const fetchCommodityDetails = async () => {
  loading.value = true
  try {
    const commodityId = route.params.id
    console.log('获取商品详情，ID:', commodityId)
    
    commodity.value = await getCommodityDetails(Number(commodityId))
    console.log('商品详情:', commodity.value)
  } catch (error) {
    console.error('获取商品详情失败:', error)
    ElMessage.error('获取商品详情失败，请稍后重试')
    commodity.value = null
  } finally {
    loading.value = false
  }
}

// 返回商品列表页面
const goBack = () => {
  router.push({ name: 'CreditShopping' })
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.src = '/api/placeholder/400/300'
}

// 格式化价格
const formatPrice = (price) => {
  if (price === null || price === undefined) return '0.00'
  return parseFloat(price).toFixed(2)
}

// 跳转到结算页面
const goToCheckout = () => {
  if (!commodity.value || commodity.value.inventory === 0) {
    ElMessage.warning('商品暂时缺货')
    return
  }
  
  // 跳转到订单确认页面
  router.push({
    name: 'OrderConfirm',
    query: {
      commodityId: commodity.value.id,
      quantity: quantity.value
    }
  })
}



// 组件挂载时获取数据
onMounted(() => {
  fetchCommodityDetails()
})
</script>

<style scoped>
.commodity-details-page {
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
  max-width: 1200px;
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

.header-actions {
  display: flex;
  gap: 12px;
}

.loading-container {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.details-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.carousel-section {
  position: relative;
  margin-bottom: 40px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.carousel-item {
  border-radius: 20px;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.image-count {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  backdrop-filter: blur(10px);
}

.info-section {
  margin-bottom: 40px;
}

.price-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-symbol {
  font-size: 24px;
  color: #e74c3c;
  font-weight: 600;
}

.price-number {
  font-size: 48px;
  font-weight: 700;
  color: #e74c3c;
  text-shadow: 0 2px 4px rgba(231, 76, 60, 0.2);
}

.category-badge {
  transform: scale(1.1);
}

.commodity-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 16px 0;
  line-height: 1.3;
}

.shop-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: #7f8c8d;
}

.shop-icon {
  color: #3498db;
}

.details-cards {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.info-card, .action-card {
  border-radius: 20px;
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.card-icon {
  font-size: 20px;
  color: #3498db;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
}

.info-value {
  font-size: 16px;
  color: #2c3e50;
  font-weight: 600;
}

.action-content {
  padding: 20px 0;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.quantity-label {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.quantity-input {
  width: 120px;
}

.total-price {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.total-label {
  font-size: 16px;
  color: #6c757d;
}

.total-amount {
  font-size: 24px;
  font-weight: 700;
  color: #e74c3c;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkout-btn, .cart-btn {
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
  padding: 16px;
  font-size: 16px;
}

.checkout-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}



.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 40px;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.error-text {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 600;
}

.error-hint {
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .details-cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .price-number {
    font-size: 36px;
  }
  
  .commodity-title {
    font-size: 24px;
  }
  
  .details-content {
    padding: 20px 16px;
  }
  
  .header-content {
    padding: 12px 16px;
  }
}
</style>