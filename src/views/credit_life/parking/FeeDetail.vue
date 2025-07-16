<template>
  <div class="fee-detail-page">
    <!-- 顶部标题 -->
    <div class="header">
      <div class="lot-name">{{ lotName }}</div>
      <div class="slot-number">车位编号：{{ spaceNum }}</div>
    </div>

    <!-- 中间居中显示的详情内容 -->
    <div class="fee-content">
      <div class="label">停车时长</div>
      <div class="value duration">{{ feeDetail?.parkingTimeStr }}</div>
      <div class="entry-time">入场时间：{{ feeSimple?.startTime }}</div>
      <div class="label">当前费用</div>
      <div class="value fee">￥{{ feeDetail?.totalFee }}</div>
      <div class="rules">计费规则：首小时￥10，之后每小时￥12</div>
      <div class="rules">{{feeSimple?.msg}}</div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="button-area">
      <el-button @click="goBack">返回</el-button>
      <el-button type="primary" @click="payFee">支付</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {useRoute} from "vue-router";
import {getFeeDetail, getParkingFee} from "@/api/life/parking_api.ts";
import type {ParkingFeeRes, ParkingNeedPayFeeRes} from "@/api/life/parking_type.ts";
import {useParkingOrderPayStore} from "@/stores/useParkingOrderPayStore.ts";
import router from "@/router";
import {payParkingFee} from "@/api/life/parking_api.ts";
import {ElMessage} from "element-plus";

const route = useRoute()
const appointmentId = route.params.id

const feeDetail=ref<ParkingNeedPayFeeRes>()
const feeSimple=ref<ParkingFeeRes>()
const loadFeeDetail=async ()=>{
  const res1:ParkingNeedPayFeeRes=await getFeeDetail(appointmentId)
  const res2:ParkingFeeRes=await getParkingFee(appointmentId)
  feeDetail.value=res1
  feeSimple.value=res2
  console.log("费用详情数据",res1)
  console.log("费用简报",res2)
}
loadFeeDetail()

const lotName = ref('智慧停车场')
const spaceNum=ref('')


const initLotNameAndSpaceNum=()=>{
  const parkingOrderPayStore=useParkingOrderPayStore()
  const store=parkingOrderPayStore.parkingPay
  lotName.value=store.title
  spaceNum.value=store.spaceNum
  console.log("store",store)
}
initLotNameAndSpaceNum()

const goBack = () => {
  router.back()
}
const payFee =async () => {
  const res=await payParkingFee(feeDetail.value?.parkingFeeId, appointmentId)
  ElMessage.success("支付成功")
  await router.push('/parking/home')
}
</script>

<style scoped lang="scss">
.fee-detail-page {
  min-height: 92vh;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.header {
  text-align: center;
  margin-bottom: 24px;
  .lot-name {
    font-size: 22px;
    font-weight: bold;
  }
  .slot-number {
    color: #666;
    margin-top: 4px;
    font-size: 14px;
  }
}
.fee-content {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 32px;
  align-items: center;
  text-align: center;
  height: 500px;
  width: 100%;
  max-width: 400px;
  .label {
    color: #666;
    font-size: 14px;
    margin-top: 90px;
  }
  .value {
    font-weight: bold;
    margin-top: 6px;
  }
  .duration {
    font-size: 22px;
  }
  .entry-time {
    font-size: 14px;
    margin-top: 12px;
    color: #333;
  }
  .fee {
    font-size: 26px;
    color: #409EFF;
  }
  .rules {
    font-size: 13px;
    color: #888;
    margin-top: 12px;
  }
}
.button-area {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  padding: 0 10px;
}
</style>
