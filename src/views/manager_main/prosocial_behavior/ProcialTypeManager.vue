<template>
  <div class="activity-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <el-icon><Calendar /></el-icon>
      <span class="title-text">活动管理</span>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" icon="Plus" @click="openAddDialog">添加活动</el-button>

      <el-input v-model="searchKeyword" placeholder="搜索标题..." class="toolbar-input" clearable @input="handleSearch">
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-select v-model="categoryFilter" placeholder="全部" class="toolbar-select" clearable @change="handleSearch">
        <el-option label="全部" value="" />
        <el-option label="政府类" value="政府" />
        <el-option label="公益类" value="公益" />
        <el-option label="社区类" value="社区" />
      </el-select>
      <el-button @click="resetFilters">重置</el-button>
    </div>

    <!-- 表格区域 -->
    <el-table
        class="activity-table"
        :data="filteredList"
        height="540"
        v-loading="loading"
        border
        size="large"
        empty-text="暂无活动数据"
    >
      <el-table-column prop="title" label="标题" width="160" />
      <el-table-column prop="sponsor" label="主办方" width="160" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="introduce" label="简介" />
      <el-table-column prop="content" label="内容" />
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row.id,row.logo)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑弹窗（合并） -->
    <el-dialog
        v-model="dialogVisible"
        :title="isEditMode ? '编辑活动' : '添加活动'"
        width="600px"
    >
      <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          label-width="80px"
      >
        <el-form-item label="Logo" prop="logo">
          <el-upload
              class="logo-uploader"
              action=""
              :http-request="uploadToMinio"
              :show-file-list="false"
              :before-upload="beforeUpload"
          >
            <img v-if="form.logo" :src="form.logo" class="logo-preview" alt="" />
            <el-tooltip v-else content="点击上传 Logo" placement="top">
              <el-icon class="logo-upload-icon"><Plus /></el-icon>
            </el-tooltip>
          </el-upload>
        </el-form-item>



        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>

        <el-form-item label="主办方" prop="sponsor">
          <el-input v-model="form.sponsor" />
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" />
        </el-form-item>

        <el-form-item label="简介" prop="introduce">
          <el-input type="textarea" v-model="form.introduce" />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="form.content" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ isEditMode ? '保存' : '添加' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { loadActivityType, addActivityType, deleteActivityType, updateActivityType } from '@/api/prosocail_behavior/activity.ts'
import { Search, Calendar, Plus } from '@element-plus/icons-vue'
import axiosInstance from "@/plugins/axios.ts";

const activityList = ref<ActivitiesDTO[]>([])
const filteredList = ref<ActivitiesDTO[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const categoryFilter = ref('')


const addForm = reactive<AddActivityTypeCommand>({
  logo: '', title: '', introduce: '', content: '', sponsor: '', address: ''
})



onMounted(() => fetchActivityList())

const fetchActivityList = async () => {
  loading.value = true
  try {
    const res = await loadActivityType()
    activityList.value = res.data
    filteredList.value = res.data
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  const keyword = searchKeyword.value.toLowerCase()
  filteredList.value = activityList.value.filter(item =>
      item.title.toLowerCase().includes(keyword) &&
      (!categoryFilter.value || item.sponsor.includes(categoryFilter.value))
  )
}

const resetFilters = () => {
  searchKeyword.value = ''
  categoryFilter.value = ''
  filteredList.value = [...activityList.value]
}


const dialogVisible = ref(false)
const isEditMode = ref(false)
const formRef = ref<FormInstance | null>(null)

const form = reactive<AddActivityTypeCommand & { id?: number }>({
  logo: '',
  title: '',
  sponsor: '',
  address: '',
  introduce: '',
  content: ''
})

// 校验规则
const rules = {
  logo: [{ required: true, message: '请上传 Logo', trigger: 'blur' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  sponsor: [{ required: true, message: '请输入主办方', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  introduce: [{ required: true, message: '请输入简介', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

// 打开添加对话框
const openAddDialog = () => {
  isEditMode.value = false
  dialogVisible.value = true
  formRef.value?.resetFields()
  Object.assign(form, {
    logo: '',
    title: '',
    sponsor: '',
    address: '',
    introduce: '',
    content: ''
  })
}


// 打开编辑对话框
const handleEdit = (row: ActivitiesDTO) => {
  isEditMode.value = true
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

// 提交处理（添加或修改）
const handleSubmit = async () => {
  await formRef.value?.validate(async (valid) => {
    if (!valid) return
    try {
      if (isEditMode.value && form.id != null) {
        const { id, ...command } = form

        await updateActivityType(id, command)
        ElMessage.success('修改成功')
      } else {
        await addActivityType(form)
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
      await fetchActivityList()
    } catch {
      ElMessage.error(isEditMode.value ? '修改失败' : '添加失败')
    }
  })
}

const beforeUpload = (file: File) => {
  const isImg = file.type.startsWith('image/')
  if (!isImg) ElMessage.warning('只能上传图片')
  return isImg
}

const uploadToMinio = async ({ file }: { file: File }) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await axiosInstance.post('/activity/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    console.log("上传图片==>",data)
    if(data==='500'){
      ElMessage.error('上传失败')
    }else{
      form.logo = data
      console.log("form===>",form)
      ElMessage.success('上传成功')
    }

  } catch (err) {
    ElMessage.error('上传失败')
  }
}

const handleDelete = async (id: number,logo:string) => {
  try {
    await ElMessageBox.confirm('确定删除此活动？', '警告', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteActivityType(id,logo)
    ElMessage.success(`删除成功:${id}`)
    await fetchActivityList()
  } catch {}
}

</script>

<style scoped lang="scss">
.activity-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 78vh;
}

.page-header {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;

  .title-text {
    color: #303133;
  }
}
.logo-uploader {
  width: 120px;
  height: 120px;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .logo-upload-icon {
    font-size: 32px;
    color: #909399;
  }

  .logo-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  .toolbar-input {
    width: 200px;
  }

  .toolbar-select {
    width: 120px;
  }

  .el-button {
    height: 36px;
  }
}

.activity-table {
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
</style>
