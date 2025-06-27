<template>
  <div class="house-order-page">
    <!-- 头部导航 -->
    <div class="order-header">
      <el-button 
        :icon="ArrowLeftBold" 
        @click="goBack" 
        type="text" 
        class="back-btn"
      >
        返回
      </el-button>
      <h2>房屋租赁下单</h2>
      <div></div>
    </div>

    <!-- 房屋信息卡片 -->
    <div class="house-info-card" v-if="houseInfo">
      <div class="house-image">
        <img :src="houseInfo.img" :alt="houseInfo.title" />
      </div>
      <div class="house-details">
        <h3>{{ houseInfo.title }}</h3>
        <p class="address">{{ houseInfo.address }}</p>
        <p class="rental-type">{{ houseInfo.rentalType }}</p>
        <p class="monthly-rent">月租金：<span class="price">¥{{ formatPrice(houseInfo.price) }}</span></p>
      </div>
    </div>

    <!-- 租赁信息表单 -->
    <div class="rental-form">
      <el-form :model="orderForm" :rules="rules" ref="orderFormRef" label-width="120px">
        <el-form-item label="租赁开始日期" prop="startDate">
          <el-date-picker
            v-model="orderForm.startDate"
            type="date"
            placeholder="选择开始日期"
            style="width: 100%"
            :disabled-date="disabledStartDate"
            @change="calculateTotalPrice"
          />
        </el-form-item>
        
        <el-form-item label="租赁结束日期" prop="endDate">
          <el-date-picker
            v-model="orderForm.endDate"
            type="date"
            placeholder="选择结束日期"
            style="width: 100%"
            :disabled-date="disabledEndDate"
            @change="calculateTotalPrice"
          />
        </el-form-item>

        <el-form-item label="租赁天数">
          <el-input v-model="rentalDays" readonly>
            <template #suffix>天</template>
          </el-input>
        </el-form-item>

        <el-form-item label="总租金">
          <el-input v-model="totalPriceDisplay" readonly class="total-price-input">
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <!-- 费用明细 -->
    <div class="price-breakdown" v-if="orderForm.startDate && orderForm.endDate">
      <h4>费用明细</h4>
      <div class="breakdown-item">
        <span>月租金</span>
        <span>¥{{ formatPrice(houseInfo?.price || 0) }}</span>
      </div>
      <div class="breakdown-item">
        <span>租赁天数</span>
        <span>{{ rentalDays }}天</span>
      </div>
      <div class="breakdown-item total">
        <span>总计</span>
        <span class="total-amount">¥{{ totalPriceDisplay }}</span>
      </div>
    </div>

    <!-- 下单按钮 -->
    <div class="order-actions">
      <el-button 
        type="primary" 
        size="large" 
        @click="submitOrder"
        :loading="submitting"
        :disabled="!canSubmit"
        class="submit-btn"
      >
        确认下单
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getHouseById } from '../../api/house'
import { placeHouseOrder } from '../../api/houseOrder'
import { useUserInfoStore } from '../../stores/useUserInfoStore'
import type { House } from '../../entity/House'
import type { PlaceHouseOrderRequest } from '../../entity/HouseOrder'

const route = useRoute()
const router = useRouter()
const userStore = useUserInfoStore()

// 表单引用
const orderFormRef = ref<FormInstance>()

// 房屋信息
const houseInfo = ref<House | null>(null)

// 订单表单
const orderForm = ref({
  startDate: '',
  endDate: ''
})

// 提交状态
const submitting = ref(false)

// 表单验证规则
const rules: FormRules = {
  startDate: [
    { required: true, message: '请选择租赁开始日期', trigger: 'change' }
  ],
  endDate: [
    { required: true, message: '请选择租赁结束日期', trigger: 'change' }
  ]
}

// 计算租赁天数
const rentalDays = computed(() => {
  if (!orderForm.value.startDate || !orderForm.value.endDate) return 0
  
  const start = new Date(orderForm.value.startDate)
  const end = new Date(orderForm.value.endDate)
  const diffTime = end.getTime() - start.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays > 0 ? diffDays : 0
})

// 计算总价格
const totalPrice = computed(() => {
  if (!houseInfo.value || rentalDays.value <= 0) return 0
  
  // 按照月租金计算：月租金 * (租赁天数 / 30)
  const monthlyRent = houseInfo.value.price
  const totalAmount = monthlyRent * (rentalDays.value / 30)
  
  return Math.round(totalAmount * 100) / 100 // 保留两位小数
})

// 总价格显示
const totalPriceDisplay = computed(() => {
  return formatPrice(totalPrice.value)
})

// 是否可以提交
const canSubmit = computed(() => {
  return orderForm.value.startDate && 
         orderForm.value.endDate && 
         rentalDays.value > 0 && 
         totalPrice.value > 0
})

// 禁用开始日期（不能选择今天之前的日期）
const disabledStartDate = (time: Date) => {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

// 禁用结束日期（不能选择开始日期之前的日期）
const disabledEndDate = (time: Date) => {
  if (!orderForm.value.startDate) return true
  const startDate = new Date(orderForm.value.startDate)
  return time.getTime() <= startDate.getTime()
}

// 格式化价格
const formatPrice = (price: number) => {
  return parseFloat(price.toString()).toFixed(2)
}

// 计算总价格（当日期改变时触发）
const calculateTotalPrice = () => {
  // 这个方法主要用于触发计算，实际计算在computed中完成
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 提交订单
const submitOrder = async () => {
  if (!orderFormRef.value) return
  
  // 检查用户是否已登录
  if (!userStore.user || !userStore.user.id) {
    ElMessage.error('请先登录后再下单')
    router.push({ name: 'Login' })
    return
  }
  
  let orderData: PlaceHouseOrderRequest | null = null
  
  try {
    await orderFormRef.value.validate()
    
    await ElMessageBox.confirm(
      `确认下单？\n\n租赁期间：${orderForm.value.startDate} 至 ${orderForm.value.endDate}\n租赁天数：${rentalDays.value}天\n总租金：¥${totalPriceDisplay.value}`,
      '确认下单',
      {
        confirmButtonText: '确认下单',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    submitting.value = true
    
    // 将日期转换为当天0点的ISO格式字符串
    const formatDateForBackend = (date: string | Date): string => {
      let targetDate: Date
      if (date instanceof Date) {
        // 确保是当天的0点
        targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      } else {
        // 如果是字符串格式的日期，转换为当天0点
        const dateObj = new Date(date)
        targetDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
      }
      return targetDate.toISOString()
    }
    
    orderData = {
      userId: userStore.user.id,
      houseId: Number(route.params.id),
      startDate: formatDateForBackend(orderForm.value.startDate),
      deadline: formatDateForBackend(orderForm.value.endDate),
      price: totalPrice.value,
      orderTime: new Date().toISOString(), // 记录实际下单时间
      status: 0, // 默认状态为未支付
      promise: 0 // 默认守约状态
    }
    
    await placeHouseOrder(orderData)
    
    ElMessage.success('下单成功！')
    
    // 跳转到订单记录页面
    router.push({ name: 'Records' })
    
  } catch (error) {
    if (error !== 'cancel') {
      console.error('下单失败:', error)
      if (orderData) {
        console.error('订单数据:', orderData)
      }
      if (error.response) {
        console.error('服务器响应:', error.response.data)
        console.error('状态码:', error.response.status)
      }
      ElMessage.error('下单失败，请稍后重试')
    }
  } finally {
    submitting.value = false
  }
}

// 加载房屋信息
const loadHouseInfo = async () => {
  try {
    const houseId = Number(route.params.id)
    if (!houseId) {
      ElMessage.error('房屋信息不存在')
      router.back()
      return
    }
    
    houseInfo.value = await getHouseById(houseId)
  } catch (error) {
    console.error('获取房屋信息失败:', error)
    ElMessage.error('获取房屋信息失败')
    router.back()
  }
}

onMounted(() => {
  loadHouseInfo()
})
</script>

<style scoped>
.house-order-page {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.order-header h2 {
  margin: 0;
  color: #303133;
}

.back-btn {
  padding: 0;
  color: #409eff;
}

.house-info-card {
  display: flex;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  gap: 20px;
}

.house-image {
  flex-shrink: 0;
}

.house-image img {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.house-details {
  flex: 1;
}

.house-details h3 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 20px;
}

.address {
  color: #606266;
  margin: 8px 0;
  font-size: 14px;
}

.rental-type {
  color: #909399;
  margin: 8px 0;
  font-size: 14px;
}

.monthly-rent {
  margin: 12px 0 0 0;
  font-size: 16px;
  color: #303133;
}

.price {
  color: #e6a23c;
  font-weight: 600;
  font-size: 18px;
}

.rental-form {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.total-price-input :deep(.el-input__inner) {
  font-weight: 600;
  color: #e6a23c;
  font-size: 16px;
}

.price-breakdown {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.price-breakdown h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.breakdown-item:last-child {
  border-bottom: none;
}

.breakdown-item.total {
  margin-top: 8px;
  padding-top: 16px;
  border-top: 2px solid #e4e7ed;
  font-weight: 600;
}

.total-amount {
  color: #e6a23c;
  font-size: 18px;
  font-weight: 600;
}

.order-actions {
  text-align: center;
}

.submit-btn {
  width: 200px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .house-info-card {
    flex-direction: column;
  }
  
  .house-image img {
    width: 100%;
    height: 200px;
  }
  
  .house-order-page {
    padding: 16px;
  }
}
</style>