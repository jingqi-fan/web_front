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
            <el-icon>
              <House />
            </el-icon>
            <span>信用总览</span>
          </el-menu-item>
          <el-menu-item index="/CreditDimension">
            <el-icon>
              <PieChart />
            </el-icon>
            <span>分数构成</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容：分数构成 -->
      <el-main>
        <el-card class="score-card">
          <div class="header">分数构成</div>
          <div class="radar-wrapper">
            <div
              v-for="(item, index) in scoreItems"
              :key="index"
              :class="['score-item', item.position]"
            >
              <el-tooltip effect="dark" :content="item.description" placement="top">
                <div class="icon-circle">
                  <el-avatar :size="48" :src="item.icon" />
                </div>
              </el-tooltip>
              <div class="label">{{ item.label }}</div>
            </div>

            <div class="center-circle">
              <el-icon size="28"><Compass /></el-icon>
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { House, PieChart, Compass } from '@element-plus/icons-vue'

const router = useRouter()
const activeMenu = ref('/CreditDimension')
const handleMenuSelect = (index) => {
  activeMenu.value = index
  router.push(index)
}

const scoreItems = ref([
  {
    label: '基本信息',
    description: '包括户籍、婚姻、学历、就业等基本情况',
    position: 'top-right',
    icon: 'https://cdn-icons-png.flaticon.com/512/2721/2721124.png',
  },
  {
    label: '商业用信',
    description: '个人在经济合同、金融贷款等领域的用信行为',
    position: 'right',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828911.png',
  },
  {
    label: '亲社会行为',
    description: '合作互助、共享贡献等利社会行为',
    position: 'bottom-right',
    icon: 'https://cdn-icons-png.flaticon.com/512/3771/3771486.png',
  },
  {
    label: '遵纪守法',
    description: '守法意识与信用能力的重要体现',
    position: 'bottom-left',
    icon: 'https://cdn-icons-png.flaticon.com/512/3602/3602123.png',
  },
  {
    label: '生活用信',
    description: '在社会活动与公共服务中的信用表现',
    position: 'top-left',
    icon: 'https://cdn-icons-png.flaticon.com/512/921/921347.png',
  },
])
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
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

/* 分数构成卡片样式 */
.score-card {
  max-width: 900px;
  margin: 0 auto;
  background: linear-gradient(to bottom right, #f0f7ff, #ffffff);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  padding: 30px;
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
.top-left {
  top: 10%;
  left: 10%;
}
.top-right {
  top: 10%;
  right: 10%;
}
.right {
  top: 40%;
  right: -10px;
}
.bottom-right {
  bottom: 10%;
  right: 10%;
}
.bottom-left {
  bottom: 10%;
  left: 10%;
}
.center-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: #d0e8ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(0, 136, 255, 0.4);
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
