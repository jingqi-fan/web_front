<template>
  <div class="doctor-selector">
    <!-- 选择栏 -->
    <div class="filter-bar">
      <el-select v-model="selectedDepartment" style="width: 200px" @change="loadDoctorsByDepartment">
      <el-option v-for="dept in departments" :key="dept" :label="dept" :value="dept" />
      </el-select>

      <el-select v-model="selectedTitle" placeholder="职称" style="width: 160px; margin-left: 12px" @change="filterDoctors">
        <el-option label="全部" :value="-1" />
        <el-option label="普通医生" :value="0" />
        <el-option label="副主任" :value="1" />
        <el-option label="主任" :value="2" />
      </el-select>
    </div>

    <!-- 医生卡片 -->
    <el-row :gutter="20" class="doctor-list">
      <el-col :span="6" v-for="doctor in filteredDoctors" :key="doctor.id">
        <el-card shadow="hover" class="doctor-card">
          <div class="doctor-avatar">
            <el-avatar :src="doctor.image" size="large" />
          </div>
          <div class="doctor-info">
            <div class="doctor-name">{{ doctor.doctorName }}</div>
            <div class="doctor-title">{{ getDoctorLevel(doctor.doctorTitle) }} | {{getDoctorDepartment(doctor.departmentId)}}</div>
            <div class="doctor-desc">{{ doctor.doctorSpecialty }}</div>
          </div>
          <el-button type="success" size="small" @click="selectDoctor(doctor)" style="margin-top: 12px;">
            预约
          </el-button>
        </el-card>

      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import {getDoctors} from '@/api/life/hospital_api.ts'
import type { RecommendDoctorsRes } from '@/api/life/hospital_type.ts'
import router from "@/router";
import {useHospitalHomePreorderDoctor} from "@/stores/useHospitalHomePreorderDoctor.ts";
import {ElMessage, ElMessageBox} from "element-plus";

const departments = ['内科', '外科', '儿科', '神经科', '口腔科', '眼科', '妇产科', '心血管科']
const getDoctorDepartment=(id:number)=>{
  return departments[id-1]
}
// 默认选中“内科”
const selectedDepartment = ref('内科')
const selectedTitle = ref(-1)

onMounted(() => {
  loadDoctorsByDepartment(selectedDepartment.value)
})

const allDoctors = ref<RecommendDoctorsRes[]>([])
const filteredDoctors = ref<RecommendDoctorsRes[]>([])

const loadDoctorsByDepartment = async (department: string) => {
  const departmentId = departments.indexOf(department) + 1
  if (departmentId <= 0) {
    console.warn('未找到对应科室 ID')
    return
  }

  try {
    const res = await getDoctors(departmentId)
    console.log("res=",res)
    allDoctors.value = Array.isArray(res.doctorsList) ? res.doctorsList : []
    filterDoctors()
  } catch (err) {
    console.error('加载医生失败:', err)
    allDoctors.value = []
    filteredDoctors.value = []
  }
}


const filterDoctors = () => {
  filteredDoctors.value = allDoctors.value.filter((d) => {
    return selectedTitle.value === -1 || d.doctorTitle === selectedTitle.value
  })
}

const getDoctorLevel = (title: number) => {
  switch (title) {
    case 0: return '普通医生'
    case 1: return '副主任'
    case 2: return '主任'
    default: return title
  }
}
const preorderStore = useHospitalHomePreorderDoctor()

const selectDoctor = (doctor: RecommendDoctorsRes) => {
  console.log('选择医生：', doctor)
  ElMessageBox.confirm(`是否预约医生${doctor.doctorName}?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    preorderStore.setDoctor(doctor)
    router.push('/life/hospital_order_home/preorder_info')
    ElMessage.success('请确认医生预约信息')
  }).catch(() => {
    ElMessage.info('取消预约')
  })
}



</script>

<style scoped lang="less">
.doctor-selector {
  padding: 20px;
  background: #fff;
}
.filter-bar {
  margin-bottom: 20px;
}
.doctor-list{
  height: 580px;
  overflow-y: auto;
}
.doctor-card {
  margin-bottom: 6px;
  padding: 8px;
  text-align: center;
}
.doctor-avatar {
  margin-bottom: 12px;
}
.doctor-name {
  font-weight: bold;
  font-size: 16px;
}
.doctor-title {
  color: #666;
  font-size: 13px;
  margin-top: 4px;
}
.doctor-desc {
  color: #888;
  font-size: 12px;
  margin-top: 8px;
  min-height: 36px;
}
</style>
