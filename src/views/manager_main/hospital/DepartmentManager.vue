<template>
  <div class="page">
    <div class="page-header">
      <el-icon class="book-icon"><Collection /></el-icon>
      <span class="title">科室管理</span>
    </div>

    <el-button type="primary" @click="openAddDialog">添加科室</el-button>
    <el-input
        v-model="queryParams.departmentName"
        placeholder="搜索科室名称"
        style="width: 200px; margin: 0 10px"
        clearable
    />
    <el-button type="primary" @click="resetFilters">重置</el-button>

    <el-table v-loading="loading" height="500" :data="departments" border style="margin-top: 20px">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="departmentName" label="科室名称" />
      <el-table-column prop="departmentType" label="类型" :formatter="formatType" />
      <el-table-column prop="departmentIntroduction" label="介绍" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="openEditDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteDepartment(row.id, row.departmentName)">删除</el-button>
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

    <el-dialog :title="isEditing ? '编辑科室' : '添加科室'" v-model="dialogVisible" width="600px">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="100px">
        <el-form-item label="科室名称" prop="departmentName">
          <el-input v-model="form.departmentName" />
        </el-form-item>
        <el-form-item label="科室类型" prop="departmentType">
          <el-select v-model="form.departmentType" placeholder="请选择类型">
            <el-option v-for="(label, index) in departmentTypeOptions" :key="index" :label="label" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="介绍" prop="departmentIntroduction">
          <el-input type="textarea" v-model="form.departmentIntroduction" />
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
import { Collection } from '@element-plus/icons-vue'
import {
  getDepartmentList,
  addDepartment,
  updateDepartment,
  getDepartmentDetail,
  deleteDepartment
} from '@/api/life/department_api.ts'
import type { Departments } from '@/api/life/department_type.ts'

const departments = ref<Departments[]>([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const isEditing = ref(false)
const currentId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const departmentTypeOptions = ['内科', '外科', '儿科', '神经科', '口腔科', '眼科', '妇产科', '心血管内科', '呼吸内科', '消化内科']

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  departmentId: 0,
  departmentName: ''
})

const form = ref<Departments>({
  id: 0,
  departmentName: '',
  departmentType: 0,
  departmentIntroduction: ''
})

const rules = {
  departmentName: [{ required: true, message: '请输入科室名称', trigger: 'blur' }],
  departmentType: [{ required: true, message: '请选择类型', trigger: 'change' }]
}

const fetchDepartments = async () => {
  loading.value = true
  try {
    const res = await getDepartmentList(queryParams.pageNum, queryParams.pageSize, queryParams.departmentId, queryParams.departmentName)
    departments.value = res.data.departmentsList
    total.value = res.data.totalCount
  } catch {
    ElMessage.error('获取失败')
  }
  loading.value = false
}
fetchDepartments()

watch(() => ({ ...queryParams }), fetchDepartments, { deep: true })

const openAddDialog = () => {
  isEditing.value = false
  form.value = { id: 0, departmentName: '', departmentType: 0, departmentIntroduction: '' }
  dialogVisible.value = true
}

const openEditDialog = async (row: Departments) => {
  isEditing.value = true
  currentId.value = row.id
  const res = await getDepartmentDetail(row.id!)
  form.value = res.data
  dialogVisible.value = true
}

const submitForm = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    try {
      if (isEditing.value) await updateDepartment(form.value)
      else await addDepartment(form.value)
      ElMessage.success('操作成功')
      dialogVisible.value = false
      await fetchDepartments()
    } catch {
      ElMessage.error('提交失败')
    }
  })
}

const deleteDepartment = (id: number, name: string) => {
  ElMessageBox.confirm(`是否删除科室【${name}】？`, '提示', { type: 'warning' })
      .then(async () => {
        await deleteDepartment(id)
        ElMessage.success('删除成功')
        await fetchDepartments()
      })
      .catch(() => {})
}

const resetFilters = () => {
  queryParams.departmentName = ''
  queryParams.pageNum = 1
}

const formatType = (_: any, __: any, value: number) => departmentTypeOptions[value] ?? '未知'
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
