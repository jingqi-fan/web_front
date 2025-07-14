<template>
  <el-container>
    <!-- 顶部区域 -->
    <el-header>
      <div class="header-wrapper">
        <span class="header-title">信用管理</span>
        <el-menu
          mode="horizontal"
          :default-active="activeMenu"
          class="header-menu"
          @select="handleMenuSelect"
          background-color="#b3c0d1"
          text-color="#333"
          active-text-color="#409EFF"
          >
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/personal">个人中心</el-menu-item>
          <el-menu-item index="/creditbusiness">信用商业</el-menu-item>
          <el-menu-item index="/life">信用生活</el-menu-item>
          <el-menu-item index="/manageHouse">信用管理</el-menu-item>
        </el-menu>
      </div>
    </el-header>

    <!-- 主体区域：侧边 + 主内容 -->
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="overview" class="el-menu-vertical-demo" background-color="#d3dce6" text-color="#333"
          active-text-color="#409EFF" router>
          <el-menu-item index="/manageHouse">
            <el-icon>
              <House />
            </el-icon>
            <span>信用总览</span>
          </el-menu-item>
          <el-menu-item index="/CreditDimension">
            <el-icon>
              <PieChart />
            </el-icon>
            <span>分数详情</span>
          </el-menu-item>
          <el-menu-item index="/CreditTask">
            <el-icon>
              <PieChart />
            </el-icon>
            <span>提分任务</span>
          </el-menu-item>
        </el-menu>
      </el-aside>


      <el-main>
        <el-card class="box-card">
          <div class="flex items-center mb-4">
            <el-avatar :size="80" src="https://i.pravatar.cc/100"></el-avatar>
            <div class="ml-4">
              <h2 class="text-xl font-bold">{{ userInfo.name }}</h2>
              <p class="text-sm text-gray-500">
                信用分：<strong class="text-blue-500 text-2xl">{{ userInfo.creditScore }}</strong>
              </p>
              <el-tag type="creditTagType">{{ creditLevel }}</el-tag>
              <p class="text-xs text-gray-400">
                更新时间：{{ formatTime(userInfo.updateTime) }}
              </p>
            </div>
          </div>

          <!-- 行为累计 -->
          <h3 class="text-lg font-semibold mb-2">行为累计</h3>
          <el-row :gutter="20" class="mb-4">
            <el-col :span="6" v-for="(item, index) in behaviorItems" :key="index">
              <el-card shadow="hover">
                <div class="text-center">
                  <div class="text-lg text-orange-500 font-bold">{{ item.value }}</div>
                  <p class="text-sm text-gray-500">{{ item.label }}</p>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- 守约记录 -->
          <h3 class="text-lg font-semibold mb-2">守约记录</h3>
          <!-- 筛选条件 -->
          <el-form :inline="true" class="mb-4" label-position="left" size="small">
            <el-form-item label="记录类型">
              <el-select v-model="filters.recordType" placeholder="请选择类型" clearable style="width: 160px">
                <el-option label="信用生活" value="信用生活" />
                <el-option label="信用商业" value="信用商业" />
                <el-option label="基本信息" value="基本信息" />
                <el-option label="亲社会行为" value="亲社会行为" />
              </el-select>
            </el-form-item>
            <el-form-item label="完成状态">
              <el-select v-model="filters.status" placeholder="请选择状态" clearable style="width: 160px">
                <el-option label="已完成" value="已完成" />
                <el-option label="已逾期" value="已逾期" />
                <el-option label="逾期20天" value="逾期20天" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleFilter">查询</el-button>
              <el-button @click="resetFilter">重置</el-button>
            </el-form-item>
          </el-form>
          
          <el-table :data="userInfo.records" border style="width: 100%">
            <el-table-column prop="recordType" label="类型" width="120" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="amount" label="金额" width="100" />
            <el-table-column prop="finishTime" label="完成时间" width="180" />
            <el-table-column prop="status" label="完成状态" width="120" />
            <el-table-column label="信用分变化" width="120">
              <template #default="{ row }">
                <span :style="{ color: row.changeCredit > 0 ? 'green' : (row.changeCredit < 0 ? 'red' : '#333') }">
                  {{ row.changeCredit > 0 ? '+' + row.changeCredit : row.changeCredit }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination class="mt-4 mb-2" background layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total" :page-size="pagination.pageSize" :current-page="pagination.pageNum"
            @size-change="handleSizeChange" @current-change="handlePageChange" />
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/plugins/axios'
import { useUserInfoStore } from '@/stores/useUserInfoStore'
import { useUserCreditScoreStore } from '@/stores/useUserCreditScore'
import { House, PieChart } from '@element-plus/icons-vue'


const router = useRouter()

// 当前选中的菜单项，初始默认首页
const activeMenu = ref('/manageHouse')

// 点击菜单项时触发，跳转到对应页面
const handleMenuSelect = (index) => {
  activeMenu.value = index
  router.push(index)
}

const userInfoStore = useUserInfoStore() 
const userCreditScoreStore = useUserCreditScoreStore()
 
const userBasicInfo = userInfoStore.user
const creditScoreInfo = userCreditScoreStore.score

const userId = userBasicInfo.id



const userInfo = reactive({
  name: userBasicInfo.nickName,
  avatar: userBasicInfo.profilePicture,
  creditScore: creditScoreInfo.creditScore,
  updateTime: creditScoreInfo.updateTime,
  records: []
})
//信用等级及不同样式
const creditLevel = computed(() => {
  const score = creditScoreInfo.creditScore
  if (score == 0) return '待认证'
  if (score >= 850) return '信用极好'
  if (score >= 750) return '信用较好'
  if (score >= 600) return '信用一般'
  if (score >= 450) return '信用较差'
  return '信用极差'
})
const creditTagType = computed(() => {
  const score = creditScoreInfo.creditScore
  if (score == 0) return 'success'
  if (score >= 850) return 'success'
  if (score >= 750) return 'primary'
  if (score >= 600) return 'warning'
  if (score >= 450) return 'danger'
  return 'info'
})


const behaviorCount = reactive({
  totalDays: 0,
  totalAmount: 0,
  creditLifeCount: 0,
  creditBusinessCount: 0
})

const behaviorItems = computed(() => [
  { label: '累计天数', value: behaviorCount.totalDays + ' 天' },
  { label: '累计金额', value: behaviorCount.totalAmount + ' 元' },
  { label: '信用生活使用次数', value: behaviorCount.creditLifeCount + ' 次' },
  { label: '信用商业使用次数', value: behaviorCount.creditBusinessCount + ' 次' }
])

function formatTime(raw) {
  return new Date(raw).toLocaleString('zh-CN', { hour12: false })
}

// 分页数据
const pagination = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10
})

const handleFilter = () => {
  pagination.pageNum = 1
  fetchRecords()
}

const resetFilter = () => {
  filters.recordType = ''
  filters.status = ''
  pagination.pageNum = 1
  fetchRecords()
}

const filters = reactive({
  recordType: '',
  status: ''
})

//守约记录获取
const fetchRecords = () => {
  userInfo.records = []
  axiosInstance
    .get('/record', {
      params: {
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize,
        userId,
        recordType: filters.recordType,
        status: filters.status
      }
    })
    .then((res) => {
      const result = res.data
      if (result.code === 1 && result.data) {
        userInfo.records = result.data.records
        pagination.total = result.data.total
      } else {
        console.error('获取守约记录失败:', result.msg)
      }
    })
    .catch((err) => {
      console.error('请求守约记录失败', err)
    })
}

const handlePageChange = (newPage) => {
  pagination.pageNum = newPage
  fetchRecords()
}

const handleSizeChange = (newSize) => {
  pagination.pageSize = newSize
  pagination.pageNum = 1
  fetchRecords()
}

//行为累计获取
onMounted(() => {
  axiosInstance
    .get(`/credit/count/${userId}`)
    .then((res) => {
      const result = res.data
      if (result.code === 1 && result.data) {
        Object.assign(behaviorCount, result.data)
      } else {
        console.error('获取行为累计失败:', result.msg)
      }
    })
    .catch((err) => {
      console.error('请求失败', err)
    })

  fetchRecords()
})
</script>

<style scoped>
/* 新增：设置基础HTML和Body的高度 */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.el-container {
  height: 100%;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  /* 侧边栏高度设置 */
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
  /* 主内容区高度设置 */
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.text-orange-500 {
  color: #f59e0b;
}

.text-blue-500 {
  color: #3b82f6;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-xl {
  font-size: 1.25rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-bold {
  font-weight: bold;
}

.ml-4 {
  margin-left: 1rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.text-center {
  text-align: center;
}

.mt-4 {
  margin-top: 1rem;
}
.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 左右分开 */
  height: 60px;
  padding: 0 20px;
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.header-menu {
  flex-grow: 1;
  margin-left: 40px;
}
/* 选中菜单项加深效果 */
.el-aside .el-menu-item.is-active {
  background-color: #a0b0c0 !important;
  color: #1f2d3d !important;
  font-weight: bold;
  border-right: 4px solid #409EFF;
}
</style>