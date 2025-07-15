<template>
  <el-container class="prescription-page">
    <!-- 顶部标题栏 -->
    <el-header class="header-bar">
      <el-button type="text" :icon="Back" @click="goBack" />
      <div class="title">处方开具系统</div>
      <div class="doctor-info">{{ doctor_name }} | {{ doctor_dept }}</div>
    </el-header>

    <el-main class="prescription-content">
      <el-row :gutter="20">
        <!-- 左侧药品列表 -->
        <el-col :span="15">
          <div class="filter-bar">
            <el-input :icon="Search" v-model="searchKeyword" placeholder="搜索药品名称" prefix-icon="Search" style="width: 260px" clearable />
          </div>

          <el-table :data="filteredDrugs" height="650" style="width: 100%; margin-top: 10px">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="drugName" label="药品名称" width="240" />
            <el-table-column prop="drugSpecification" label="规格" width="180" />
            <el-table-column prop="drugPrice" label="单价" width="120" />
            <el-table-column prop="drugStock" label="库存" width="120" />
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button size="small" type="primary" @click="addDrug(row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

        <!-- 右侧处方清单 -->
        <el-col :span="9">
          <el-card class="prescription-list">
            <div class="list-title">处方清单</div>
            <el-scrollbar height="400px">
              <div v-for="item in prescription" :key="item.id" class="prescription-item">
                <div class="top-row">
                  <span class="item-name">{{ item.drugName }}</span>
                  <el-button type="danger" size="small" @click="removeDrug(item.id)">移除</el-button>
                </div>
                <div class="spec">{{ item.drugSpecification }}</div>
                <div class="middle-row">
                  <el-input-number v-model="item.dosage" :min="1" size="small" />
                </div>
                <div class="freq-row">
                  <el-select v-model="item.usage1" size="small" style="width: 100%">
                    <el-option label="每日一次" value="每日一次" />
                    <el-option label="每日两次" value="每日两次" />
                    <el-option label="每日三次" value="每日三次" />
                  </el-select>
                </div>
              </div>
            </el-scrollbar>

            <div class="bottom-bar">
              <div>已选药品数量：{{ prescription.length }}</div>
              <div class="bottom-buttons">
                <el-button type="warning" @click="clearAll">清空</el-button>
                <el-button type="success" @click="submitPrescription">生成处方单</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <!-- 新增诊断填写弹窗 -->
  <el-dialog v-model="diagnosisDialogVisible" title="填写诊断结果" width="500px">
    <el-form :model="diagnosisForm" :rules="diagnosisRules" ref="diagnosisFormRef" label-width="100px">
      <el-form-item label="诊断结果" prop="diagnosis">
        <el-input
            type="textarea"
            v-model="diagnosisForm.diagnosis"
            placeholder="请输入诊断信息"
            maxlength="200"
            show-word-limit
            rows="4"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="diagnosisDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmitDiagnosis">提交</el-button>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {Back, Search} from '@element-plus/icons-vue'
import {useRoute} from "vue-router";
import {finishCheck, getDoctorDetail, getDrugs, saveDiagnosis, saveDrugs} from "@/api/life/hospital_api.ts";
import type {DrugInfoRes, DrugsUsage, PrescriptionDrugs} from "@/api/life/hospital_type.ts";
import {useDoctorIdStore} from "@/stores/useDoctorIdStore.ts";
import {ElLoading, ElMessage} from "element-plus";
import router from "@/router";

const goBack = () => {
  router.back()
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
const getDeptLabel = (deptId: number) => {
  const match = deptOptions.find(item => item.value === deptId)
  return match ? match.label : '未知科室'
}

const route = useRoute()
const userId = route.params.id



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

const searchKeyword = ref('')
const drugList = ref<PrescriptionDrugs[]>([])

const prescription = ref<DrugsUsage[]>([])

const loadAllDrugForPatient=async ()=>{
  const loading=ElLoading.service({text:"正在加载药品数据····"})
  const res:DrugInfoRes=await getDrugs("",userId)
  drugList.value=res.prescriptionDrugsList
  loading.close()
}
loadAllDrugForPatient()


const filteredDrugs = computed(() => {
  return drugList.value.filter(item => {
    return item.drugName.includes(searchKeyword.value)
  })
})

interface saveDrugDTO{
  drugId:number,
  dosage:number,
  usage1:string
}
const drugDTO=ref<saveDrugDTO[]>([])

const addDrug = (item: PrescriptionDrugs) => {
  if (!prescription.value.find(d => d.id === item.id)) {
    prescription.value.push({ ...item,drugId:item.id, dosage: 1, usage1: '每日三次' })

  }

}

const removeDrug = (id: number) => {
  prescription.value = prescription.value.filter(d => d.id !== id)
  drugDTO.value = drugDTO.value.filter(d => d.drugId !== id)

}
const generateDrugDTO = () => {
  return prescription.value.map(p => ({
    drugId: p.drugId,
    dosage: p.dosage,
    usage1: p.usage1
  }))
}


const clearAll = () => {
  prescription.value = []
}

const diagnosisDialogVisible = ref(false)

const diagnosisForm = ref({
  diagnosis: ''
})

const diagnosisRules = {
  diagnosis: [{ required: true, message: '请输入诊断结果', trigger: 'blur' }]
}

const diagnosisFormRef = ref()

// 点击“生成处方单” => 弹出填写诊断弹窗
const submitPrescription = () => {
  if (prescription.value.length === 0) {
    ElMessage.warning('请先添加药品')
    return
  }
  diagnosisDialogVisible.value = true
}

// 真正的提交逻辑
const handleSubmitDiagnosis = async () => {
  if (!diagnosisFormRef.value) return
  await diagnosisFormRef.value.validate(async (valid: boolean) => {

    console.log("提交逻辑")

    console.log(userId)
    console.log(diagnosisForm.value.diagnosis)

    if (valid) {
      const dto = generateDrugDTO()

      console.log(dto)
      const res1 = await saveDrugs({
        patientId: userId,
        drugsUsageList: dto
      },doctorId)




      ElMessage.success(res1 ? res1 : '处方单生成成功')
      const res2=await saveDiagnosis(userId,diagnosisForm.value.diagnosis)
      ElMessage.success(res2?res2:'诊断结果保存成功')
      diagnosisDialogVisible.value = false
      const res3=await finishCheck(userId,doctorId)
      ElMessage.success(res3?res3:'患者检查结果保存完成')
      await router.push('/doctor/check')
    }
  })
}

</script>

<style scoped lang="scss">
.prescription-page {
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
  }
  .doctor-info {
    font-size: 14px;
    color: #666;
  }
}

.prescription-content {
  background: #f5f7fa;
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.prescription-list {
  padding: 10px;

  .list-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .prescription-item {
    background: #fefefe;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 10px;

    .top-row {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
    }

    .spec {
      font-size: 12px;
      color: #666;
      margin: 4px 0;
    }

    .middle-row,
    .freq-row {
      display: flex;
      justify-content: space-between;
      margin-top: 4px;
    }
  }

  .bottom-bar {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .bottom-buttons {
      display: flex;
      gap: 10px;
    }
  }
}
</style>