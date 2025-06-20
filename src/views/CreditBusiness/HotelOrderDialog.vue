<!-- src/views/CreditBusiness/HotelOrderDialog.vue -->
<template>
  <el-dialog
    :model-value="modelValue"
    title="预订提交"
    width="40%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form label-width="100px">
      <!-- 改为使用 hotel 对象 -->
      <el-form-item label="酒店名称">
        <span>{{ hotel.hotelName }}</span>
      </el-form-item>
      <el-form-item label="房型">
        <span>{{ roomType.typeName }}</span>
      </el-form-item>

      <el-form-item label="入住日期">
        <span>{{ formatDate(checkInDate) }}</span>
      </el-form-item>
      <el-form-item label="入住时长">
        <el-input-number v-model="nights" :min="1" max="120" label="晚数" />
        <span>&nbsp;&nbsp;&nbsp;&nbsp;天</span>
      </el-form-item>
      <el-form-item label="离店日期">
        <span>{{ formatDate(checkOutDate) }}</span>
      </el-form-item>
      <el-form-item label="还款期限">
        <span>{{ repaymentDeadlineText }}</span>
      </el-form-item>

      <el-form-item label="信用分">
        <span>{{ creditScore }}</span>
      </el-form-item>
      <el-form-item label="折扣">
        <span>{{ (discountRate * 100).toFixed(1) }}%</span>
      </el-form-item>
      <el-form-item label="总价">
        <span>¥{{ originalPrice.toFixed(2) }}</span>
      </el-form-item>
      <el-form-item label="折后价">
        <span>¥{{ discountedPrice.toFixed(2) }}</span>
      </el-form-item>
      <el-form-item label="押金">
        <span v-if="depositRequired">¥{{ roomType.deposit.toFixed(2) }}</span>
        <span v-else>免押金</span>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">预订确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserCreditScoreInfo } from '../../api/user'
import {useUserInfoStore} from "../../stores/useUserInfoStore";

// 引入类型
import type { Hotel } from '../../entity/Hotel'
import type { RoomType } from '../../entity/RoomType'


const props = defineProps<{
  modelValue: boolean
  hotel: Hotel            // 整个 hotel 对象
  roomType: RoomType
  checkInDate: Date
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
}>()

const nights = ref(1)
const creditScore = ref(0)
const discountRate = ref(0)
const depositRequired = ref(true)

const checkOutDate = computed(() => {
  const d = new Date(props.checkInDate)
  d.setDate(d.getDate() + nights.value)
  return d
})
const originalPrice = computed(() => nights.value * props.roomType.price)
const discountedPrice = computed(() => originalPrice.value * (1 - discountRate.value))

const repaymentDeadlineDays = computed(() => {
  const now = Date.now()
  const diff = checkOutDate.value.getTime() - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})
const repaymentDeadlineText = computed(() => `${repaymentDeadlineDays.value} 天`)


async function fetchCredit() {
  try {
    const userInfoStore = useUserInfoStore()
    const user=userInfoStore.user
    const uc = await getUserCreditScoreInfo(user.id)
    creditScore.value = uc.creditScore ?? 0
    if (creditScore.value > 700) {
      discountRate.value = 0.036; depositRequired.value = false
    } else if (creditScore.value >= 651) {
      discountRate.value = 0.023; depositRequired.value = false
    } else if (creditScore.value >= 601) {
      discountRate.value = 0.012; depositRequired.value = true
    } else if (creditScore.value >= 551) {
      discountRate.value = 0.005; depositRequired.value = true
    } else {
      discountRate.value = 0; depositRequired.value = true
    }
  } catch (err) {
    ElMessage.error(`获取信用分失败：${err}`)
  }
}

watch(() => props.modelValue, visible => {
  if (visible) fetchCredit()
})

function handleClose() {
  emit('update:modelValue', false)
}

function handleConfirm() {
  ElMessage.success('预订已完成')
  emit('confirm')
  emit('update:modelValue', false)
}

function formatDate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
</script>