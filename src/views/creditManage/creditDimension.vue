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
          <el-menu-item index="/settings">首页</el-menu-item>
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
        <el-menu
          default-active="overview"
          class="el-menu-vertical-demo"
          background-color="#d3dce6"
          text-color="#333"
          active-text-color="#409EFF"
          router
        >
          <el-menu-item index="/manageHouse">
            <el-icon><House /></el-icon>
            <span>信用总览</span>
          </el-menu-item>
          <el-menu-item index="/CreditDimension">
            <el-icon><PieChart /></el-icon>
            <span>分数构成</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!--分数构成 -->
      <el-main>
        <el-card class="score-card">
          <div class="header">信用评分构成</div>
          <div class="radar-wrapper">
            <!-- 四个维度 -->
            <div
              v-for="(item, index) in dimensionItems"
              :key="index"
              :class="['score-item', item.position]"
            >
              <el-tooltip effect="dark" :content="item.dimensionType" placement="top">
                <div class="icon-circle">
                  <el-avatar :size="48" :src="item.icon" />
                </div>
              </el-tooltip>
              <div class="label">{{ item.dimensionType }}</div>
              <div class="score">{{ item.dimensionScore }}</div>
            </div>

            <!-- 中心总分 -->
            <div class="center-circle">
              <div class="total-score">{{ totalScore }}</div>
              <div class="total-label">总信用分</div>
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserInfoStore } from '@/stores/useUserInfoStore'
import { useUserCreditScoreStore } from '@/stores/useUserCreditScore'
import { House, PieChart } from '@element-plus/icons-vue'

const userInfoStore = useUserInfoStore() 
const userCreditScoreStore = useUserCreditScoreStore()
 
const userBasicInfo = userInfoStore.user
const creditScoreInfo = userCreditScoreStore.score

const userId = 101

const router = useRouter()
const activeMenu = ref('/CreditDimension')
const handleMenuSelect = (index) => {
  activeMenu.value = index
  router.push(index)
}

// 维度数据
const dimensionItems = ref([]) // 四个维度
const totalScore = ref(0)      // 总信用分

// 图标映射
const iconMap = {
  '基本信息': 'https://cdn-icons-png.flaticon.com/512/2721/2721124.png',
  '信用生活': 'https://cdn-icons-png.flaticon.com/512/921/921347.png',
  '信用商业': 'https://cdn-icons-png.flaticon.com/512/1828/1828911.png',
  '亲社会行为': 'https://cdn-icons-png.flaticon.com/512/3771/3771486.png',
}

// 固定位置分配（按顺序）
const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right']



onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8086/credit/dimensions/${userId}`)
    if (res.data.code === 1) {
      const data = res.data.data
      const dims = data.filter(d => d.dimensionType !== '总信用分')
      const total = data.find(d => d.dimensionType === '总信用分')

      // 给每项添加图标与位置
      dimensionItems.value = dims.map((item, index) => ({
        ...item,
        icon: iconMap[item.dimensionType] || '',
        position: positions[index] || 'top-left',
      }))

      totalScore.value = total?.dimensionScore ?? 0
    }
  } catch (err) {
    console.error('获取维度数据失败', err)
  }
})
</script>

<style scoped>
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
  background-color: #f9fbfd;
  padding: 10px;
  height: calc(100vh - 60px);
  overflow: hidden;
}


/* 分数构成卡片样式 */
.score-card {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, #f0f7ff, #ffffff);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  padding: 30px;
  box-sizing: border-box;
}


.header {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 30px;
  text-align: center;
}

.radar-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
}

.score-item {
  position: absolute;
  width: 120px;
  text-align: center;
  font-size: 14px;
  color: #409eff;
  font-weight: 500;
}

.icon-circle {
  background-color: #e6f0ff;
  border-radius: 50%;
  padding: 10px;
  display: inline-block;
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.3);
}

.label {
  margin-top: 8px;
}

.score {
  margin-top: 4px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

/* 四象限位置样式 */
.top-left {
  top: 10%;
  left: 15%;
}
.top-right {
  top: 10%;
  right: 15%;
}
.bottom-left {
  bottom: 10%;
  left: 15%;
}
.bottom-right {
  bottom: 10%;
  right: 15%;
}

/* 中心总分样式 */
.center-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: #d0e8ff;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(0, 136, 255, 0.4);
}

.total-score {
  font-size: 28px;
  font-weight: bold;
  color: #007acc;
}

.total-label {
  font-size: 14px;
  margin-top: 4px;
  color: #666;
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
</style>
