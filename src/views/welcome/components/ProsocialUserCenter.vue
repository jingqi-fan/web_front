<template>
  <div class="activity-center">
    <!-- 标题栏 -->
    <el-header class="custom-header">
      <div class="title-left">
        <logo style="margin-left: 20px; cursor: pointer;" @click="goToHome" />
        <div class="credit-life-title">
          <div class="main-title">亲社会活动<div class="title-decoration"></div></div>
          <div class="subtitle">信用行为 · 实践守信</div>
        </div>
      </div>
      <div class="title-right">
        <el-button class="custom-button" @click="loadAll">刷新</el-button>
        <el-button class="custom-button" @click="goBack">返回</el-button>
      </div>
    </el-header>

    <!-- 主体区域 -->
    <el-main class="custom-main">
      <el-container style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,139,0.2)">
        <!-- 左侧导航 -->
        <el-aside width="200px" class="aside-menu">
          <el-menu
              :default-active="activeMenu"
              class="el-menu-vertical-demo"
              @select="handleMenuSelect"
          >
            <el-menu-item index="all">全部活动</el-menu-item>
            <el-menu-item index="mine">我参与的活动</el-menu-item>
            <el-menu-item index="personal">个人中心</el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 主体内容 -->
        <el-main class="main-content">
          <template v-if="activeMenu === 'all'">
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
          <template v-if="activeMenu === 'mine'">
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
          <template v-if="activeMenu === 'personal'">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Logo from '@/views/personal/component/Logo.vue'
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

const router = useRouter()
const goToHome = () => router.push('/')
const goBack = () => router.back()

const activeMenu = ref('all')
const handleMenuSelect = (key: string) => {
  activeMenu.value = key
}
const searchKeyword = ref('')
const searchMineKeyword = ref('')

const userInfoStore=useUserInfoStore()

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
.activity-center {
  padding: 20px;
}
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
  margin-bottom: 10px;
}

.custom-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 90px;
  z-index: 1000;
  background-color: #f5f5f5;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 139, 0.5);
  border-radius: 8px;
}

.custom-main {
  margin-top: 100px;
  box-shadow: 0 4px 20px rgba(0, 0, 139, 0.2);
  border-radius: 8px;
  background-color: #fff;
}

.credit-life-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}

.main-title {
  font-size: 44px;
  font-weight: 500;
  color: #1a56db;
  letter-spacing: 1px;
  position: relative;
  text-shadow: 0 2px 4px rgba(26, 86, 219, 0.15);
  transition: all 0.3s ease;
}

.main-title:hover {
  transform: scale(1.03);
  text-shadow: 0 4px 8px rgba(26, 86, 219, 0.2);
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

.search-input {
  width: 300px;
  margin: 10px 0;
}

.activity-tabs {
  .el-table {
    margin-top: 10px;
    border-radius: 8px;
  }

  .el-image {
    border-radius: 6px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  }

  .el-button + .el-button {
    margin-left: 8px;
  }
}
</style>

