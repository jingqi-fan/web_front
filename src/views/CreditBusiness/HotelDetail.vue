<!-- src/views/HotelDetail.vue -->
<template>
  <div class="detail-page">
    <el-card class="detail-card" shadow="never">
      <!-- ① 叉号：绝对定位在卡片右上 -->
      <div class="close-wrapper" @click="goBack">
        <el-icon><Close /></el-icon>
      </div>
      <!-- Header 区域：酒店主图 + 叉号 + 房型 Thumb -->
      <div class="header">
        <div class="header-img-wrapper">
          <el-image
            :src="`/${hotel?.img}`"
            fit="cover"
            class="main-img"
          />
          <!-- 右下角房型缩略图 -->
          <img
            v-if="selectedRoom"
            :src="`/${selectedRoom.img}`"
            alt="房型图"
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

      <!-- 预订表单：入住日期 + 房型选择 + 立即预订按钮 -->
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
              <el-text style="margin-left: 20px ; color:red; font-size: 13px;">时间限制：未来半年</el-text>
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
            <!-- 新增：立即预订按钮 -->
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
          <el-card class="forecast-card">
            <p>入住率预测（开发中）</p >
            <div class="placeholder-chart">图表区域</div>
          </el-card>
        </div>
      </div>

      <!-- 房型详情卡片 -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHotelById } from '../../api/hotel'
import { getRoomTypesByHotel } from '../../api/roomType'
import type { Hotel } from '../../entity/Hotel'
import type { RoomType } from '../../entity/RoomType'
import HotelOrderDialog from './HotelOrderDialog.vue'
import { Location, Close } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const hotelId = Number(route.params.hotelId)

const hotel = ref<Hotel | null>(null)
const roomTypes = ref<RoomType[]>([])
const selectedTypeId = ref<number | null>(null)
const checkInDate = ref<Date | null>(null)

// 控制预订弹窗显示
const bookingDialogVisible = ref(false)

const selectedRoom = computed(
  () => roomTypes.value.find(r => r.typeId === selectedTypeId.value) || null
)

async function loadData() {
  hotel.value = await getHotelById(hotelId)
  roomTypes.value = await getRoomTypesByHotel(hotelId)
  if (roomTypes.value.length) {
    selectedTypeId.value = roomTypes.value[0].typeId
  }
}

function goBack() {
  router.back()
}

// 打开预订弹窗
function openBooking() {
  bookingDialogVisible.value = true
}

// 确认预订（具体逻辑待实现）
function confirmBooking() {
  // TODO: 提交预订请求
  bookingDialogVisible.value = false
  console.log('收到预订事件')
  // 可根据需求清空或保留状态
}

// 入住日期可选范围：今天 ~ 半年后
 function disabledDate(date: Date) {
  // 今天 00:00:00
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  // 半年后的 23:59:59.999
  const end = new Date(start)
  end.setMonth(end.getMonth() + 6)
  end.setHours(23, 59, 59, 999)
  return date < start || date > end
}

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
  
  /* 缩小图标尺寸 */
  .el-icon {
    font-size: 29px;
    color: #cf3036;
  }
}
}


/* Header */
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

/* 预订表单 */
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

/* 房型详情 */
.room-detail {
  .room-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
  }
}
</style>