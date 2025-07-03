<template>
  <div class="prosocial-item-page">
    <div class="page-header">
      <el-icon><Document /></el-icon>
      <span class="title-text">亲社会条目管理</span>
    </div>

    <div class="toolbar">
      <el-button type="primary" icon="Plus" @click="handleAdd">添加条目</el-button>
      <el-input v-model="searchKeyword" placeholder="搜索标题" clearable style="width: 200px" />
      <el-select v-model="selectedCategory" placeholder="全部" clearable style="width: 150px">
        <el-option label="全部" value="" />
        <el-option
            v-for="cat in categories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
        />
      </el-select>
      <el-button @click="resetFilter">重置</el-button>
    </div>

    <el-table :data="filteredItems" stripe border style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="activityTitle" label="分类" />
      <el-table-column prop="startDate" label="开始时间" />
      <el-table-column prop="endDate" label="结束时间" />
      <el-table-column prop="number" label="总人数" />
      <el-table-column prop="qrCode" label="二维码" />
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row.itemId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="dialogVisible" :title="isEditMode ? '编辑活动项' : '添加活动项'" width="900px">
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="所属分类" prop="activityId">
        <el-select v-model="formData.activityId" placeholder="请选择分类">
          <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <Toolbar :editor="editorRef" style="border-bottom: 1px solid #ccc;" />
        <Editor
            v-model="formData.content"
            :defaultConfig="editorConfig"
            style="height: 120px; border: 1px solid #ccc;width: 100%;"
            @onCreated="editor => editorRef = editor"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startDate">
        <el-date-picker v-model="formData.startDate" type="datetime" placeholder="选择时间" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endDate">
        <el-date-picker v-model="formData.endDate" type="datetime" placeholder="选择时间" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="二维码" prop="qrCode">
        <el-upload
            class="qr-uploader"
            action=""
            :http-request="uploadToMinioForQr"
            :show-file-list="false"
            :before-upload="beforeUpload"
        >
          <img v-if="formData.qrCode" :src="formData.qrCode" class="qr-preview" alt="二维码" />
          <el-tooltip v-else content="点击上传二维码" placement="top">
            <el-icon class="qr-upload-icon"><Plus /></el-icon>
          </el-tooltip>
        </el-upload>
      </el-form-item>
      <el-form-item label="总人数" prop="number">
        <el-input-number v-model="formData.number" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Document, Plus } from '@element-plus/icons-vue'
import { deleteActivityItem, loadAllActivityItems, addActivityItem, modifyActivityItem } from '@/api/prosocail_behavior/item.ts'
import { loadActivityType } from '@/api/prosocail_behavior/activity.ts'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import axiosInstance from '@/plugins/axios.ts'

const itemList = ref([])
const searchKeyword = ref('')
const selectedCategory = ref('')
const categories = ref([])

const fetchActivityData = async () => {
  const data = await loadActivityType()
  categories.value = data.data?.map(item => ({ id: item.id, name: item.title })) || []
}

const fetchData = async () => {
  itemList.value = await loadAllActivityItems()
}

const filteredItems = computed(() => {
  return itemList.value.filter(item => {
    const matchKeyword = searchKeyword.value ? item.title.includes(searchKeyword.value) : true
    const matchCategory = selectedCategory.value ? item.activityTitle === categories.value.find(c => c.id === selectedCategory.value)?.name : true
    return matchKeyword && matchCategory
  })
})

const dialogVisible = ref(false)
const isEditMode = ref(false)
const currentEditId = ref(null)
const editorRef = shallowRef()

const formData = ref({
  activityId: null,
  title: '',
  content: '',
  startDate: '',
  endDate: '',
  qrCode: '',
  number: null
})

const formRef = ref()
const rules = {
  activityId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  qrCode: [{ required: true, message: '请上传二维码', trigger: 'blur' }],
  number: [{ required: true, type: 'number', message: '请输入总人数', trigger: 'blur' }]
}

const handleAdd = () => {
  isEditMode.value = false
  dialogVisible.value = true
  formData.value = {
    activityId: null,
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    qrCode: '',
    number: null
  }
}

const handleEdit = (item) => {
  isEditMode.value = true
  dialogVisible.value = true
  currentEditId.value = item.itemId
  formData.value = {
    activityId: categories.value.find(c => c.name === item.activityTitle)?.id || null,
    title: item.title,
    content: item.content,
    startDate: item.startDate,
    endDate: item.endDate,
    qrCode: item.qrCode,
    number: item.number
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    if (!valid) return ElMessage.warning('请完整填写表单')

    try {
      if (isEditMode.value && currentEditId.value != null) {
        await modifyActivityItem(formData.value.activityId!, {
          itemId: currentEditId.value,
          title: formData.value.title,
          content: formData.value.content,
          startDate: new Date(formData.value.startDate).toISOString(),
          endDate: new Date(formData.value.endDate).toISOString(),
          qrCode: formData.value.qrCode,
          number: formData.value.number!
        })
        ElMessage.success('修改成功')
      } else {
        await addActivityItem(formData.value.activityId!, {
          title: formData.value.title,
          content: formData.value.content,
          startDate: new Date(formData.value.startDate).toISOString(),
          endDate: new Date(formData.value.endDate).toISOString(),
          publishDate: new Date().toISOString(),
          qrCode: formData.value.qrCode,
          number: formData.value.number!
        })
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
      await fetchData()
    } catch (e) {
      ElMessage.error('操作失败')
    }
  })
}

const beforeUpload = (file) => {
  const isImg = file.type.startsWith('image/')
  if (!isImg) ElMessage.warning('只能上传图片')
  return isImg
}

const uploadToMinioForQr = async ({ file }) => {
  const formDataToUpload = new FormData()
  formDataToUpload.append('file', file)
  try {
    const { data } = await axiosInstance.post('/activity/upload', formDataToUpload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (data === '500') return ElMessage.error('二维码上传失败')
    formData.value.qrCode = data
    ElMessage.success('二维码上传成功')
  } catch {
    ElMessage.error('二维码上传失败')
  }
}

const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      async customUpload(file, insertFn) {
        const formData = new FormData()
        formData.append('file', file)
        try {
          const { data } = await axiosInstance.post('/activity/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          if (data === '500') return ElMessage.error('上传失败')
          insertFn(data)
          ElMessage.success('图片上传成功')
        } catch {
          ElMessage.error('上传失败')
        }
      }
    }
  }
}

const handleDelete = async (id) => {
  ElMessageBox.confirm('确认删除该条目？', '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteActivityItem(id)
    itemList.value = itemList.value.filter(item => item.itemId !== id)
    ElMessage.success('删除成功')
  })
}

const resetFilter = () => {
  searchKeyword.value = ''
  selectedCategory.value = ''
}

onMounted(() => {
  fetchData()
  fetchActivityData()
})
</script>

<style scoped lang="scss">
.prosocial-item-page {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;

  .page-header {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;

    .el-icon {
      margin-right: 8px;
      color: #409EFF;
    }
  }

  .toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
}
.qr-uploader {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.qr-preview {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.qr-upload-icon {
  font-size: 28px;
  color: #909399;
}
</style>