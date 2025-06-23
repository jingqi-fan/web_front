<template>
  <el-dialog
    :model-value="modelValue"
    title="预订提交"
    width="40%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form label-width="100px">
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
        <el-input-number
          v-model="nights"
          :min="1"
          :max="180"
          label="晚数"
        />
        <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;天</span>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserCreditScoreInfo } from '../../api/user'
import { useUserInfoStore } from '../../stores/useUserInfoStore'
import { createReservation } from '../../api/hotelReservation'

import type { Hotel } from '../../entity/Hotel'
import type { RoomType } from '../../entity/RoomType'
import type { HotelReservation } from '../../entity/HotelReservation'

// Props & Emits
const props = defineProps<{
  modelValue: boolean
  hotel: Hotel
  roomType: RoomType
  checkInDate: Date
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
}>()

// 本地状态
const nights = ref(1)
const creditScore = ref(0)
const discountRate = ref(0)
const depositRequired = ref(true)

// 计算属性
const checkOutDate = computed<Date>(() => {
  const d = new Date(props.checkInDate)
  d.setDate(d.getDate() + nights.value)
  return d
})
const originalPrice = computed<number>(
  () => nights.value * props.roomType.price
)
const discountedPrice = computed<number>(
  () => originalPrice.value * (1 - discountRate.value)
)
const repaymentDeadlineDays = computed<number>(() => {
  const now = Date.now()
  const diff = checkOutDate.value.getTime() - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})
const repaymentDeadlineText = computed<string>(
  () => `${repaymentDeadlineDays.value} 天`
)

// 拉取信用分并计算折扣/押金策略
async function fetchCredit() {
  try {
    const userInfo = useUserInfoStore().user
    const uc = await getUserCreditScoreInfo(userInfo.id)
    creditScore.value = uc.creditScore ?? 0
    if (creditScore.value > 700) {
      discountRate.value = 0.036
      depositRequired.value = false
    } else if (creditScore.value >= 651) {
      discountRate.value = 0.023
      depositRequired.value = false
    } else if (creditScore.value >= 601) {
      discountRate.value = 0.012
      depositRequired.value = true
    } else if (creditScore.value >= 551) {
      discountRate.value = 0.005
      depositRequired.value = true
    } else {
      discountRate.value = 0
      depositRequired.value = true
    }
  } catch (err: any) {
    ElMessage.error(`获取信用分失败：${err.message || err}`)
  }
}

// 监听弹窗显示，打开时刷新信用分
watch(() => props.modelValue, visible => {
  if (visible) fetchCredit()
})

// 关闭弹窗
function handleClose() {
  emit('update:modelValue', false)
}

// 确认提交：二次确认 → 调用 API → 提示 & 关闭
function handleConfirm() {
  ElMessageBox.confirm(
    '确认提交订单？',
    '二次确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const uid = useUserInfoStore().user.id
      const payload: Omit<HotelReservation, 'orderId' | 'bookDate'> = {
        userId: uid,
        hotelId: props.hotel.id,
        typeId: props.roomType.typeId,
        price: discountedPrice.value,
        // 传递格式化后的 timestamp 字符串
        checkinDate: formatDateTime(props.checkInDate),
        checkoutDate: formatDateTime(checkOutDate.value),
        isCheckin: 0,
        isPay: 0,
        promise: 0
      }
      try {
        const res = await createReservation(payload)
        ElMessage.success(`预订成功！订单号：${res.orderId}`)
        emit('confirm')
        emit('update:modelValue', false)
      } catch (err: any) {
        ElMessage.error(`预订失败：${err.message || err}`)
      }
    })
    .catch(() => {
      // 用户取消
    })
    }

// 格式化到“YYYY-MM-DD”
function formatDate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}


function formatDateTime(d: Date) {
  const Y = d.getFullYear()
  const M = String(d.getMonth() + 1).padStart(2, '0')
  const D = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${Y}-${M}-${D} ${h}:${m}:${s}`
}
</script>