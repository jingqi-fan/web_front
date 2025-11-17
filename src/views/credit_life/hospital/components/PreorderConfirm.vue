<template>
  <div class="confirm-page">
    <h1 style="margin-right: 1000px;font-size: 20px">预约确认</h1>
    <!-- 预约信息 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">预约信息</div>
      </template>
      <div class="info-line"><span class="label">就诊科室：</span>{{ willConfirmPreorder.departmentName }}</div>
      <div class="info-line"><span class="label">医生姓名：</span>{{ willConfirmPreorder.doctorName }}（{{ getDoctorLevel(willConfirmPreorder.doctorTitle) }}）</div>
      <div class="info-line"><span class="label">医生简介：</span>{{ doctorInfo.doctorSpecialty }}</div>
      <div class="info-line"><span class="label">预约时间：</span>{{ willConfirmPreorder.creatTimeStr }}</div>
      <div class="info-line"><span class="label">就诊人：</span>{{ willConfirmPreorder.userInfo?.nickName }}（{{ creditScore?.idNumber }}）</div>
    </el-card>

    <!-- 费用信息 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">费用信息</div>
      </template>
      <div class="info-line"><span class="label">当前信用分：</span><span class="score">{{ creditScore.creditScore }}</span></div>
      <div class="info-line"><span class="label">挂号费：</span><span class="fee">￥{{ willConfirmPreorder.fee }}</span></div>
      <div class="info-line"><span class="label">其他费用（预计）：</span>￥ 240 </div>
      <div class="info-line"><span class="label">总费用：</span><span class="total-fee">￥{{ willConfirmPreorder.fee+240 }}</span></div>
    </el-card>

    <!-- 按钮区域 -->
    <div class="button-area">
      <el-button @click="goBack">返回修改</el-button>
      <el-button type="success" @click="confirm">确认预约</el-button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ElMessage } from 'element-plus'
import {useHospitalHomePreorderDoctor} from "@/stores/useHospitalHomePreorderDoctor.ts";
import {useWillConfirmPreorderStore} from "@/stores/useWillConfirmPreorderStore.ts";
import {useUserCreditScoreStore} from "@/stores/useUserCreditScore.ts";
import router from "@/router";
import {confirmOrder} from "@/api/life/hospital_api.ts";

const willConfirmPreorderStore=useWillConfirmPreorderStore()
const willConfirmPreorder=willConfirmPreorderStore.confirmPreorder
console.log("msg",willConfirmPreorder)
const userCreditScore=useUserCreditScoreStore()
const creditScore=userCreditScore.score

const preorderDoctorStore=useHospitalHomePreorderDoctor()
const doctorInfo=preorderDoctorStore.doctor

const getDoctorLevel=(title:string)=>{
  switch(title){
    case '0': return '普通医生'
    case '1': return '副主任'
    case '2': return '主任'
    default: return title
  }
}

const goBack = () => router.back()

const confirm =async () => {
  const res=await confirmOrder(willConfirmPreorder.appointmentId)
  if(res.code===500){
    ElMessage.error(res.msg?res.msg:'预约失败')
    return
  }
  ElMessage.success(res)
  await router.push('/life/hospital_order_home/myorder')
}

</script>

<style scoped lang="scss">
.confirm-page {
  padding: 20px;
  background-color: #f8f9fa;
  height: 650px; // 限制整体高度
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-card {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.info-line {
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
}

.label {
  color: #666;
  font-weight: 500;
  font-size: 14px;
  margin-right: 4px;
}

.score {
  font-weight: bold;
  color: #409EFF;
}

.fee {
  font-weight: 500;
  color: #666;
}

.total-fee {
  font-weight: bold;
  font-size: 16px;
  color: #F56C6C;
}

.button-area {
  width: 100%;
  max-width: 600px;
  text-align: right;
  margin-top: auto;
}

</style>
