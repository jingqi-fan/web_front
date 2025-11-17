<template>
  <div class="news-admin-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <el-icon><Document /></el-icon>
      <span class="title-text">新闻管理</span>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="success" :icon="Plus" @click="openAddDialog">添加新闻</el-button>
      <el-input v-model="searchTitle" placeholder="搜索标题" clearable style="width: 200px" />
      <el-select
          v-model="searchAuthor"
          placeholder="选择作者"
          clearable
          style="width: 180px; margin-left: 10px;"
      >
        <el-option
            v-for="author in authorOptions"
            :key="author"
            :label="author"
            :value="author"
        />
      </el-select>

      <el-select
          v-model="searchCategory"
          placeholder="选择分类"
          clearable
          style="width: 180px; margin-left: 10px;"
      >
        <el-option
            v-for="category in categoryOptions"
            :key="category.value"
            :label="category.label"
            :value="category.value"
        />
      </el-select>
      <el-button @click="resetFilter">重置</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="filteredNewsList" height="560" stripe border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="title" label="标题" min-width="180" />
      <el-table-column prop="author" label="作者" width="100" />
      <el-table-column prop="date" label="发布日期" width="160" />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column prop="tags" label="标签" width="180" />
      <el-table-column prop="views" label="浏览量" width="100" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="success" size="small" @click="openEditDialog(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteNews(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗表单 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑新闻' : '添加新闻'" width="700px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>

        <el-form-item label="作者" prop="author">
          <el-select v-model="form.author" placeholder="选择作者">
            <el-option label="政策研究室" value="政策研究室" />
            <el-option label="科技前沿" value="科技前沿" />
            <el-option label="行业观察" value="行业观察" />
            <el-option label="金融研究" value="金融研究" />
            <el-option label="技术研究" value="技术研究" />
            <el-option label="国际外交" value="国际外交" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>

        <el-form-item label="发布日期" prop="date">
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>

        <el-form-item label="浏览量" prop="views">
          <el-input-number v-model="form.views" :min="0" />
        </el-form-item>

        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="选择分类">
            <el-option label="政策（policy）" value="policy" />
            <el-option label="科技（tech）" value="tech" />
            <el-option label="行业（industry）" value="industry" />
            <el-option label="金融（finance）" value="finance" />
            <el-option label="其他（other）" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <el-select
              v-model="form.tags"
              multiple
              placeholder="选择标签"
              :multiple-limit="5"
              @change="validateField('tags')"
          >
            <el-option
                v-for="tag in tagOptions"
                :key="tag.value"
                :label="tag.label"
                :value="tag.value"
            />
          </el-select>
          <div class="tag-hint">最多选择5个标签</div>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description" rows="3" />
        </el-form-item>

        <el-form-item label="封面图片" prop="image">
          <el-upload
              class="image-uploader"
              action=""
              :http-request="uploadToMinioForImage"
              :before-upload="beforeUpload"
              :show-file-list="false"
          >
            <img v-if="form.image" :src="form.image" class="image-preview"  alt=""/>
            <el-tooltip v-else content="点击上传封面图" placement="top">
              <el-icon class="image-upload-icon"><Plus /></el-icon>
            </el-tooltip>
          </el-upload>
        </el-form-item>

      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="success" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Plus } from '@element-plus/icons-vue'
import { getNewsList, updateNews, addNews, deleteNewsById } from '@/api/news.ts'
import type { News } from '@/entity/news.ts'
import axiosInstance from "@/plugins/axios.ts";

// 响应式数据
const newsList = ref<News[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref()
// 搜索条件
const searchTitle = ref('')
const searchAuthor = ref('')
const searchCategory = ref('')
const filteredNewsList = computed(() => {
  const titleKeyword = searchTitle.value.trim().toLowerCase();
  const authorKeyword = searchAuthor.value.trim().toLowerCase();
  const categoryKeyword = searchCategory.value.trim().toLowerCase();

  return newsList.value.filter(item => {
    const titleMatch = titleKeyword ?
        item.title?.toLowerCase().includes(titleKeyword) : true;
    const authorMatch = authorKeyword ?
        item.author?.toLowerCase().includes(authorKeyword) : true;
    const categoryMatch = categoryKeyword ?
        item.category?.toLowerCase().includes(categoryKeyword) : true;

    return titleMatch && authorMatch && categoryMatch;
  });
});
// 选项数据
const authorOptions = ref([
  '政策研究室', '科技前沿', '行业观察',
  '金融研究', '技术研究', '国际外交', '其他'
])

const categoryOptions = ref([
  { label: '政策（policy）', value: 'policy' },
  { label: '科技（tech）', value: 'tech' },
  { label: '行业（industry）', value: 'industry' },
  { label: '金融（finance）', value: 'finance' },
  { label: '其他（other）', value: 'other' }
])
// 标签选项
const tagOptions = ref([
  { label: '政策解读', value: '政策解读' },
  { label: '数字化转型', value: '数字化转型' },
  { label: 'AI技术', value: 'AI技术' },
  { label: '金融科技', value: '金融科技' },
  { label: '信用体系', value: '信用体系' },
  { label: '行业标准', value: '行业标准' },
  { label: '区块链', value: '区块链' },
  { label: '供应链金融', value: '供应链金融' },
  { label: '数据安全', value: '数据安全' },
  { label: '隐私保护', value: '隐私保护' },
  { label: '云计算', value: '云计算' },
  { label: '成本优化', value: '成本优化' },
  { label: '国际热点', value: '国际热点' },
  { label: '其他', value: '其他' }
])

// 表单数据
const form = ref({
  id: null,
  title: '',
  author: '',
  date: '',
  views: 0,
  category: '',
  tags: [] as string[], // 确保tags是数组类型
  description: '',
  image: ''
})

// 表单验证规则
const rules = reactive({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度应在5-100个字符之间', trigger: 'blur' }
  ],
  author: [
    { required: true, message: '请选择作者', trigger: 'change' }
  ],
  date: [
    { required: true, message: '请选择发布日期', trigger: 'change' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  tags: [
    {
      required: true,
      type: 'array',
      validator: (rule, value, callback) => {
        if (!value || value.length === 0) {
          callback(new Error('请至少选择一个标签'))
        } else if (value.length > 5) {
          callback(new Error('最多选择5个标签'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度应在10-500个字符之间', trigger: 'blur' }
  ],
  image: [
    { required: true, message: '请上传封面图片', trigger: 'change' }
  ]
})

// 获取新闻列表
const fetchNews = async () => {
  try {
    const res = await getNewsList()
    if (res.status === 'SUCCESS') {
      newsList.value = res.data
    } else {
      ElMessage.error('获取新闻失败: ' + (res.message || '未知错误'))
    }
  } catch (error) {
    ElMessage.error('获取新闻失败，请检查网络连接')
  }
}



// 修复标签数据格式转换问题
const openAddDialog = () => {
  isEdit.value = false
  dialogVisible.value = true
  form.value = {
    id: null,
    title: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    views: 100, // 默认浏览量
    category: '',
    tags: [],
    description: '',
    image: ''
  }
}

const openEditDialog = (row: News) => {
  isEdit.value = true
  dialogVisible.value = true
  // 确保tags是数组格式
  form.value = {
    ...row,
    tags: row.tags ? row.tags.split(',') : []
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 先验证表单
    await validateForm()

    submitting.value = true
    const payload = {
      ...form.value,
      tags: form.value.tags.join(','), // 转换数组为字符串
      date: form.value.date.split('T')[0] // 确保日期格式正确
    }

    const action = isEdit.value ? updateNews : addNews
    const res = await action(payload)

    if (res.status === 'SUCCESS') {
      ElMessage.success(isEdit.value ? '新闻更新成功' : '新闻添加成功')
      dialogVisible.value = false
      await fetchNews()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (error) {
    console.error('表单提交错误:', error)
  } finally {
    submitting.value = false
  }
}

// 表单验证方法
const validateForm = () => {
  return new Promise<void>((resolve, reject) => {
    if (!formRef.value) return reject(new Error('表单未初始化'))

    formRef.value.validate((valid: boolean) => {
      if (valid) {
        resolve()
      } else {
        ElMessage.warning('请填写完整的表单信息')
        reject(new Error('表单验证失败'))
      }
    })
  })
}

// 字段级别验证
const validateField = (field: string) => {
  if (formRef.value) {
    formRef.value.validateField(field)
  }
}

// 对话框关闭时重置表单
const handleDialogClosed = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 图片上传相关方法保持不变
const beforeUpload = (file: File) => {
  const isImg = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImg) {
    ElMessage.warning('只能上传图片文件')
    return false
  }
  if (!isLt2M) {
    ElMessage.warning('图片大小不能超过2MB')
    return false
  }
  return true
}

const uploadToMinioForImage = async ({ file }) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await axiosInstance.post('/activity/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (data && data !== '500') {
      form.value.image = data
      validateField('image')
      ElMessage.success('图片上传成功')
    } else {
      ElMessage.error('图片上传失败')
    }
  } catch (err) {
    console.error('图片上传错误:', err)
    ElMessage.error('图片上传失败')
  }
}

// 删除新闻（添加确认对话框）
const deleteNews = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条新闻吗？此操作不可恢复。', '删除确认', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    })

    const res = await deleteNewsById(id)
    if (res.status === 'SUCCESS') {
      ElMessage.success('新闻删除成功')
      await fetchNews()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    // 用户取消删除
  }
}

const resetFilter = () => {
  searchTitle.value = ''
  searchAuthor.value = ''
  searchCategory.value = ''
}

onMounted(fetchNews)
</script>

<style scoped lang="scss">
.news-admin-page {
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

  .tag-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 5px;
  }
}

.image-uploader {
  width: 120px;
  height: 80px;
  border: 1px dashed #dcdfe6;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    border-color: #409EFF;
  }
}
.image-preview {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
.image-upload-icon {
  font-size: 28px;
  color: #909399;
}

/* 对话框样式优化 */
:deep(.el-dialog) {
  border-radius: 10px;
  overflow: hidden;

  .el-dialog__header {
    background: linear-gradient(90deg, #fff, #fff);
    margin: 0;
    padding: 16px 20px;

    .el-dialog__title {
      color: black;
      font-weight: 600;
    }
  }
}
</style>
