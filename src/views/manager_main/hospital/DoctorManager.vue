<template>
  <div class="page">
    <div class="page-header">
      <el-icon class="book-icon"><User /></el-icon>
      <span class="title">医生管理</span>
    </div>

    <el-button type="primary" @click="openAddDialog">添加医生</el-button>
    <el-input
        v-model="queryParams.doctorName"
        placeholder="搜索医生姓名"
        style="width: 200px; margin: 0 10px"
        clearable
    />
    <el-select
        v-model="queryParams.doctorTitle"
        placeholder="职称"
        style="width: 150px; margin-right: 10px"
        clearable
    >
      <el-option label="全部职称" :value="-1" />
      <el-option label="普通医生" :value="0" />
      <el-option label="副主任" :value="1" />
      <el-option label="主任" :value="2" />
    </el-select>

    <el-select
        v-model="queryParams.departmentId"
        placeholder="科室"
        style="width: 180px; margin-right: 10px"
        clearable
    >
      <el-option label="全部科室" :value="0" />
      <el-option
          v-for="dept in departmentOptions"
          :key="dept.id"
          :label="dept.departmentName"
          :value="dept.id"
      />
    </el-select>

    <el-button type="primary" @click="resetFilters">重置</el-button>

    <el-table v-loading="loading" height="500" :data="doctors" border style="margin-top: 20px">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="doctorName" label="姓名" />
      <el-table-column prop="doctorTitle" label="职称" :formatter="formatTitle" />
      <el-table-column prop="doctorSpecialty" label="专长" />
      <el-table-column prop="departmentName" label="所属科室" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="openEditDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteDoctor(row.id, row.doctorName)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        layout="total, prev, pager, next, sizes"
        :page-sizes="[5, 10, 20]"
        style="margin-top: 20px; text-align: right"
    />

    <el-dialog :title="isEditing ? '编辑医生' : '添加医生'" v-model="dialogVisible" width="600px">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="100px">
        <el-form-item label="姓名" prop="doctorName">
          <el-input v-model="form.doctorName" />
        </el-form-item>
        <el-form-item label="职称" prop="doctorTitle">
          <el-select v-model="form.doctorTitle" placeholder="请选择职称">
            <el-option label="普通医生" :value="0" />
            <el-option label="副主任" :value="1" />
            <el-option label="主任" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="专长" prop="doctorSpecialty">
          <el-input v-model="form.doctorSpecialty" />
        </el-form-item>
        <el-form-item label="所属科室" prop="departmentId">
          <el-select v-model="form.departmentId" placeholder="请选择科室">
            <el-option
                v-for="dept in departmentOptions"
                :key="dept.id"
                :label="dept.departmentName"
                :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="头像" prop="image">
          <el-upload
              class="upload-demo"
              action=""
              :before-upload="beforeUpload"
              :http-request="uploadImage"
              :show-file-list="false"
          >
            <el-button type="primary">上传头像</el-button>
          </el-upload>
          <div v-if="form.image" style="margin-top: 10px;">
            <img :src="form.image" alt="头像" style="width: 100px; border: 1px solid #eee;" />
          </div>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import {
  getDoctorList,
  addDoctor,
  updateDoctor,
  getDoctorDetail,
  deleteDoctor as deleteDoctorApi
} from '@/api/life/doctor_api.ts'
import { getDepartmentList } from '@/api/life/department_api.ts'
import type { DoctorExtend, Doctor } from '@/api/life/doctor_type.ts'
import axiosInstance from '@/plugins/axios'
import type {Departments} from "@/api/life/department_type.ts";

const doctors = ref<DoctorExtend[]>([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const isEditing = ref(false)
const currentId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const allDoctors = ref<DoctorExtend[]>([]) // 全量数据

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  doctorName: '',
  doctorTitle: -1,     // -1 表示全部
  departmentId: 0      // 0 表示全部
})


const form = ref<Doctor>({
  id: 0,
  doctorName: '',
  doctorTitle: 0,
  doctorSpecialty: '',
  departmentId: 0,
  image: '',
  phone: '',
  email: ''
})

const rules = {
  doctorName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  doctorTitle: [{ required: true, message: '请选择职称', trigger: 'change' }],
  departmentId: [{ required: true, message: '请选择科室', trigger: 'change' }]
}

const departmentOptions = ref<Departments[]>([])

const fetchDoctors = async () => {
  loading.value = true
  try {
    const res = await getDoctorList(1, 1000, 0, '') // 一次性拉取所有数据
    allDoctors.value = res.data.doctorsList
    filterAndPaginateDoctors()
  } catch {
    ElMessage.error('获取失败')
  }
  loading.value = false
}
const filterAndPaginateDoctors = () => {
  const filtered = allDoctors.value.filter(doc => {
    const matchName =
        !queryParams.doctorName || doc.doctorName.includes(queryParams.doctorName)
    const matchTitle =
        queryParams.doctorTitle === -1 || doc.doctorTitle === queryParams.doctorTitle
    const matchDept =
        queryParams.departmentId === 0 || doc.departmentId === queryParams.departmentId
    return matchName && matchTitle && matchDept
  })

  total.value = filtered.length
  const start = (queryParams.pageNum - 1) * queryParams.pageSize
  const end = start + queryParams.pageSize
  doctors.value = filtered.slice(start, end)
}

const fetchDepartments = async () => {
  const res = await getDepartmentList(1, 100, 0, '')
  departmentOptions.value = res.data.departmentsList
}

fetchDoctors()
fetchDepartments()

// 筛选项变化，重置到第 1 页
watch(
    () => [queryParams.doctorName, queryParams.doctorTitle, queryParams.departmentId],
    () => {
      queryParams.pageNum = 1
      filterAndPaginateDoctors()
    }
)

// 分页变化时，仅重新分页
watch(
    () => [queryParams.pageNum, queryParams.pageSize],
    () => {
      filterAndPaginateDoctors()
    }
)



const openAddDialog = () => {
  isEditing.value = false
  form.value = {
    id: 0,
    doctorName: '',
    doctorTitle: 0,
    doctorSpecialty: '',
    departmentId: 0,
    image: '',
    phone: '',
    email: ''
  }
  dialogVisible.value = true
}

const openEditDialog = async (row: DoctorExtend) => {
  isEditing.value = true
  currentId.value = row.id
  const res = await getDoctorDetail(row.id!)
  form.value = res.data
  dialogVisible.value = true
}

const submitForm = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    try {
      if (isEditing.value) await updateDoctor(form.value)
      else await addDoctor(form.value)
      ElMessage.success('操作成功')
      dialogVisible.value = false
      await fetchDoctors()
    } catch {
      ElMessage.error('提交失败')
    }
  })
}

const deleteDoctor = (id: number, name: string) => {
  ElMessageBox.confirm(`是否删除医生【${name}】？`, '提示', { type: 'warning' })
      .then(async () => {
        await deleteDoctorApi(id)
        ElMessage.success('删除成功')
        await fetchDoctors()
      })
      .catch(() => {})
}

const resetFilters = () => {
  queryParams.doctorName = ''
  queryParams.doctorTitle = -1
  queryParams.departmentId = 0
  queryParams.pageNum = 1
}

const formatTitle = (_: any, __: any, value: number) => ['普通医生', '副主任', '主任'][value] ?? '未知'

// 上传图片（头像）
const beforeUpload = (file: File) => {
  const isImg = file.type.startsWith('image/')
  if (!isImg) ElMessage.warning('只能上传图片')
  return isImg
}

const uploadImage = async ({ file }: { file: File }) => {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const { data } = await axiosInstance.post('/activity/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (data === '500') return ElMessage.error('图片上传失败')
    form.value.image = data
    ElMessage.success('上传成功')
  } catch {
    ElMessage.error('上传失败')
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 10px;
}

.book-icon {
  font-size: 26px;
  color: #409EFF;
  margin-right: 10px;
}
</style>
