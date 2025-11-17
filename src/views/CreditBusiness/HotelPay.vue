<template>
  <el-dialog
    v-model="innerVisible"
    title="订单还款"
    width="60%"
    custom-class="hotel-pay-dialog"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <div class="pay-content">
      <!-- 左侧订单信息 -->
      <div class="pay-left">
        <p><strong>订单号：</strong>{{ reservation.orderId }}</p >
        <p><strong>订单描述：</strong>{{ reservation.hotelName }} - {{ reservation.typeName }}</p >
        <p><strong>总价：</strong>{{ reservation.price }} 元</p >
        <p><strong>预订日期：</strong>{{ formatDate(reservation.bookDate) }}</p >
        <p>
          <strong>入住日期：</strong>{{ formatDate(reservation.checkinDate) }}
          <span class="stay-days">入住时长：{{ calcDays(reservation.checkinDate, reservation.checkoutDate) }} 天</span>
        </p >
        <p>
          <strong>截止日期：</strong>{{ formatDate(reservation.checkoutDate) }}
        </p >
        <p class="pay-method">
          <strong>选择支付方式：</strong>
          <el-radio-group v-model="paymentMethod" size="middle">
            <el-radio label="wechat">微信</el-radio>
            <el-radio label="alipay">支付宝</el-radio>
          </el-radio-group>
        </p >
      </div>

      <!-- 右侧二维码 -->
      <div class="pay-right">
        <img
          :src="qrCodeUrl"
          class="qr-img"
          @click="refreshQr"
          alt="扫码支付"
        />
      </div>
    </div>

    <template #footer>
      <el-button style="background-color: #B77D00; color: #fff;" @click="close">
        取消
      </el-button>
      <el-button type="success" @click="onPay">
        支付
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref ,watch } from 'vue'
import { repayReservation } from '../../api/hotelReservation'
import type { HotelReservation } from '../../entity/HotelReservation'
import QRCode from 'qrcode'

const props = defineProps<{
  modelValue: boolean
  reservation: HotelReservation & {
    hotelName: string
    typeName: string
    bookDate: string
    checkinDate: string
    checkoutDate: string
    price: number
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'success'): void
}>()

// 和外层 v-model 联动
const innerVisible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

// 支付方式
const paymentMethod = ref<'wechat' | 'alipay'>('wechat')
/** 二维码数据 **/
const qrCodeUrl = ref<string>('')
// 关闭弹窗
function close() {
  innerVisible.value = false
}

// 确认支付
async function onPay() {
  await repayReservation(props.reservation.orderId)
  emit('success')
  close()
}

// 格式化日期到 YYYY-MM-DD
function formatDate(dt: string) {
  return dt.split(' ')[0]
}

/** 刷新二维码：在 URL 后加个时间戳做扰动 **/
async function refreshQr() {
  const base = 'https://www.chinasofti.com/'
  const url = `${base}?t=${Date.now()}`
  qrCodeUrl.value = await QRCode.toDataURL(url, { width: 200 })
}

// 计算入住天数
function calcDays(start: string, end: string) {
  const d1 = new Date(start.split(' ')[0])
  const d2 = new Date(end.split(' ')[0])
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24))
}

/** 组件打开或数据变化时自动生成一次二维码 **/
watch(
  () => props.modelValue,
  v => {
    if (v) refreshQr()
  },
  { immediate: true }
)
</script>

<style scoped>
.hotel-pay-dialog .el-dialog__header {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}
.pay-content {
  display: flex;
  padding: 20px 0;
}
.pay-left {
  flex: 1;
  font-size: 16px;
}
.pay-left p {
  margin: 8px 0;
}
.stay-days {
  margin-left: 12px;
  font-weight: 500;
}
.pay-method {
  margin-top: 16px;
}
.pay-right {
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qr-img {
  width: 200px;
  height: 200px;
  border: 1px solid #dcdcdc;
  cursor: pointer;
}

</style>