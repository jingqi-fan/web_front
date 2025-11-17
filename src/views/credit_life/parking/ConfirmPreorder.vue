<template>
  <div class="confirm-page">
    <!-- 标题区 -->
    <div class="title-area">
      <h2 class="main-title">预约确认</h2>
      <p class="subtitle">请确认您的预约信息</p>
    </div>

    <!-- 预约场所信息 -->
    <el-card class="info-card">
      <div class="section-title">预约信息</div>
      <div class="info-row">
        <el-icon><OfficeBuilding /></el-icon>
        <span class="info-label">停车场名称：</span>
        <span>{{ lotName }}</span>
      </div>
      <div class="info-row">
        <el-icon><Grid /></el-icon>
        <span class="info-label">车位编号：</span>
        <span>{{ spaceNum }}</span>
      </div>
      <div class="info-row">
        <el-icon><Clock /></el-icon>
        <span class="info-label">预约时间：</span>
        <span>{{ startTime }}</span>
      </div>
    </el-card>

    <!-- 信用评估 -->
    <el-card class="info-card">
      <div class="section-title">信用评估</div>
      <div class="credit-grid">
        <div class="credit-box">
          <el-icon><User /></el-icon>
          <div class="credit-label">当前信用分</div>
          <div class="credit-value">{{ currentScore }}</div>
        </div>
        <div class="credit-box">
          <el-icon><Tickets /></el-icon>
          <div class="credit-label">要求信用分</div>
          <div class="credit-value">{{ requiredScore }}</div>
        </div>
        <div class="credit-box">
          <el-icon :style="{ color: creditStatusColor }">
            <component :is="creditStatusIcon" />
          </el-icon>
          <div :class="['credit-label', creditStatusColorClass]">{{ creditStatusText }}</div>
        </div>
      </div>
    </el-card>

    <!-- 费用明细 -->
    <el-card class="info-card">
      <div class="section-title">费用明细</div>
      <div class="detail-row">
        <span>停车时长</span>
        <span>{{ durationText }}</span>
      </div>
      <div class="detail-row">
        <span>每小时单价</span>
        <span>￥{{ pricePerHour.toFixed(2) }}</span>
      </div>
      <el-divider />
      <div class="detail-row total-row">
        <span>预估总费用</span>
        <span class="total-fee">￥{{ totalFee.toFixed(2) }}</span>
      </div>
      <p class="fee-tip">* 实际费用以实际出场时间系统计算为准，超出预估时长部分将会按实际加收费用</p>
    </el-card>

    <!-- 底部按钮 -->
    <div class="button-group">
      <el-button @click="goBack">返回修改</el-button>
      <el-button type="success" @click="confirmOrder">确认预约</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  OfficeBuilding,
  Grid,
  Clock,
  User,
  Tickets,
  CircleCheckFilled,
  CircleCloseFilled,
} from '@element-plus/icons-vue'
import {useParkingSpacePreorderStore} from "@/stores/useParkingSpacePreorderStore.ts";
import type {ParkingPreOrderInfoRes} from "@/api/life/parking_type.ts";
import {useUserCreditScoreStore} from "@/stores/useUserCreditScore.ts";
import router from "@/router";
import {orderParking} from "@/api/life/parking_api.ts";
import {ElMessage, ElMessageBox} from "element-plus";

const lotName = ref('市中心停车场')
const spaceNum = ref('A02')
const startTime = ref(Date.now())
const endTime = ref(Date.now() + 2 * 60 * 60 * 1000)
const currentScore = ref(720)
const requiredScore = ref(600)
const pricePerHour = ref(5)
const durationHours = ref(0)
const appointmentId=ref(0)
const totalFee = ref(0.0)

const userCreditScoreStore=useUserCreditScoreStore()
const ucsStore=userCreditScoreStore.score
const loadPreorderInfo= ()=>{
  const parkingSpacePreorderStore=useParkingSpacePreorderStore()
  const preorderInfo:ParkingPreOrderInfoRes=parkingSpacePreorderStore.preorder

  lotName.value=preorderInfo.parkingLotName
  spaceNum.value=preorderInfo.spaceNum
  startTime.value=preorderInfo.appointTimeStr
  currentScore.value=ucsStore.creditScore
  pricePerHour.value=preorderInfo.price
  durationHours.value=preorderInfo.spendTimeCount
  totalFee.value=preorderInfo.totalPrice
  appointmentId.value=preorderInfo.appointmentId
}
loadPreorderInfo()


const formattedTime = computed(() => {
  const s = new Date(startTime.value)
  const e = new Date(endTime.value)
  return `${s.getFullYear()}-${s.getMonth() + 1}-${s.getDate()} ${s.getHours()}:00 至 ${e.getHours()}:00`
})

const creditStatusOk = computed(() => currentScore.value >= requiredScore.value)
const creditStatusText = computed(() => (creditStatusOk.value ? '满足停车要求' : '不符合停车要求'))
const creditStatusIcon = computed(() => (creditStatusOk.value ? CircleCheckFilled : CircleCloseFilled))
const creditStatusColor = computed(() => (creditStatusOk.value ? '#67C23A' : '#F56C6C'))
const creditStatusColorClass = computed(() => (creditStatusOk.value ? 'text-green' : 'text-red'))

const durationText = computed(() => `${durationHours.value} 小时`)

const goBack = () => {
  router.back()
}
const confirmOrder =async () => {
  const res=await orderParking(appointmentId.value,ucsStore.id)
  ElMessageBox.confirm(
    '确认预约',
    `您已成功预约停车位!`,
    {
      confirmButtonText: '停车服务主页',
      cancelButtonText: '信用生活主页',
      type: 'success',
    },
  ).then(() => {
    router.push('/parking/home')
  }).catch(()=>{
    router.push('/life')
  })
}
</script>

<style scoped lang="scss">
.confirm-page {
  height: 92vh;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  background: #f5f5f5;
}
.title-area {
  text-align: center;
  margin-bottom: 24px;
  .main-title {
    font-size: 24px;
    font-weight: bold;
  }
  .subtitle {
    font-size: 14px;
    color: #888;
    margin-top: 8px;
  }
}
.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}
.info-card {
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}
.info-row {
  display: flex;
  align-items: center;
  margin: 6px 0;
  .el-icon {
    margin-right: 6px;
    color: #409EFF;
  }
  .info-label {
    margin-right: 6px;
    color: #666;
  }
}
.credit-grid {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  .credit-box {
    flex: 1;
    text-align: center;
    background: #fafafa;
    padding: 10px;
    border-radius: 8px;
    .el-icon {
      font-size: 24px;
      margin-bottom: 6px;
    }
    .credit-label {
      font-size: 12px;
      color: #666;
    }
    .credit-value {
      font-size: 18px;
      font-weight: bold;
      margin-top: 4px;
    }
  }
}
.detail-row {
  display: flex;
  justify-content: space-between;
  margin: 6px 0;
}
.total-row {
  font-weight: bold;
}
.total-fee {
  color: #1f5cff;
  font-size: 18px;
}
.fee-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}
.text-green {
  color: #67C23A;
}
.text-red {
  color: #F56C6C;
}
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
