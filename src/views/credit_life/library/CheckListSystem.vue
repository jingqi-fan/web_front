<template>
  <el-container class="exam-page">
    <!-- 顶部标题栏 -->
    <el-header class="header-bar">
      <el-button type="text" :icon="Back" @click="goBack" />
      <div class="title">检查单开具系统</div>
      <div class="doctor-info">{{ doctor_name }}   |  {{ doctor_dept }}</div>
    </el-header>

    <el-main class="exam-content">
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-select v-model="selectedDept" placeholder="选择科室" style="width: 200px">
          <el-option
              v-for="item in deptOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-input
            v-model="searchKeyword"
            placeholder="搜索检查项名称"
            prefix-icon="Search"
            style="width: 280px; margin-left: 20px"
            clearable
        />
      </div>

      <!-- 内容区域 -->
      <el-row :gutter="20">
        <!-- 左侧：可选检查项 -->
        <el-col :span="16" style="height: 600px;overflow-y: auto">
          <el-row :gutter="16">
            <el-col :span="8" v-for="item in filteredList" :key="item.id">
              <el-card class="exam-card">
                <div class="card-header">
                  <span class="item-title">{{ item.itemName }}</span>
                  <el-button type="success" size="small" @click="addItem(item)">添加</el-button>
                </div>
                <div class="card-meta">
                  <el-tag type="info" size="small">{{ getDeptLabel(item.departmentId) }}</el-tag>
                  <span class="price">￥{{ item.itemPrice }}</span>
                </div>
                <div class="card-desc">{{ item.itemDescription }}</div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>

        <!-- 右侧：已选检查项 -->
        <el-col :span="8">
          <el-card class="selected-list">
            <div class="list-title">已选检查项</div>
            <el-scrollbar height="360px">
              <div v-for="item in selectedItems" :key="item.id" class="selected-item">
                <span>{{ item.itemName }} - ￥{{ item.itemPrice }}</span>
                <el-button type="danger" size="small" @click="removeItem(item.id)">移除</el-button>
              </div>
            </el-scrollbar>
            <div class="total-price">总金额：￥{{ totalPrice }}</div>
            <el-button v-if="!showPrescription" type="success" style="width: 100%; margin-top: 10px" @click="submitItems">
              生成检查单
            </el-button>
            <el-button
                v-if="showPrescription"
                type="primary"
                @click="goToPrescription"
                style="width: 100%; margin-top: 10px"
            >前往开具药品</el-button>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {Back} from '@element-plus/icons-vue'
import {getDoctorDetail, getExamList, saveExamList} from "@/api/life/hospital_api.ts";
import {useDoctorIdStore} from "@/stores/useDoctorIdStore.ts";
import type {ExaminationInfoRes, ExaminationItems, ExamSaveReq} from "@/api/life/hospital_type.ts";
import {useRoute} from 'vue-router'
import {ElLoading, ElMessage} from "element-plus";
import router from "@/router";

const goBack = () => {
  router.push('/doctor/login')
}

const deptOptions = [
  { label: '内科', value: 0 },
  { label: '外科', value: 1 },
  { label: '儿科', value: 2 },
  { label: '神经科', value: 3 },
  { label: '口腔科', value: 4 },
  { label: '眼科', value: 5 },
  { label: '妇产科', value: 6 },
  { label: '心血管内科', value: 7 },
  { label: '呼吸内科', value: 8 },
  { label: '消化内科', value: 9 }
]

const searchKeyword = ref('')
const selectedDept = ref<number | null>(null)
const showPrescription = ref(false)

const doctorIdStore=useDoctorIdStore()
const doctorId=doctorIdStore.doctorId


const loadDoctorInfo=async ()=>{
  return await getDoctorDetail(doctorId)
}
const doctor_name=ref()
const doctor_dept=ref()
const getDoctorNameAndDept=async ()=>{
  const doctor=await loadDoctorInfo()
  doctor_name.value=doctor.doctorName
  doctor_dept.value=getDeptLabel(doctor.departmentId)
}
getDoctorNameAndDept()

const allExamItems = ref<ExaminationInfoRes[]>([])

const selectedItems = ref<ExaminationItems[]>([])

const route = useRoute()
const userId = route.params.id

const loadCheckExaminationInfoList=async ()=>{
  const loading=ElLoading.service({text:"正在加载检查项目数据····"})
  const doctor=await loadDoctorInfo()
  const res=await getExamList(doctor.departmentId,"",userId)
  allExamItems.value=res.examinationItemsList
  loading.close()
}
loadCheckExaminationInfoList()

const getDeptLabel = (deptId: number) => {
  const match = deptOptions.find(item => item.value === deptId)
  return match ? match.label : '未知科室'
}

const filteredList = computed(() => {
  return allExamItems.value.filter(item => {
    const matchesDept = selectedDept.value === null || item.departmentId === selectedDept.value
    const matchesKeyword = item.itemName.includes(searchKeyword.value)
    return matchesDept && matchesKeyword
  })
})


const checkItems=ref<number[]>([])
const addItem =async  (item: ExaminationItems) => {
  if (!selectedItems.value.find(i => i.id === item.id)) {
    selectedItems.value.push(item)
    checkItems.value.push(item.id)
    console.log("添加一项")
    console.log(checkItems.value)
  }
}

const removeItem = (id: number) => {
  selectedItems.value = selectedItems.value.filter(i => i.id !== id)
  checkItems.value = checkItems.value.filter(itemId => itemId !== id)
  console.log("移除一项")
  console.log(checkItems.value)
}


const submitItems =async () => {
  if (selectedItems.value.length === 0) return
  showPrescription.value = true

  const res=await saveExamList({patientId:userId,itemIdList:checkItems.value},doctorId)
  ElMessage.success("生成检查单成功")
  console.log('生成检查单请求结果：',res)
}
const goToPrescription=()=>{
  router.push(`/doctor/drug_list/${userId}`)
}


const totalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.itemPrice, 0)
})
</script>

<style scoped lang="scss">
.exam-page {
  height: 98vh;
  display: flex;
  flex-direction: column;
}

.header-bar {
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
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

.exam-content {
  background: #f5f7fa;
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.exam-card {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #fff;

  .card-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 8px;
    .item-title {
      font-size: 16px;
    }
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
    .price {
      color: #f56c6c;
      font-weight: bold;
    }
  }

  .card-desc {
    font-size: 13px;
    color: #666;
  }
}

.selected-list {
  .list-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .selected-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 4px 0;
    font-size: 14px;
  }

  .total-price {
    margin-top: 10px;
    font-weight: bold;
    text-align: right;
  }
}
</style>
