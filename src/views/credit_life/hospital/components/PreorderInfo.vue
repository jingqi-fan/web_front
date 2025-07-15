<template>
  <div class="confirm-layout">
    <div class="grid-container">
      <!-- 上半部分 -->
      <div class="top-section">
        <!-- 左侧医生卡 -->
        <div class="doctor-card">
          <el-card shadow="hover">
            <div class="doctor-header">
              <el-avatar :src="doctor?.image" size="large" />
              <div class="doctor-info">
                <div class="info-row name-title">
                  <span class="doctor-name">{{ doctor?.doctorName }}&nbsp;-&nbsp;{{ getTitleLabel(doctor?.doctorTitle) }}</span>
                </div>
                <div class="info-row department-hospital">
                  {{ getDepartmentName(doctor?.departmentId) }} · 杭州市人民医院
                </div>
                <div class="info-row rating">
                  <el-rate :model-value="4.5" disabled show-score score-template="{value}" />
                  <span class="rating-count">(128条评价)</span>
                </div>
              </div>
            </div>

            <!-- 中部：专业特长 -->
            <div class="doctor-specialty">
              <span class="label">专业特长：</span><br/>&nbsp;&nbsp;&nbsp;&nbsp;{{ doctor?.doctorSpecialty }}
            </div>

            <!-- 底部：出诊信息 -->
            <div class="doctor-schedule">
              <el-icon><Calendar /></el-icon>
              <span>周一到周五 8:30 - 17:30</span>
              <span class="fee">门诊费用：<b>380元</b></span>
            </div>
          </el-card>
        </div>


        <div class="calendar-area">
          <el-calendar v-model="selectedDate" class="custom-calendar">
            <template #date-cell="{ data }">
              <div
                  class="calendar-cell"
                  :class="{ selected: isSameDay(data.date, selectedDate) }"
                  @click="handleDateClick(data.date)"
              >
                {{ data.day.split('-').pop() }}
              </div>
            </template>
          </el-calendar>
        </div>


      </div>

      <!-- 下半部分 -->
      <div class="bottom-section">
        <el-form :model="form" label-width="100px" class="form-area" :rules="rules" ref="formRef">
          <h4 style="margin-left: 30px">预约信息</h4>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item  prop="patientName">
                <template #label>
                  <span class="custom-label">就诊人姓名</span>
                </template>
                <el-input v-model="form.patientName" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item  prop="phone">
                <template #label>
                  <span class="custom-label">联系电话</span>
                </template>
                <el-input v-model="form.phone" placeholder="请输入电话" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item  prop="description">
            <template #label>
              <span class="custom-label">基本情况</span>
            </template>
            <el-input
                type="textarea"
                v-model="form.description"
                placeholder="请简单说明病情"
                :rows="4"
            />
          </el-form-item>
        </el-form>

        <div class="form-buttons">
          <el-button style="margin-bottom: 20px" @click="goBack">上一步</el-button>
          <el-button style="margin-bottom: 20px;margin-right: 20px" type="primary" @click="confirmAppointment">确认预约</el-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useHospitalHomePreorderDoctor } from '@/stores/useHospitalHomePreorderDoctor'
import { ref } from 'vue'
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";
import {ElMessage} from "element-plus";
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import {Calendar} from "@element-plus/icons-vue";
import {getPreOrderInfo} from "@/api/life/hospital_api.ts";
import router from "@/router";
import {useWillConfirmPreorderStore} from "@/stores/useWillConfirmPreorderStore.ts";

dayjs.locale('zh-cn') // 设置全局语言为中文
const userInfoStore=useUserInfoStore()
const userInfo=userInfoStore.user
const selectedDate = ref<Date>(new Date())

const isSameDay = (d1: Date, d2: Date | null) => {
  if (!d2) return false
  return dayjs(d1).isSame(d2, 'day')
}
const handleDateClick = (date: Date) => {
  selectedDate.value = date
}
const departments = ['内科', '外科', '儿科', '神经科', '口腔科', '眼科', '妇产科', '心血管科']
const getDepartmentName=(id:number)=>{
  return departments[id-1]
}
const preorderStore = useHospitalHomePreorderDoctor()
const doctor = preorderStore.doctor
const rules: FormRules = {
  patientName: [{ required: true, message: '请输入就诊人姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  description: [{ required: true, message: '请输入病情说明', trigger: 'blur' }]
}


const form = ref({
  patientName: userInfo.nickName===''?'':userInfo.nickName,
  phone: userInfo.phone===''?'':userInfo.phone,
  description: ''
})

const goBack = () => {
  router.back()
}

const confirmAppointment =async () => {
  if (!selectedDate.value) {
    return ElMessage.warning('请选择预约日期')
  }
  if(!form.value.patientName || !form.value.phone || !form.value.description){
    return ElMessage.warning('请填写完整信息')
  }
  const res=await getPreOrderInfo({
    doctorId: doctor.id,
    reason: form.value.description
  },userInfo.id)
  console.log(res)
  if(res.code===500){
    ElMessage.error(res.msg?res.msg:'预约失败')
    router.back()
    return
  }

  console.log("res=",res)
  const willConfirmPreorderStore=useWillConfirmPreorderStore()
  willConfirmPreorderStore.setThis(res.data)
  ElMessage.success('预约成功')
  await router.push('/life/hospital_order_home/preorder_confirm')
}

const getTitleLabel = (title: number | undefined) => {
  switch (title) {
    case 0: return '普通医生'
    case 1: return '副主任'
    case 2: return '主任'
    default: return '未知职称'
  }
}
</script>

<style scoped lang="scss">
.doctor-card .el-card {
  padding: 10px;
  border-radius: 6px;
}

.doctor-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.doctor-info {
  margin-left: 16px;
  flex: 1;
}

.info-row {
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}

.name-title {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.rating {
  display: flex;
  align-items: center;

  .el-rate {
    margin-right: 8px;
  }

  .rating-count {
    font-size: 13px;
    color: #888;
  }
}

.doctor-specialty {
  margin-bottom: 12px;
  font-size: 14px;
  color: #444;
  margin-top: 40px;
  min-height: 120px;
  max-height: 150px;

  .label {
    font-weight: bold;
    color: #222;
  }
}

.doctor-schedule {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #444;
  gap: 8px;
  margin-top: 20px;

  .fee {
    margin-left: auto;
    color: #409EFF;
    font-weight: bold;
  }
}

.confirm-layout {
  padding: 20px;
  background-color: #fff;
  height: 80%;
}
.calendar-area{
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
}
.page-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}
.grid-container {
  display: grid;
  grid-template-rows: 1fr 1fr;
  height: calc(100vh - 180px);
  gap: 20px;
}
.calendar-cell {
  width: 100%;
  height: 100%;
  padding: 6px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #f0f2f5;
  }

  &.selected {
    background-color: #409EFF;
    color: #fff;
  }
}
.custom-calendar {
  height: 320px;
  overflow: auto;

  // 表格压缩高度
  .el-calendar__body {
    height: 100%;

    .el-calendar-table {
      height: 100%;
      table-layout: fixed;

      tbody tr {
        height: 20px; // 控制每行高度
      }

      td {
        height: 20px; // 控制每个格子高度
        padding: 0;
      }
    }
  }
}

.calendar-cell {
  font-size: 14px;
  height: 100%;
  line-height: 40px; // 保证内容垂直居中
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #f0f2f5;
  }

  &.selected {
    background-color: #409EFF;
    color: #fff;
  }
}


/* 上半部分：医生卡 + 日历 */
.top-section {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 20px;
}
.doctor-card .el-card {
  height: 94%;
}
.doctor-avatar {
  text-align: center;
  margin-bottom: 10px;
}
.custom-label {
  display: block;
  font-size: 13px;
  color: #444;
  margin-bottom: 4px;
}

.doctor-name {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
.doctor-title {
  color: #666;
  text-align: center;
  margin-top: 4px;
}
.doctor-desc {
  font-size: 13px;
  color: #888;
  margin-top: 8px;
  text-align: center;
}

/* 下半部分：表单 + 按钮 */
.bottom-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
}
.form-area {
  flex: 1;
  padding-right: 20px;
}
.form-buttons {
  text-align: right;
}
</style>
