  <template>
    <el-container>
      <!-- 顶部区域 -->
      <el-header>
        <div class="header-wrapper">
          <span class="header-title">信用管理</span>
          <el-menu mode="horizontal" :default-active="activeMenu" class="header-menu" @select="handleMenuSelect"
            background-color="#b3c0d1" text-color="#333" active-text-color="#409EFF">
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

        <!-- 主内容区域 -->
        <el-main>
          <div class="main-flex">
            <!-- 信用构成 -->
            <el-card class="score-card">
              <div class="header">信用评分构成</div>
              <div class="radar-wrapper">
                <!-- 四个维度 -->
                <div v-for="(item, index) in dimensionItems" :key="index" :class="['score-item', item.position]">
                  <el-tooltip effect="dark" :content="item.dimensionType" placement="top">
                    <div class="icon-circle">
                      <el-avatar :size="48" :src="item.icon" />
                    </div>
                  </el-tooltip>
                  <div class="label">{{ item.dimensionType }}</div>
                  <div class="score">{{ item.dimensionScore }}</div>
                </div>

                <!-- 中心总分 -->
                <div class="center-circle" @click="showDescDialog = true" style="cursor:pointer;">
                  <div class="total-score">{{ totalScore }}</div>
                  <div class="total-label">总信用分</div>
                </div>

                <!-- 弹窗 -->
                <el-dialog title="信用总分说明" v-model="showDescDialog" width="400px">
                  <div>{{ totalDesc }}</div>
                  <template #footer>
                    <el-button @click="showDescDialog = false">关闭</el-button>
                  </template>
                </el-dialog>


              </div>

              <!-- 折线图 -->
              <div class="score-trend-chart" ref="trendChart" style="width: 100%; height: 240px; margin-top: 30px;">
              </div>
            </el-card>

            <!-- 信用排行榜 -->
            <el-card class="rank-card">
              <div class="rank-header">信用排行榜</div>
              <div class="rank-scrollbar">
                <el-scrollbar>
                  <div v-for="(user, index) in rankList" :key="user.id" class="rank-item"
                    :class="{ gold: index === 0, silver: index === 1, bronze: index === 2 }">
                    <span class="rank-index">
                      <template v-if="index === 0">🥇</template>
                      <template v-else-if="index === 1">🥈</template>
                      <template v-else-if="index === 2">🥉</template>
                      <template v-else>{{ index + 1 >= 100 ? '99+' : index + 1 }}</template>
                    </span>
                    <el-avatar :size="36" :src="user.profilePicture" />
                    <span class="rank-name">{{ user.nickName }}</span>
                    <span class="rank-score">{{ user.score }}</span>
                  </div>
                </el-scrollbar>
              </div>
              
              <!-- 悬浮信用信息块 -->
              <div class="user-credit-info">
                <el-avatar :size="48" :src="userBasicInfo.profilePicture || 'https://i.pravatar.cc/150?img=15'" />
                <div class="user-info-text">
                  <div class="user-name">{{ userBasicInfo.nickName || '当前用户' }}</div>
                  <div class="user-rank-score">
                    排名：<span>{{ userRank || '暂无' }}</span>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    信用分：<span>{{ totalScore }}</span>
                  </div>
                </div>
              </div>

            </el-card>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </template>

<script setup>
import { onMounted, ref, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserInfoStore } from '@/stores/useUserInfoStore'
import { useUserCreditScoreStore } from '@/stores/useUserCreditScore'
import { House, PieChart } from '@element-plus/icons-vue'


const userInfoStore = useUserInfoStore()
const userCreditScoreStore = useUserCreditScoreStore()

const userBasicInfo = userInfoStore.user
const creditScoreInfo = userCreditScoreStore.score

const userId = userBasicInfo.id

const router = useRouter()
const activeMenu = ref('/CreditDimension')
const handleMenuSelect = (index) => {
  activeMenu.value = index
  router.push(index)
}

// 维度数据
const dimensionItems = ref([]) // 四个维度
const totalScore = ref(0)      // 总信用分
const showDescDialog = ref(false) // 是否显示总信用分描述弹窗
const totalDesc = ref('')  // 用来存放总信用分的描述文本

// 图标映射
const iconMap = {
  '基本信息': 'https://cdn-icons-png.flaticon.com/512/2721/2721124.png',
  '信用生活': 'https://cdn-icons-png.flaticon.com/512/921/921347.png',
  '信用商业': 'https://cdn-icons-png.flaticon.com/512/1828/1828911.png',
  '亲社会行为': 'https://cdn-icons-png.flaticon.com/512/3771/3771486.png',
}

// 固定位置分配（按顺序）
const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

// 排行榜数据
const rankList = ref([])
// 用户自身排名
const userRank = ref('暂无')

const fetchRankList = async () => {
  try {
    const res = await axios.get('http://localhost:8086/credit/rank')
    if (res.data.code === 1 && Array.isArray(res.data.data)) {
      rankList.value = res.data.data
        .filter(item => item.score > 0)  // 过滤分数为0的用户
        .map(item => ({
          userId: item.userId,
          nickName: item.nickName,
          profilePicture: item.profilePicture || 'https://i.pravatar.cc/150?img=10',
          score: item.score
        }))
    } else {
      console.error('排行榜接口返回错误:', res.data.msg)
    }
  } catch (error) {
    console.error('获取排行榜失败:', error)
  }
}


const fetchUserRank = async () => {
  try {
    const res = await axios.get(`http://localhost:8086/credit/rank/${userId}`)
    if (res.data.code === 1) {
      //排名這裡下標從0開始，所以+1
      userRank.value = res.data.data + 1
    } else {
      console.error('获取用户排名失败:', res.data.msg)
    }
  } catch (error) {
    console.error('请求用户排名接口出错:', error)
  }
}

// 近十次信用分变化数据，格式：[{ date: '2025-07-01', score: 85 }, ...]
const scoreTrend = ref([])

// echarts 实例
const trendChart = ref(null)
let chartInstance = null

// 初始化折线图
const initTrendChart = () => {
  if (!trendChart.value) return
  chartInstance = echarts.init(trendChart.value)

  // 计算score的最大最小值，给Y轴留出10%空间
  const scores = scoreTrend.value.map(item => item.score)
  const maxScore = Math.max(...scores)
  const minScore = Math.min(...scores)
  const range = maxScore - minScore || 10 // 防止为0
  const yMax = maxScore + range * 0.1
  const yMin = Math.max(minScore - range * 0.1, 0) // 最小不低于0

  const option = {
    title: {
      text: '近期信用分变化',
      left: 'center',
      textStyle: {
        fontSize: 16,
        color: '#303133',
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: scoreTrend.value.map(item => item.date),
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#909399' } },
      axisLabel: { rotate: 45 }
    },
    yAxis: {
      type: 'value',
      min: yMin,
      max: yMax,
      axisLine: { lineStyle: { color: '#909399' } },
      splitNumber: 5,  //分成5段
      minInterval: 1, // 保证刻度间隔不小于1
    },
    series: [{
      data: scores,
      type: 'line',
      smooth: true,
      lineStyle: { color: '#409EFF' },
      itemStyle: { color: '#409EFF' },
      areaStyle: {
        color: 'rgba(64, 158, 255, 0.2)'
      }
    }]
  }
  chartInstance.setOption(option)
}

// 监听 scoreTrend 变化重新渲染图表
watch(scoreTrend, () => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  nextTick(() => {
    initTrendChart()
  })
})

// 请求近十次信用分变化数据
const fetchScoreTrend = async () => {
  try {
    const res = await axios.get(`http://localhost:8086/record/${userId}/10`)

    if (!res.data.data || res.data.data.length === 0) {
      scoreTrend.value = []
      if (chartInstance) {
        chartInstance.clear()
        chartInstance.setOption({
          title: {
            text: '暂无信用分变化数据',
            left: 'center',
            top: 'middle',
            textStyle: { fontSize: 16, color: '#999' }
          }
        })
      }
      return
    }
    if (res.data.code === 1 && Array.isArray(res.data.data)) {
      // 按时间降序（最新到最早）
      const sortedRecordsDesc = res.data.data.sort((a, b) => new Date(b.finishTime) - new Date(a.finishTime))
      const scores = []
      let cumulativeScore = totalScore.value // 从当前总分开始
      // 从最新往最早计算每次的总分
      for (const record of sortedRecordsDesc) {
        scores.push({
          date: record.finishTime.split('T')[0],
          score: cumulativeScore
        })
        cumulativeScore -= record.changeCredit // 减去这次变动，得到上一时刻的分数
      }
      // 反转顺序，保证时间升序（从最早到最新）
      scoreTrend.value = scores.reverse()
    } else {
      console.error('获取信用分变化数据失败:', res.data.msg)
    }
  } catch (error) {
    console.error('请求信用分变化接口失败:', error)
  }
}


onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8086/credit/dimensions/${userId}`)
    if (res.data.code === 1) {
      const data = res.data.data
      const dims = data.filter(d => d.dimensionType !== '总信用分')
      const total = data.find(d => d.dimensionType === '总信用分')

      // 分配维度图标 + 坐标
      dimensionItems.value = dims.map((item, index) => ({
        ...item,
        icon: iconMap[item.dimensionType] || '',
        position: positions[index] || 'top-left',
      }))

      // 设置总分数
      totalScore.value = total?.dimensionScore ?? 0

      // 设置总分描述
      totalDesc.value = total?.dimensionDesc ?? '暂无描述，过段时间再来看看吧~'

    }
  } catch (err) {
    console.error('获取维度数据失败', err)
  }

  //加载排行榜数据
  fetchRankList()
  fetchUserRank()
  //折线图数据
  fetchScoreTrend()
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
  background-color: #c9d7e8;
  padding: 10px;
  height: calc(100vh - 60px);
  overflow: auto;
}

/* 主区域横向分栏 */
.main-flex {
  display: flex;
  gap: 20px;
  height: 100%;
}

/* 左右卡片分栏 */
.score-card {
  flex: 1;
  background: #eee1f7;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
  padding: 20px;
  box-sizing: border-box;
}

.rank-card {
  display: flex;
  flex-direction: column;
  /* 保持已有样式 */
  flex: 1;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
  padding: 20px;
  box-sizing: border-box;
}

/* 排行榜滚动容器撑满剩余高度 */
.rank-scrollbar {
  flex: 1;
  overflow: hidden;
  /* 用 el-scrollbar 自带滚动，不显示默认滚动条 */
}

.rank-scrollbar>>>.el-scrollbar__wrap {
  height: 100% !important;
  /* el-scrollbar 内部内容撑满容器高度 */
}

/* 分数构成样式 */
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

/* 排行榜样式 */
.rank-header {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 16px;
  text-align: center;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
}

.rank-index {
  width: 40px;
  font-weight: bold;
  text-align: center;
  font-size: 16px;
}

.rank-name {
  flex: 1;
  margin-left: 12px;
  font-size: 16px;
  color: #606266;
}

.rank-score {
  font-size: 16px;
  color: #303133;
  font-weight: bold;
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

.user-credit-info {
  position: sticky;
  bottom: 10px;
  margin-top: 16px;
  background: #e6f0ff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  border-radius: 12px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  /* 悬浮且不遮挡滚动条 */
  z-index: 10;
}

.user-info-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-name {
  font-weight: 600;
  color: #1f2d3d;
  font-size: 16px;
}

.user-rank-score {
  margin-top: 4px;
  font-size: 14px;
  color: #3a5bbf;
}

.user-rank-score span {
  font-weight: bold;
}
</style>
