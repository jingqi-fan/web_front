<template>
  <el-container class="page-container">
    <!-- 顶部导航 -->
    <el-header class="page-header">
      <el-button type="text" :icon="Back" @click="goBack" />
      <div class="title">医院处方和检查单开具系统</div>
      <div class="doctor-info">
        {{ doctor.name }}（{{ doctor.department }}）
      </div>
    </el-header>

    <!-- 主体内容 -->
    <el-main class="page-main">
      <!-- 搜索与筛选 -->
      <div class="filter-bar">
        <el-input v-model="searchKeyword" placeholder="搜索患者姓名/编号..." prefix-icon="Search" style="width: 300px;" clearable />
        <el-select v-model="selectedStatus" placeholder="选择状态" style="width: 180px; margin-left: 20px;" clearable>
          <el-option label="待就诊" value="待就诊" />
          <el-option label="已开具" value="已开具" />
        </el-select>
      </div>

      <!-- 待就诊患者卡片列表 -->
      <div class="card-list">
        <PatientCard
            v-loading="loading"
            v-for="user in filteredPatients"
            :key="user.id"
            :data="user"
            @click="handleOpen(user)"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Back } from '@element-plus/icons-vue'
import PatientCard from './PatientCard.vue'
import {getDoctorDetail, getDrugs, getExamList, getPatientsList, startCheck} from "@/api/life/hospital_api.ts";
import {useDoctorIdStore} from "@/stores/useDoctorIdStore.ts"; // 使用你提供的组件
import {ElLoading} from "element-plus";

const goBack = () => history.back()

const doctor = {
  name: '李医生',
  department: '内科'
}

const searchKeyword = ref('')
const selectedStatus = ref('')


const doctorIdStore=useDoctorIdStore()
const doctorId=doctorIdStore.doctorId



import type {PatientInfoRes} from "@/api/life/hospital_type.ts";
import {getUserCreditScore} from "@/api/user.ts";
import router from "@/router";

const cardPatients = ref<PatientCardProps[]>([])

const loadAllPatientDetail = async () => {
  const res: PatientInfoRes[] = await getPatientsList(doctorId)

  const loading=ElLoading.service({text:"正在加载用户数据····"})

  const transformed: PatientCardProps[] = []



  for (const item of res) {
    const creditRes:number = await getUserCreditScore(item.user.id) // 根据用户 id 获取信用分
    console.log("界面  ",creditRes)
    transformed.push({
      id: item.user.id,
      name: item.user.nickName || item.user.username,
      credit: creditRes || 0,
      date: item.appointments?.appointmentTime?.split('T')[0] || '',
      description: item.appointments?.reason || ''
    })
  }

  cardPatients.value = transformed

  loading.close()
}

loadAllPatientDetail()    //TODO 错的
const filteredPatients = computed(() => {
  return cardPatients.value.filter(p =>
      p.name.includes(searchKeyword.value) &&
      (selectedStatus.value ? getStatus(p.id) === selectedStatus.value : true)
  )
})


const handleOpen =async  (user: any) => {
  await startCheck(user.id,doctorId)
  await router.push(`/doctor/check_list/${user.id}`)
}
</script>

<style scoped lang="scss">
.page-container {
  height: 98vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

  .title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  .doctor-info {
    font-size: 14px;
    color: #666;
  }
}

.page-main {
  padding: 20px;
  background: #f5f7fa;
  flex: 1;
  overflow-y: auto;
}

.filter-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.card-list {
  height: 600px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
