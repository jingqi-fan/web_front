<template>
  <div class="parking-lot-manage">
    <!-- 标题 -->
    <div class="page-header">
      <el-icon><OfficeBuilding /></el-icon>
      <span class="title-text">停车场管理</span>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <el-input
          v-model="query.title"
          placeholder="搜索停车场名称"
          clearable
          style="width: 200px; margin-right: 10px"
      />
      <el-select v-model="query.type" placeholder="停车场类型" clearable style="width: 180px; margin-right: 10px">
        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" icon="Search" @click="fetchData">查询</el-button>
      <el-button type="success" icon="Plus" @click="handleAdd" style="margin-left: auto">添加停车场</el-button>
    </div>

    <!-- 列表表格 -->
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column label="ID" prop="id" width="60" />
      <el-table-column label="名称" prop="parkingLotName" />
      <el-table-column label="位置" prop="parkingLotLocation" />
      <el-table-column label="类型" :formatter="formatType" />
      <el-table-column label="总车位" prop="totalSpaces" width="100" />
      <el-table-column label="剩余" prop="leftCount" width="100" />
      <el-table-column label="价格" prop="price" width="100" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        background
        layout="prev, pager, next, ->, total"
        :total="total"
        :page-size="query.pageSize"
        :current-page="query.pageNum"
        @current-change="handlePageChange"
        style="margin-top: 20px; text-align: right"
    />
  </div>
  <!-- 添加/编辑对话框 -->
  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑停车场' : '添加停车场'" width="500px" @close="resetForm">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="名称" prop="parkingLotName">
        <el-input v-model="form.parkingLotName" />
      </el-form-item>
      <el-form-item label="位置" prop="parkingLotLocation">
        <el-input v-model="form.parkingLotLocation" />
      </el-form-item>
      <el-form-item label="类型" prop="parkingLotType">
        <el-select v-model="form.parkingLotType" placeholder="请选择类型">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="总车位数" prop="totalSpaces">
        <el-input-number v-model="form.totalSpaces" :min="1" />
      </el-form-item>
      <el-form-item label="剩余车位数" prop="leftCount">
        <el-input-number v-model="form.leftCount" :min="0" :max="form.totalSpaces" />
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input-number v-model="form.price" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">确认</el-button>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getAdminParkingLot, deletedParkLot,saveParkingLots, updateParkingLot } from '@/api/life/park.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { OfficeBuilding } from '@element-plus/icons-vue'
import type { ParkingLots } from '@/api/life/type.ts'

const query = reactive({
  pageNum: 1,
  pageSize: 10,
  type: 0,
  title: ''
})


const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const form = reactive<ParkingLots>({
  id:0,
  parkingLotName: '',
  parkingLotLocation: '',
  parkingLotType: 0,
  totalSpaces: 1,
  image:"",
  leftCount: 0,
  price: 0,
  deleted:0,
  createdAt:"",
  updatedAt:""
})

const rules = {
  parkingLotName: [{ required: true, message: '请输入停车场名称', trigger: 'blur' }],
  parkingLotLocation: [{ required: true, message: '请输入停车场位置', trigger: 'blur' }],
  parkingLotType: [{ required: true, message: '请选择停车场类型', trigger: 'change' }],
  totalSpaces: [{ required: true, message: '请输入总车位数', trigger: 'change' }],
  leftCount: [{ required: true, message: '请输入剩余车位数', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'change' }]
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(form, {
    id:null,
    parkingLotName: '',
    parkingLotLocation: '',
    parkingLotType: 0,
    totalSpaces: 1,
    leftCount: 0,
    image:"",
    price: 0,
    deleted:0,
    createdAt:"",
    updatedAt:""
  })
}

const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (item: ParkingLots) => {
  isEdit.value = true
  Object.assign(form, item)
  dialogVisible.value = true
}

const submitForm = async () => {
  await formRef.value.validate()

  const action = isEdit.value ? updateParkingLot : saveParkingLots
  console.log(form)
  const res = await action({ ...form })
  if (res.code === 200) {
    ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
    dialogVisible.value = false
    await fetchData()
  } else {
    ElMessage.error(isEdit.value ? '编辑失败' : '添加失败')
  }
}

const total = ref(0)
const tableData = ref<ParkingLots[]>([])

const typeOptions = [
  { value: 0, label: '默认' },
  { value: 1, label: '市中心区域' },
  { value: 2, label: '商业中心区' },
  { value: 3, label: '住宅区' },
  { value: 4, label: '旅游景点区' },
  { value: 5, label: '医院周边' },
  { value: 6, label: '室内' },
  { value: 7, label: '室外' },
  { value: 8, label: '露天' },
  { value: 9, label: '地下' }
]

const formatType = (row: ParkingLots) => {
  const found = typeOptions.find(opt => opt.value === row.parkingLotType)
  return found ? found.label : '-'
}

const fetchData = async () => {
  const res = await getAdminParkingLot(query.pageNum, query.pageSize, query.type, query.title)
  if (res.code === 200) {
    tableData.value = res.data.parkingLotsList
    total.value = res.data.total
  } else {
    ElMessage.error('获取停车场列表失败')
  }
}

const handlePageChange = (page: number) => {
  query.pageNum = page
  fetchData()
}


const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除该停车场吗？', '警告', {
    type: 'warning'
  }).then(async () => {
    const res = await deletedParkLot(id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    } else {
      ElMessage.error('删除失败')
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}
.page-header .el-icon {
  margin-right: 8px;
}

.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>
