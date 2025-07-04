<template>
  <div class="detail-page">
    <el-card class="detail-card" shadow="never">
      <!-- ① 叉号 -->
      <div class="close-wrapper" @click="goBack">
        <el-icon><Close /></el-icon>
      </div>
      <!-- Header 区域 -->
      <div class="header">
        <div class="header-img-wrapper">
          <el-image :src="`/${hotel?.img}`" fit="cover" class="main-img" />
          <img
            v-if="selectedRoom"
            :src="`/${selectedRoom.img}`"
            alt="房型缩略"
            class="room-thumb"
          />
        </div>
        <div class="header-info">
          <h2>{{ hotel?.hotelName }}</h2>
          <el-rate :model-value="hotel?.score" disabled show-score />
          <p class="location">
            <el-icon><Location /></el-icon>
            {{ hotel?.location }}
          </p >
        </div>
      </div>

      <!-- 预订表单 + 预测小图表 -->
      <div class="booking-panel">
        <div class="left">
          <el-form label-width="80px">
            <el-form-item label="入住日期">
              <el-date-picker
                v-model="checkInDate"
                type="date"
                placeholder="选择入住日期"
                :disabled-date="disabledDate"
              />
              <el-text style="margin-left: 20px; color:red; font-size:13px;">
                时间限制：未来半年
              </el-text>
            </el-form-item>
            <el-form-item label="房型选择">
              <el-select v-model="selectedTypeId" placeholder="选择房型">
                <el-option
                  v-for="rt in roomTypes"
                  :key="rt.typeId"
                  :label="`${rt.typeName} – ¥${rt.price}`"
                  :value="rt.typeId"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :disabled="!checkInDate"
                @click="openBooking"
              >
                立即预订
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="right">
          <el-card class="forecast-card" shadow="never">
            <p>入住率预测</p >
            <div
              v-if="forecastDates.length"
              ref="smallChart"
              class="small-chart"
              @click="showDialog = true"
            ></div>
            <div v-else class="placeholder-chart">暂无预测</div>
          </el-card>
        </div>
      </div>

      <!-- 房型详情 -->
      <div class="room-detail" v-if="selectedRoom">
        <el-card shadow="hover">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-image
                :src="`/${selectedRoom.img}`"
                fit="cover"
                class="room-img"
              />
            </el-col>
            <el-col :span="16">
              <h3>{{ selectedRoom.typeName }}</h3>
              <p>{{ selectedRoom.detail }}</p >
              <p>价格：¥{{ selectedRoom.price }}</p >
              <p>押金：¥{{ selectedRoom.deposit }}</p >
              <p>剩余可订：{{ selectedRoom.capacity }} 间</p >
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-card>

    <!-- 预订弹窗 -->
    <HotelOrderDialog
      v-model="bookingDialogVisible"
      :hotel="hotel"
      :room-type="selectedRoom"
      :check-in-date="checkInDate"
      @confirm="confirmBooking"
    />

    <!-- 放大图对话框 -->
    <el-dialog
      v-model="showDialog"
      title="未来 7 天入住率预测"
      width="60%"
      :destroy-on-close="false"
    >
      <div ref="bigChart" class="big-chart"></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { getHotelById } from '../../api/hotel'
import { getRoomTypesByHotel } from '../../api/roomType'
import { getOccupancyForecast } from '../../api/forecast'
import type { Hotel } from '../../entity/Hotel'
import type { RoomType } from '../../entity/RoomType'
import HotelOrderDialog from './HotelOrderDialog.vue'
import { Location, Close } from '@element-plus/icons-vue'

// 路由 & 回退
const route = useRoute()
const router = useRouter()
const hotelId = Number(route.params.hotelId)
function goBack() {
  router.back()
}

// 核心数据
const hotel = ref<Hotel | null>(null)
const roomTypes = ref<RoomType[]>([])
const selectedTypeId = ref<number | null>(null)
const checkInDate = ref<Date | null>(null)
const bookingDialogVisible = ref(false)

// 预测相关
const forecastDates = ref<string[]>([])
const forecastValues = ref<number[]>([])
const showDialog = ref(false)
const smallChart = ref<HTMLDivElement>()
const bigChart = ref<HTMLDivElement>()
let smallEchart: echarts.ECharts | null = null
let bigEchart: echarts.ECharts | null = null

// 选中房型
const selectedRoom = computed(
  () => roomTypes.value.find(r => r.typeId === selectedTypeId.value) || null
)

// 加载酒店及房型
async function loadData() {
  hotel.value = await getHotelById(hotelId)
  roomTypes.value = await getRoomTypesByHotel(hotelId)
  if (roomTypes.value.length) {
    selectedTypeId.value = roomTypes.value[0].typeId
  }
}

// 预订弹窗
function openBooking() {
  bookingDialogVisible.value = true
}
function confirmBooking() {
  bookingDialogVisible.value = false
  console.log('确认预订')
}

// 禁选日期：今天 ~ 半年后
function disabledDate(date: Date) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setMonth(end.getMonth() + 6)
  end.setHours(23, 59, 59, 999)
  return date < start || date > end
}

// 监听日期 & 酒店变化，拉取预测
watch(
  [() => checkInDate.value, () => hotelId],
  async ([d]) => {
    if (!d) return
    const currentDate = dayjs(d).format('YYYY-MM-DD')
    const data = await getOccupancyForecast(hotelId, currentDate)
    forecastDates.value = Object.keys(data)
    forecastValues.value = Object.values(data)
    await nextTick()
    renderSmallChart()
  },
  { immediate: true }
)

// 渲染“小折线图”
function renderSmallChart() {
  if (!smallChart.value) return
  if (!smallEchart) {
    smallEchart = echarts.init(smallChart.value)
  }
  smallEchart.setOption({
    xAxis: { data: forecastDates.value, show: false, boundaryGap: false },
    yAxis: { show: false },
    series: [
      {
        type: 'line',
        data: forecastValues.value,
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#409EFF' }
      }
    ],
    grid: { left: 0, right: 0, top: 0, bottom: 0 }
  })
}

// 监听 showDialog 打开／关闭
watch(showDialog, async open => {
  if (!open) return;           // 只处理打开情况
  await nextTick();            // 等 DOM 真正渲染完成

  if (!bigChart.value) return; // 容器不存在就算了

  if (!bigEchart) {
    // 第一次打开，初始化
    bigEchart = echarts.init(bigChart.value);
  } else {
    // 后面每次打开，强制重新调整大小
    bigEchart.resize();
  }

  // 重新设置（或更新）配置项
  bigEchart.setOption({
    title: { text: '未来 7 天入住率预测', left: 'center' },
    tooltip: { trigger: 'axis', formatter: '{b}<br/>{c}%' },
    xAxis: {
      type: 'category',
      data: forecastDates.value,
      axisLabel: { rotate: 45 }
    },
    yAxis: { type: 'value', axisLabel: { formatter: '{value} %' } },
    series: [{
      name: '入住率',
      type: 'line',
      data: forecastValues.value.map(value => value * 100), // 将数据乘以100
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2, color: '#67C23A' }
    }],
    grid: { left: '10%', right: '10%', top: '15%', bottom: '15%' }
  });
})

onMounted(loadData)
</script>

<style scoped lang="scss">
.detail-page {
  padding: 24px;
}
.detail-card {
  position: relative;
  background-color: #fbfbf6;
  .close-wrapper {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--card-bg);
    border-radius: 50%;
    box-shadow: var(--shadow);
    cursor: pointer;
    .el-icon {
      font-size: 29px;
      color: #cf3036;
    }
  }
}
.header {
  display: flex;
  margin-bottom: 16px;
  .header-img-wrapper {
    position: relative;
    width: 40%;
    height: 280px;
    overflow: hidden;
    .main-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .room-thumb {
      position: absolute;
      right: 12px;
      bottom: 12px;
      width: 120px;
      height: 80px;
      object-fit: cover;
      border: 2px solid var(--card-bg);
      box-shadow: var(--shadow);
      border-radius: 4px;
    }
  }
  .header-info {
    padding: 0 24px;
    h2 {
      margin: 0 0 8px;
      color: var(--primary-color);
    }
    .el-rate {
      margin-bottom: 8px;
    }
    .location {
      color: #909399;
    }
  }
}
.booking-panel {
  display: flex;
  margin-bottom: 24px;
  .left {
    flex: 1;
    .el-form-item {
      margin-bottom: 16px;
    }
  }
  .right {
    width: 240px;
    .forecast-card {
      text-align: center;
      p {
        margin-bottom: 8px;
      }
      .small-chart {
        width: 100%;
        height: 120px;
        cursor: pointer;
      }
      .placeholder-chart {
        height: 120px;
        background: #f5f7fa;
        border-radius: 4px;
        line-height: 120px;
        color: #c0c4cc;
      }
    }
  }
}
.room-detail {
  .room-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
  }
}
/* 放大弹窗大图 */
.big-chart {
  width: 100%;
  height: 400px;
}
</style>