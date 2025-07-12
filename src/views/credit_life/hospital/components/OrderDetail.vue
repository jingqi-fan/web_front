<template>
  <div class="check-detail">
    <!-- 顶部标题栏 -->
    <el-page-header content="检查详情" @back="goBack" />

    <!-- 内容区域 -->
    <div class="detail-content">
      <!-- 上部：诊断描述 -->
      <div class="section diagnosis">
        <div><strong>初步诊断：</strong>{{ diagnosis }}</div>
        <div class="desc"><strong>病情描述：</strong>{{ description }}</div>
      </div>

      <!-- 中部：检查项目 -->
      <div class="section middle-section">
        <div class="section-title">检查项目</div>
        <div class="scroll-list">
          <el-card v-for="(item, index) in checkItems" :key="index" class="item-card">

            <el-splitter>
              <el-splitter-panel style="width: 600px" >
                <div class="item-name">{{ item.examinationItem.itemName }}</div>
                <div class="item-desc">{{ item.examinationItem.itemDescription }}</div>
              </el-splitter-panel>
              <el-splitter-panel style="display: flex;justify-content: center;align-items: center">
                <div class="item-fee">￥{{ item.examinationItem.itemPrice }}</div>
              </el-splitter-panel>
            </el-splitter>
          </el-card>

        </div>
      </div>

      <!-- 中部：药品项目 -->
      <div class="section middle-section">
        <div class="section-title">药品项目</div>
        <div class="scroll-list">
          <el-card v-for="(item, index) in drugItems" :key="index" class="item-card">
            <el-splitter>
              <el-splitter-panel style="width: 600px" >
                <div class="item-name">{{ item.drugInfo.drugName }}</div>
                <div class="item-desc">{{ item.drugInfo.drugSpecification }} · {{ item.usage1 }}</div>
              </el-splitter-panel>
              <el-splitter-panel style="display: flex;justify-content: center;align-items: center">
                <div class="item-fee">￥{{ item.drugInfo.drugPrice }}</div>
              </el-splitter-panel>
            </el-splitter>

          </el-card>
        </div>
      </div>
    </div>

    <!-- 底部：费用说明 + 操作按钮 -->
    <div class="footer-bar" v-if="AllFees">
      <div class="fee-info">
        <span>检查费用：￥{{ AllFees.examinationFee }}</span>
        <span>药品费用：￥{{ AllFees.drugFee }}</span>
        <span>诊疗费用：￥{{ AllFees.diagnosisFee }}</span>
        <span class="discount">信用分优惠：-￥{{ AllFees.discount }}</span>
        <span class="total">总计：<span class="total-amount">￥{{ AllFees.totalFee }}</span></span>
      </div>
      <div class="footer-buttons">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="pay">支付</el-button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import router from "@/router";
import { useRoute } from 'vue-router'
import {getResultDetail} from "@/api/life/hospital_api.ts";
import type {ResultDetailRes} from "@/api/life/hospital_type.ts";
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";
import type {
  ExaminationOrders,
  Fees, Prescriptions,
  ResultDetailResType
} from "@/api/life/hospital_result_detail_type.ts";

const route = useRoute()
const appointmentId=route.params.id;

const diagnosis = ref('')
const description = ref('')



const userInfoStore=useUserInfoStore()
const userInfo=userInfoStore.user

const resultDetail=ref<ResultDetailResType>()
const checkItems=ref<ExaminationOrders[]>([])
const drugItems=ref<Prescriptions[]>([])
const AllFees=ref<Fees|null>(null)
const loading = ref(true)
const loadOrderDetailForPay = async () => {
  resultDetail.value = null
  checkItems.value = []
  drugItems.value = []
  AllFees.value = null

  loading.value = true
  try {
    const res: ResultDetailResType = await getResultDetail(appointmentId, userInfo.id)
    console.log("结果")
    console.log(res)
    resultDetail.value = res
    checkItems.value = res.orders
    drugItems.value = res.prescriptions
    AllFees.value = res.fees

    description.value = res.reason
    diagnosis.value = res.diagnosisRecords?.diagnosisResult ?? ''
  } finally {
    loading.value = false
  }
}

loadOrderDetailForPay()

const goBack = () => router.back()

const pay = () => {
  router.push(`/doctor/order/pay/${appointmentId}`)
}
</script>

<style scoped lang="scss">
.check-detail {
  padding: 16px;
  background-color: #f8f9fa;
  min-height: 660px;
  display: flex;
  flex-direction: column;
}

.detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
}

.section {
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px;
}

.diagnosis .desc {
  margin-top: 6px;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.middle-section .scroll-list {
  max-height: 160px;
  overflow-y: auto;
  gap: 8px;
}
.demo-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 8px 12px;
  font-size: 14px;
  margin-bottom: 8px;
  box-sizing: border-box;
  box-shadow: var(--el-border-color-light) 0 0 10px
}
.item-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-width: 0;
}

.item-fee,
.right {
  font-weight: bold;
  font-size: 15px;
  color: #409EFF;
  white-space: nowrap;
  text-align: right;
}

.item-name {
  font-weight: bold;
  color: #333;
}

.item-time,
.item-desc {
  font-size: 13px;
  color: #666;
  margin-top: 2px;
}
.footer-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding: 12px 0;
  border-top: 1px solid #ddd;
  flex-wrap: wrap;
}

.fee-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 14px;
  color: #333;
  align-items: center;
}

.discount {
  color: #67C23A;
}

.total {
  font-weight: bold;
}

.total-amount {
  font-size: 18px;
  color: #409EFF;
}

.footer-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style>
