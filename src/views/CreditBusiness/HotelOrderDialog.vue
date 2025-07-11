<template>
  <el-dialog
    :model-value="modelValue"
    title="预订提交"
    width="40%"
    :close-on-click-modal="false"
    @close="handleClose"
    class="hotel-order-dialog"
  >
    <div class="order-dialog-body">
      <!-- 预订信息 -->
      <el-form label-width="100px" class="section-form">
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
          <span class="unit">晚</span>
        </el-form-item>
        <el-form-item label="离店日期">
          <span>{{ formatDate(checkOutDate) }}</span>
        </el-form-item>
        <el-form-item label="还款期限">
          <span>{{ repaymentDeadlineText }}</span>
        </el-form-item>
      </el-form>

      <el-divider class="section-divider" />

      <!-- 信用信息 -->
      <el-form label-width="100px" class="section-form">
        <el-form-item label="信用分">
          <span>{{ creditScore }}</span>
        </el-form-item>
        <el-form-item label="折扣">
          <span>{{ (discountRate * 100).toFixed(1) }}%</span>
        </el-form-item>
      </el-form>

      <el-divider class="section-divider" />

      <!-- 价格明细 -->
      <el-form label-width="100px" class="section-form">
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
        <el-divider class="inner-divider" />
        <el-form-item label="实际应付">
          <span class="actual-pay">¥{{ actualPayable.toFixed(2) }}</span>
        </el-form-item>
      </el-form>
    </div>

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

const nights = ref(1)
const creditScore = ref(0)
const discountRate = ref(0)
const depositRequired = ref(true)

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
const actualPayable = computed<number>(() => {
  return discountedPrice.value + (depositRequired.value ? props.roomType.deposit : 0)
})
const repaymentDeadlineDays = computed<number>(() => {
  const now = Date.now()
  const diff = checkOutDate.value.getTime() - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})
const repaymentDeadlineText = computed<string>(
  () => `${repaymentDeadlineDays.value} 天`
)

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

watch(() => props.modelValue, visible => {
  if (visible) fetchCredit()
})

function handleClose() {
  emit('update:modelValue', false)
}

function handleConfirm() {
  ElMessageBox.confirm(
    '确认提交订单？',
    '二次确认',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  )
    .then(async () => {
      const uid = useUserInfoStore().user.id
      const payload: Omit<HotelReservation,'orderId'|'bookDate'|'payDate'> = {
        userId: uid,
        hotelId: props.hotel.id,
        typeId: props.roomType.typeId,
        price: actualPayable.value,
        checkinDate: formatDateTime(props.checkInDate),
        checkoutDate: formatDateTime(checkOutDate.value),
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
    .catch(() => {})
}

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

<style scoped>
.hotel-order-dialog .el-dialog__header {
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #f0f2f5;
  padding-bottom: 12px;
}
.order-dialog-body {
  padding: 20px 24px;
  background: #ffffff;
}
.section-form {
  margin-bottom: 0;
}
.unit {
  margin-left: 8px;
  color: #909399;
}
.section-divider {
  margin: 16px 0;
  border-top: 1px solid #f0f2f5 !important;
}
.inner-divider {
  margin: 12px 0;
  border-top: 1px dashed #e4e7ed !important;
}
.actual-pay {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.el-dialog__footer {
  padding: 12px 24px;
  border-top: 1px solid #f0f2f5 !important;
  text-align: right;
}
.el-button {
  min-width: 80px;
}
</style>