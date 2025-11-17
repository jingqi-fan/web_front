<template>
  <div class="house-details-page">
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
        <div class="header-title">房源详情</div>
        <div class="header-actions">
          <el-button size="large" type="primary" round @click="goToOrder">
            <el-icon><ShoppingCart /></el-icon>
            <span style="margin-left: 8px">去租赁</span>
          </el-button>
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

    <!-- 房源详情内容 -->
    <div v-else-if="houseDetails" class="details-content">
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
              :alt="`房源图片${index + 1}`"
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

      <!-- 房源基本信息 -->
      <div class="info-section">
        <div class="price-area">
          <div class="price">
            <span class="price-symbol">¥</span>
            <span class="price-number">{{ house?.price || '待定' }}</span>
            <span class="price-unit">/月</span>
          </div>
          <div class="rental-type-badge" :class="getRentalTypeClass(house?.rentalType)">
            {{ getRentalTypeText(house?.rentalType) }}
          </div>
        </div>

        <h1 class="house-title">{{ house?.title || '房源标题' }}</h1>
        <div class="location-info">
          <el-icon class="location-icon"><Location /></el-icon>
          <span>{{ house?.address || '地址信息' }}</span>
        </div>
      </div>

      <!-- 房屋详细信息卡片 -->
      <div class="details-cards">
        <!-- 基础信息卡片 -->
        <el-card class="info-card" shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon class="card-icon"><House /></el-icon>
              <span>基础信息</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">房型</div>
              <div class="info-value">{{ houseDetails.houseType || '-' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">面积</div>
              <div class="info-value">{{ houseDetails.area || '-' }}㎡</div>
            </div>
            <div class="info-item">
              <div class="info-label">朝向</div>
              <div class="info-value">{{ houseDetails.orientation || '-' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">楼层</div>
              <div class="info-value">{{ houseDetails.floor || '-' }}层</div>
            </div>
            <div class="info-item">
              <div class="info-label">装修</div>
              <div class="info-value">{{ houseDetails.decorates || '-' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">小区</div>
              <div class="info-value">{{ houseDetails.neighborhood || '-' }}</div>
            </div>
          </div>
        </el-card>

        <!-- 配套设施卡片 -->
        <el-card class="info-card" shadow="never" v-if="facilitiesList.length > 0">
          <template #header>
            <div class="card-header">
              <el-icon class="card-icon"><Grid /></el-icon>
              <span>配套设施</span>
            </div>
          </template>
          <div class="facilities-grid">
            <el-tag 
              v-for="facility in facilitiesList" 
              :key="facility"
              class="facility-tag"
              size="large">
              {{ facility }}
            </el-tag>
          </div>
        </el-card>

        <!-- 更新时间 -->
        <el-card class="info-card" shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon class="card-icon"><Clock /></el-icon>
              <span>更新时间</span>
            </div>
          </template>
          <div class="update-time">
            {{ formatDate(houseDetails.updateTime) }}
          </div>
        </el-card>
      </div>

      <!-- 联系方式 -->
      <div class="contact-section">
        <el-card shadow="never" class="contact-card">
          <div class="contact-content">
            <div class="contact-info">
              <h3>联系房东</h3>
              <p>如果您对这套房源感兴趣，可以联系我们获取更多信息</p>
            </div>
            <div class="contact-actions">
              <el-button type="success" size="large" round @click="showContactInfo">
                <el-icon><Phone /></el-icon>
                立即联系
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else class="error-state">
      <div class="error-icon">😕</div>
      <div class="error-text">房源信息加载失败</div>
      <div class="error-hint">请检查网络连接后重试</div>
      <el-button @click="fetchHouseDetails" type="primary" style="margin-top: 16px;">
        重新加载
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Location, 
  House, 
  Grid, 
  Clock, 
  Phone, 
  Picture,
  ShoppingCart
} from '@element-plus/icons-vue'
import { getHouseDetails } from '@/api/house'
import type { HouseDetails } from '@/entity/HouseDetails'

// 组件名称
const name = 'HouseDetails'
    const route = useRoute()
    const router = useRouter()
    
    // 响应式数据
    const houseDetails = ref(null)
    const house = ref(null)
    const loading = ref(true)
    
    // 计算属性
    const imageList = computed(() => {
      if (!houseDetails.value) return []
      
      try {
        // 解析JSON字符串为数组
        let images;
        if (houseDetails.value.imgsPathAsJson) {
          // 优先使用已解析的JSON
          // 检查imgsPathAsJson是否已经是对象
          images = typeof houseDetails.value.imgsPathAsJson === 'string'
            ? JSON.parse(houseDetails.value.imgsPathAsJson)
            : houseDetails.value.imgsPathAsJson
        } else if (houseDetails.value.imgsPath) {
          // 否则尝试解析imgsPath
          images = typeof houseDetails.value.imgsPath === 'string' 
            ? JSON.parse(houseDetails.value.imgsPath)
            : houseDetails.value.imgsPath
        } else {
          return []
        }
        
        // 如果images是对象且有images属性，则使用该属性
        if (images && typeof images === 'object' && images.images) {
          return Array.isArray(images.images) ? images.images : []
        }
        
        return Array.isArray(images) ? images : []
      } catch (error) {
        console.error('解析图片路径失败:', error)
        return []
      }
    })
    
    const facilitiesList = computed(() => {
      if (!houseDetails.value?.facilities) return []
      return houseDetails.value.facilities.split(',').filter(f => f.trim())
    })
    
    // 获取房源详情
    const fetchHouseDetails = async () => {
      const houseId = route.params.id
      if (!houseId) {
        ElMessage.error('房源ID不存在')
        return
      }
      
      loading.value = true
      
      try {
        const response = await getHouseDetails(Number(houseId))
        
        // 分别存储house和houseDetails数据
        houseDetails.value = response.houseDetails
        house.value = response.house
        console.log('房源详情:', response)
      } catch (error) {
        console.error('获取房源详情失败:', error)
        ElMessage.error('获取房源详情失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
    
    // 返回上一页
    const goBack = () => {
      router.push({ name: 'CreditRental' })
    }
    
    // 跳转到下单页面
    const goToOrder = () => {
      const houseId = route.params.id
      if (!houseId) {
        ElMessage.error('房源ID不存在')
        return
      }
      router.push({ name: 'HouseOrderInCredit', params: { id: houseId } })
    }
    
    // 处理图片加载错误
    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/400x300/f5f5f5/999999?text=暂无图片'
    }
    
    // 获取出租类型样式类
    const getRentalTypeClass = (type) => {
      // 将数字类型转换为对应的样式类
      if (type === 0 || type === '0') {
        return 'whole-rent'
      } else if (type === 1 || type === '1') {
        return 'shared-rent'
      } else {
        return 'default-rent'
      }
    }
    
    // 获取出租类型文本
    const getRentalTypeText = (type) => {
      // 将数字类型转换为对应的文本
      if (type === 0 || type === '0') {
        return '整租'
      } else if (type === 1 || type === '1') {
        return '合租'
      } else {
        return '出租'
      }
    }
    
    // 格式化日期
    const formatDate = (dateStr) => {
      if (!dateStr) return '未知'
      try {
        const date = new Date(dateStr)
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch (error) {
        return dateStr
      }
    }
    
    // 显示联系信息
    const showContactInfo = () => {
      // 基于房源ID生成固定的手机号
      const houseId = route.params.id
      if (!houseId) {
        ElMessage.error('房源信息不存在')
        return
      }
      
      const phonePrefix = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', '186', '187', '188', '189']
      // 使用房源ID作为种子生成固定的电话号码
      const seed = parseInt(houseId.toString())
      const prefixIndex = seed % phonePrefix.length
      const selectedPrefix = phonePrefix[prefixIndex]
      
      // 基于房源ID生成固定的后8位数字
      const suffix = ((seed * 12345 + 67890) % 100000000).toString().padStart(8, '0')
      const phoneNumber = selectedPrefix + suffix
      
      // 显示提示框
      ElMessage({
        message: `请电话联系房主，以下是其手机号：${phoneNumber}`,
        type: 'success',
        duration: 5000,
        showClose: true
      })
    }
    
    // 组件挂载时获取数据
    onMounted(() => {
      fetchHouseDetails()
    })
    
// 在script setup中，所有的响应式变量和函数都会自动暴露给模板
// 不需要return语句
</script>

<style scoped>
.house-details-page {
  min-height: 100vh;
  background: #f8fafc;
}

/* 头部样式 */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
}

.back-btn:hover {
  background: rgba(255,255,255,0.3);
}

.header-title {
  font-size: 20px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-actions .el-button {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
}

/* 加载状态 */
.loading-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.skeleton-carousel {
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
}

/* 主要内容 */
.details-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* 轮播图区域 */
.carousel-section {
  position: relative;
  margin-bottom: 32px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.carousel-item {
  border-radius: 12px;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.carousel-image:hover {
  transform: scale(1.05);
}

.image-count {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

/* 基本信息区域 */
.info-section {
  background: white;
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.price-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
  font-size: 36px;
  color: #e74c3c;
  font-weight: 700;
}

.price-unit {
  font-size: 16px;
  color: #666;
  margin-left: 8px;
}

.rental-type-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.rental-type-badge.whole-rent {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
}

.rental-type-badge.shared-rent {
  background: linear-gradient(135deg, #fd79a8, #e84393);
  color: white;
}

.rental-type-badge.short-rent {
  background: linear-gradient(135deg, #fdcb6e, #e17055);
  color: white;
}

.rental-type-badge.default-rent {
  background: linear-gradient(135deg, #a29bfe, #6c5ce7);
  color: white;
}

.house-title {
  font-size: 28px;
  color: #2d3436;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #636e72;
  font-size: 16px;
}

.location-icon {
  color: #74b9ff;
}

/* 详情卡片区域 */
.details-cards {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.info-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #2d3436;
}

.card-icon {
  color: #74b9ff;
  font-size: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  padding: 8px 0;
}

.info-item {
  text-align: center;
}

.info-label {
  font-size: 14px;
  color: #636e72;
  margin-bottom: 8px;
}

.info-value {
  font-size: 18px;
  font-weight: 600;
  color: #2d3436;
}

.facilities-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.facility-tag {
  background: linear-gradient(135deg, #a8e6cf, #81c784);
  color: #2e7d32;
  border: none;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
}

.update-time {
  font-size: 16px;
  color: #636e72;
  padding: 8px 0;
}

/* 联系区域 */
.contact-section {
  margin-bottom: 32px;
}

.contact-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.contact-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
}

.contact-info h3 {
  font-size: 20px;
  margin-bottom: 8px;
  font-weight: 600;
}

.contact-info p {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.contact-actions {
  display: flex;
  gap: 16px;
}

.contact-actions .el-button {
  padding: 12px 24px;
  font-weight: 600;
}

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.error-text {
  font-size: 18px;
  margin-bottom: 8px;
  color: #2d3436;
}

.error-hint {
  font-size: 14px;
  color: #636e72;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .details-content {
    padding: 16px;
  }
  
  .info-section {
    padding: 24px 20px;
  }
  
  .price-area {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .house-title {
    font-size: 24px;
  }
  
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .contact-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .contact-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .contact-actions .el-button {
    width: 100%;
  }
  
  .header-title {
    font-size: 18px;
  }
}
</style>