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
      <el-aside width="200px" class="aside-menu">
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

      <el-main class="custom-main">
        <el-container style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,139,0.2)">
          <!-- 左侧导航 -->
          <el-aside width="200px" class="aside-menu">
            <el-menu
                :default-active="activeMenuInner"
                class="el-menu-vertical-demo"
                @select="handleMenuSelectInner"
            >
              <el-menu-item index="all">全部活动</el-menu-item>
              <el-menu-item index="mine">我参与的活动</el-menu-item>
              <el-menu-item index="personal">个人中心</el-menu-item>
            </el-menu>
          </el-aside>

          <!-- 主体内容 -->
          <el-main class="main-content">
            <template v-if="activeMenuInner === 'all'">
              <!-- 全部活动内容 -->
              <el-input v-model="searchKeyword" placeholder="搜索活动类型 / 简介" class="search-input" clearable />
              <el-table :data="filteredActivityItems" height="530" border stripe>
                <el-table-column type="index" label="#" width="50" />
                <el-table-column label="活动类 LOGO" width="100">
                  <template #default="{ row }">
                    <el-image
                        :src="getActivityByTitle(row.activityTitle)?.logo"
                        fit="contain"
                        style="width: 60px; height: 60px"
                    />
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
                    <el-button type="primary" size="small" @click="join(row.itemId)">参与</el-button>
                    <el-button size="small" @click="viewDetail(row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <template v-if="activeMenuInner === 'mine'">
              <!-- 我参与的活动内容 -->
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
                    {{ row.status === 'FINISHED' ? '是' : '否' }}
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="220">
                  <template #default="{ row }">
                    <el-button type="danger" size="small" @click="exit(row.id)">退出活动</el-button>
                    <el-button type="success" size="small" @click="finish(row.id)">完成活动</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <template v-if="activeMenuInner === 'personal'">
              <div class="personal-center">
                <div class="avatar-box">
                  <el-avatar :size="100" :src="userInfoStore.user.profilePicture" />
                  <div class="user-name">{{ userInfoStore.user.username || '用户' }}</div>
                </div>

                <el-card class="credit-card">
                  <div class="card-title">信用分</div>
                  <div class="credit-score">{{ userInfoStore.user.credit || 0 }} 分</div>
                </el-card>

                <el-card class="activity-stat-card">
                  <div class="card-title">已完成的亲社会活动</div>
                  <div class="activity-count">
                    {{ finishedActivityCount }} 个
                  </div>
                </el-card>
              </div>
            </template>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  joinActivity,
  exitActivity,
  finishActivityItem,
  getUserActivityList,
  loadAllActivities,
  loadAllActivityItems
} from '@/api/prosocail_behavior/user_activity.ts'
import type { ActivityItemWithCategoryDTO, ActivitiesDTO, UserJoinActivityDTO } from '@/api/prosocail_behavior/user_activity_type.ts'
import {ElMessage, ElMessageBox} from "element-plus";
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";
import { House, PieChart } from '@element-plus/icons-vue'

const router = useRouter()

// 顶部菜单
const activeMenu = ref('/manageHouse')
const handleMenuSelect = (key: string) => {
  activeMenu.value = key
  router.push(key)
}

// 主体内侧菜单（全部活动/我参与/个人中心）
const activeMenuInner = ref('all')
const handleMenuSelectInner = (key: string) => {
  activeMenuInner.value = key
}

const searchKeyword = ref('')
const searchMineKeyword = ref('')

const userInfoStore = useUserInfoStore()

const userId = userInfoStore.user.id
const allActivities = ref<ActivitiesDTO[]>([])
const allItems = ref<ActivityItemWithCategoryDTO[]>([])
const userActivities = ref<UserJoinActivityDTO[]>([])
const finishedActivityCount = computed(() =>
    userActivities.value.filter(a => a.status === 'FINISHED').length
)

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
const getItemById = (id: number) => allItems.value.find(i => i.itemId === id)

onMounted(loadAll)

const getActivityByType = (type: string) => allActivities.value.find(a => a.title === type)
const getActivityByTitle = (title: string) =>
    allActivities.value.find(a => a.title === title)

const filteredActivityItems = computed(() => {
  if (!searchKeyword.value) return allItems.value
  return allItems.value.filter(i =>
      (i.activityTitle?.includes(searchKeyword.value) ?? false) ||
      (getActivityByType(i.activityTitle)?.introduce?.includes(searchKeyword.value) ?? false)
  )
})

const filteredUserActivities = computed(() =>
    userActivities.value.filter(i =>
        (i.title?.includes(searchMineKeyword.value) ?? false) ||
        (getActivityByTitle(i.title)?.sponsor?.includes(searchMineKeyword.value) ?? false)
    )
)

const join = async (itemId: number) => {
  const res=await joinActivity({ userId, itemId })
  if(res.status==='SUCCESS'){
    ElMessage.success('参与成功')
  }else{
    ElMessage.error(res.message===''?'活动参与失败':res.message)
    return
  }
  await loadAll()
}

const exit = async (itemId: number) => {
  const res=await exitActivity({ userId, itemId })
  if(res.status==='SUCCESS'){
    ElMessage.success('退出成功')
  }else {
    ElMessage.error(res.message===''?'活动退出失败':res.message)
    return
  }
  await loadAll()
}

const finish = async (itemId: number) => {
  const res=await finishActivityItem({ userId, itemId })
  if(res.status==='SUCCESS'){
    ElMessage.success('已完成该活动')
  }else{
    ElMessage.error(res.message===''?'活动完成失败':res.message)
    return
  }
  await loadAll()
}

const viewDetail = (row: ActivityItemWithCategoryDTO) => {
  ElMessageBox.alert(`
    <strong>${row.activityTitle}</strong><br/>
    ${getActivityByType(row.activityTitle)?.content || '暂无详情'}<br/>
    地址：${getActivityByType(row.activityTitle)?.address || '未知'}
  `, '活动详情', {
    dangerouslyUseHTMLString: true
  })
}
</script>

<style scoped lang="scss">
/* 基础布局和样式 */
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
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

/* 顶部样式 */
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

/* 侧边菜单激活项样式 */
.el-aside .el-menu-item.is-active {
  background-color: #a0b0c0 !important;
  color: #1f2d3d !important;
  font-weight: bold;
  border-right: 4px solid #409EFF;
}

/* 替换后的主体样式 */
.aside-menu {
  background: #f0f4f9;
  padding-top: 20px;
  border-right: 1px solid #e0e0e0;
  height: 630px;

  .el-menu-item {
    font-size: 16px;
  }
}

.main-content {
  padding: 20px;
}

.search-input {
  width: 300px;
  margin: 10px 0;
}

.custom-main {
  margin-top: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 139, 0.2);
  border-radius: 8px;
  background-color: #fff;
}

.personal-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 40px 20px;
}

.avatar-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  .user-name {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }
}

.credit-card, .activity-stat-card {
  width: 300px;
  text-align: center;

  .card-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
    color: #666;
  }

  .credit-score, .activity-count {
    font-size: 36px;
    font-weight: bold;
    color: #1a56db;
  }
}

.title-decoration {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
  border-radius: 2px;
  opacity: 0.7;
}

.subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
  letter-spacing: 2px;
  font-weight: 500;
  opacity: 0.9;
}

.title-left {
  display: flex;
  align-items: center;
}

.title-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.custom-button {
  background-image: linear-gradient(to right, #6dd5ed, #2193b0);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
}

.custom-button:hover {
  opacity: 0.8;
}
</style>
