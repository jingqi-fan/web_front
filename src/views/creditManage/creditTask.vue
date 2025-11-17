<template>
  <el-container>
    <!-- 顶部区域 -->
    <el-header>
      <div class="header-wrapper">
        <span class="header-title">信用管理</span>
        <el-menu mode="horizontal" :default-active="activeMenu" class="header-menu" @select="handleMenuSelect"
          background-color="#b3c0d1" text-color="#333" active-text-color="#409EFF" router>
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

      <!-- 主内容 -->
      <el-main>
        <el-card class="box-card">
          <div class="activity-center">
            <div class="title-bar">
              <el-radio-group v-model="activeMenu" @change="handleMenuSelect">
                <el-radio-button label="all">推荐活动</el-radio-button>
                <el-radio-button label="mine">我的活动</el-radio-button>
                <el-radio-button label="personal">个人中心</el-radio-button>
              </el-radio-group>
            </div>

            <div v-if="activeMenu === 'all'" class="activity-wrapper">
              <el-input v-model="searchKeyword" placeholder="搜索活动类型 / 简介" class="search-input" clearable />
              <el-button class="refresh-button" @click="refreshRandomFive" type="success" plain>换一批</el-button>


              <el-table :data="randomFiveActivities" height="530" border stripe>
                <el-table-column type="index" label="#" width="50" />
                <el-table-column label="活动类 LOGO" width="100">
                  <template #default="{ row }">
                    <el-image :src="getActivityByTitle(row.activityTitle)?.logo" fit="contain"
                      style="width: 60px; height: 60px" />
                  </template>
                </el-table-column>
                <el-table-column label="活动类型" prop="activityTitle" width="150" />
                <el-table-column label="发布时间" prop="publishDate" width="160" />
                <el-table-column label="简介">
                  <template #default="{ row }">
                    {{ getActivityByTitle(row.activityTitle)?.introduce || '-' }}
                  </template>
                </el-table-column>
                <el-table-column label="人数" prop="number" width="100" />
                <el-table-column label="操作" width="180">
                  <template #default="{ row }">
                    <el-button type="success" size="small" @click="join(row.itemId)">参与</el-button>
                    <el-button size="small" @click="viewDetail(row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div v-if="activeMenu === 'mine'">
              <el-input v-model="searchMineKeyword" placeholder="搜索活动类型 / 主办方" class="search-input" clearable />
              <el-table height="530" :data="filteredUserActivities" border stripe>
                <el-table-column type="index" label="#" width="50" />
                <el-table-column label="活动类型" prop="title" width="180" />
                <el-table-column label="主办方">
                  <template #default="{ row }">
                    {{ getActivityByTitle(getItemById(row.id)?.activityTitle)?.sponsor || '未知' }}
                  </template>
                </el-table-column>
                <el-table-column label="开始时间">
                  <template #default="{ row }">
                    {{ getItemById(row.id)?.startDate || '-' }}
                  </template>
                </el-table-column>
                <el-table-column label="结束时间">
                  <template #default="{ row }">
                    {{ getItemById(row.id)?.endDate || '-' }}
                  </template>
                </el-table-column>
                <el-table-column label="是否完成">
                  <template #default="{ row }">
                    {{ row.finished ? '是' : '否' }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="220">
                  <template #default="{ row }">
                    <el-button type="danger" size="small" v-if="!row.finished" @click="exit(row.id)">退出活动</el-button>
                    <el-button type="success" size="small" v-if="!row.finished" @click="finish(row.id)">完成活动</el-button>
                    <el-tag type="success" v-if="row.finished" size="small">已完成</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div v-if="activeMenu === 'personal'" class="personal-center">
              <el-avatar :size="100" :src="userInfoStore.user.profilePicture" />
              <div class="user-name">{{ userInfoStore.user.username || '用户' }}</div>

              <el-card class="credit-card">
                <div class="card-title">信用分</div>
                <div class="credit-score">{{ userInfoStore.user.credit || 0 }} 分</div>
              </el-card>

              <el-card class="activity-stat-card">
                <div class="card-title">已完成的活动</div>
                <div class="activity-count">{{ finishedSocialCount !== null ? finishedSocialCount : '加载中...' }} 个</div>
              </el-card>
            </div>
          </div>
        </el-card>
        <div class="fixed-more-link" @click="goToMore">想查看更多？</div>
      </el-main>
    </el-container>

    <!-- 活动详情弹窗 -->
    <el-dialog title="活动详情" v-model="detailDialogVisible" width="600px" :before-close="handleDialogClose">
      <div class="detail-content">
        <h3>{{ detailData.activityTitle }}</h3>
        <p class="detail-introduce">{{ detailData.introduce || '暂无详情' }}</p>
        <p><strong>内容：</strong>{{ detailData.content || '无内容' }}</p>
        <p><strong>地址：</strong>{{ detailData.address || '未知' }}</p>
        <p><strong>发布时间：</strong>{{ detailData.publishDate || '-' }}</p>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  joinActivity,
  exitActivity,
  finishActivityItem,
  getUserActivityList,
  loadAllActivities,
  loadAllActivityItems
} from '@/api/prosocail_behavior/user_activity.ts'
import type {
  ActivityItemWithCategoryDTO,
  ActivitiesDTO,
  UserJoinActivityDTO
} from '@/api/prosocail_behavior/user_activity_type.ts'
import { useUserInfoStore } from '@/stores/useUserInfoStore.ts'
import { House, PieChart } from '@element-plus/icons-vue'
import axios from 'axios'



const router = useRouter()
const userInfoStore = useUserInfoStore()

const userId = userInfoStore.user.id
const activeMenu = ref('all')
const searchKeyword = ref('')
const searchMineKeyword = ref('')

const creditScore = ref<number | null>(null)
const loadCredit = async () => {
  try {
    const res = await axios.get(`/api/credit/${userId}`)
    if (res.data?.code === 1) {
      creditScore.value = res.data.data
      userInfoStore.user.credit = creditScore.value
    } else {
      ElMessage.error(res.data?.msg || '获取信用分失败')
    }
  } catch (error) {
    ElMessage.error('请求异常，获取信用分失败')
  }
}

const recordType = "亲社会行为"
const encodedRecordType = encodeURIComponent(recordType)
const finishedSocialCount = ref<number | null>(null)
const loadFinishedSocialCount = async () => {
  try {
    const res = await axios.get(`/api/record/user/${userId}/${encodedRecordType}`)
    if (res.data?.code === 1) {
      finishedSocialCount.value = res.data.data
    } else {
      ElMessage.error(res.data?.msg || '获取亲社会活动数量失败')
    }
  } catch (error) {
    ElMessage.error('请求异常，获取亲社会活动数量失败')
  }
}


const randomFiveActivities = ref<ActivityItemWithCategoryDTO[]>([])
function refreshRandomFive() {
  const source = filteredActivityItems.value
  if (source.length <= 5) {
    randomFiveActivities.value = [...source]
  } else {
    // 随机抽取5条
    const shuffled = [...source].sort(() => 0.5 - Math.random())
    randomFiveActivities.value = shuffled.slice(0, 5)
  }
}

const allActivities = ref<ActivitiesDTO[]>([])
const allItems = ref<ActivityItemWithCategoryDTO[]>([])
const userActivities = ref<UserJoinActivityDTO[]>([])

const goToMore = () => {
  router.push('/prosocial_user')
}

const loadAll = async () => {
  const [activitiesRes, itemsRes, userRes] = await Promise.all([
    loadAllActivities(),
    loadAllActivityItems(),
    getUserActivityList(userId)
  ])
  allActivities.value = activitiesRes.data
  allItems.value = itemsRes.data
  userActivities.value = userRes.data
}



onMounted(() => {
  loadCredit()
  loadFinishedSocialCount()
  loadAll()
  refreshRandomFive()
})

const handleMenuSelect = (key: string) => {
  activeMenu.value = key
}

const getActivityByType = (type: string) =>
  allActivities.value.find(a => a.title === type)

const getActivityByTitle = (title: string) =>
  allActivities.value.find(a => a.title === title)

const getItemById = (id: number) =>
  allItems.value.find(i => i.itemId === id)

const filteredActivityItems = computed(() => {
  if (!searchKeyword.value) return allItems.value
  return allItems.value.filter(i =>
    i.activityTitle?.includes(searchKeyword.value) ||
    getActivityByType(i.activityTitle)?.introduce?.includes(searchKeyword.value)
  )
})

watch(filteredActivityItems, () => {
  refreshRandomFive()
})

const filteredUserActivities = computed(() =>
  userActivities.value.filter(i =>
    i.title?.includes(searchMineKeyword.value) ||
    getActivityByTitle(i.title)?.sponsor?.includes(searchMineKeyword.value)
  )
)

const finishedActivityCount = computed(() =>
  userActivities.value.filter(a => a.status === true).length
)

const join = async (itemId: number) => {
  const res = await joinActivity({ userId, itemId })
  if (res.status === 'SUCCESS') {
    ElMessage.success('参与成功')
    await loadAll()
  } else {
    ElMessage.error(res.message || '活动参与失败')
  }
}

const exit = async (itemId: number) => {
  const res = await exitActivity({ userId, itemId })
  if (res.status === 'SUCCESS') {
    ElMessage.success('退出成功')
    await loadAll()
  } else {
    ElMessage.error(res.message || '活动退出失败')
  }
}

const finish = async (itemId: number) => {
  const res = await finishActivityItem({ userId, itemId })
  if (res.status === 'SUCCESS') {
    ElMessage.success('已完成该活动')
    await loadAll()
  } else {
    ElMessage.error(res.message || '活动完成失败')
  }
}

// 新增弹窗相关响应式变量和方法
const detailDialogVisible = ref(false)
const detailData = reactive({
  activityTitle: '',
  introduce: '',
  content: '',
  address: '',
  publishDate: ''
})

const viewDetail = (row: ActivityItemWithCategoryDTO) => {
  const activity = getActivityByTitle(row.activityTitle)
  detailData.activityTitle = row.activityTitle
  detailData.introduce = activity?.introduce || ''
  detailData.content = activity?.content || ''
  detailData.address = activity?.address || ''
  detailData.publishDate = row.publishDate || ''
  detailDialogVisible.value = true
}

const handleDialogClose = () => {
  detailDialogVisible.value = false
}
</script>

<style scoped>
/* 设置基础HTML和Body的高度 */
html,
body {
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
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.el-main {
  background-color: #c9d7e8;
  padding: 20px;
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
  justify-content: space-between;
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

.el-aside .el-menu-item.is-active {
  background-color: #a0b0c0 !important;
  color: #1f2d3d !important;
  font-weight: bold;
  border-right: 4px solid #409EFF;
}

.activity-center {
  padding: 10px;
}

.search-input {
  width: 300px;
  margin: 10px 0;
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.personal-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 40px 20px;
}

.user-name {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
}

.credit-card,
.activity-stat-card {
  width: 300px;
  text-align: center;
}

.card-title {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.credit-score,
.activity-count {
  font-size: 32px;
  color: #409EFF;
  font-weight: bold;
}

/* 新增活动详情弹窗样式 */
.detail-content h3 {
  margin: 0 0 10px;
  font-weight: bold;
  color: #409EFF;
}

.detail-content p {
  margin: 6px 0;
  line-height: 1.5;
  color: #333;
}

.detail-content p strong {
  color: #606266;
}

.fixed-more-link {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #409EFF;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s;
  z-index: 999;
}

.fixed-more-link:hover {
  background-color: #66b1ff;
  transform: scale(1.05);
}

</style>
