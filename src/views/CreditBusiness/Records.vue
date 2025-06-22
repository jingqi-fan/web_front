<template>
  <div class="records-page">
    <!-- 顶部返回 -->
    <div class="records-header">
      <el-button type="text" @click="goBack">
        <el-icon style="font-size: 32px; border-radius: 50%; background: var(--card-bg);
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15); padding: 5px; cursor: pointer;">
          <ArrowLeftBold />
        </el-icon>
      </el-button>
      <h2>预订记录</h2>
    </div>

    <!-- 分类 Tabs -->
    <el-tabs v-model="activeTab" @tab-click="onTabClick">
      <el-tab-pane label="信用购物" name="shopping" />
      <el-tab-pane label="信用租房" name="rental" />
      <el-tab-pane label="酒店预订" name="hotel" />
    </el-tabs>

    <!-- 切换内容 -->
    <div class="records-content">
      <!-- 信用购物占位 -->
      <el-table
        v-if="activeTab === 'shopping'"
        :data="[]"
        style="width: 100%"
      >
        <el-table-column label="暂无记录" />
      </el-table>

      <!-- 信用租房占位 -->
      <el-table
        v-else-if="activeTab === 'rental'"
        :data="[]"
        style="width: 100%"
      >
        <el-table-column label="暂无记录" />
      </el-table>

      <!-- 酒店预订记录 -->
      <el-table
        v-else
        :data="hotelRecords"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="bookDate"     label="预订日期"    />
        <el-table-column prop="hotelName"    label="酒店名称"    />
        <el-table-column prop="typeName"     label="房型"        />
        <el-table-column prop="price"        label="总价"        />
        <el-table-column prop="checkinDate"  label="入住日期" :formatter="formatDate"   />
        <el-table-column prop="checkoutDate" label="截止日期" :formatter="formatDate" />

        <!-- 支付状态：未支付时显示按钮，已支付时文字 -->
        <el-table-column label="支付状态" width="120">
          <template #default="{ row }">
            <el-button
              v-if="row.isPay === 0"
              type="warning"
              size="mini"
              @click="handleRepay(row)"
            >
              点击还款
            </el-button>
            <span v-else>已支付</span>
          </template>
        </el-table-column>

        <!-- 守约状态 -->
        <el-table-column
          prop="promise"
          label="守约状态"
          width="100"
          :formatter="formatPromise"
        />
      </el-table>
    </div>

    <!-- 自定义支付弹窗 -->
    <HotelPay
      v-model="isHotelPayVisible"
      v-if="selectedReservation"
      :reservation="selectedReservation"
      @success="onPaymentSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '../../stores/useUserInfoStore'
import { getReservationsByUserId } from '../../api/hotelReservation'
import { getHotelById } from '../../api/hotel'
import { getRoomTypesByHotel } from '../../api/roomType'
import type { HotelReservation } from '../../entity/HotelReservation'
import type { Hotel } from '../../entity/Hotel'
import type { RoomType } from '../../entity/RoomType'
import HotelPay from './HotelPay.vue'

const router = useRouter()
function goBack() {
  router.back()
}

const activeTab = ref<'shopping' | 'rental' | 'hotel'>('hotel')
const hotelRecords = ref<Array<HotelReservation & {
  hotelName: string
  typeName: string
}>>([])

// 自定义支付弹窗状态 & 选中订单
const isHotelPayVisible = ref(false)
const selectedReservation = ref<HotelReservation & {
  hotelName: string
  typeName: string
} | null>(null)

/** 拉取并补全酒店预订记录 */
async function loadHotelRecords() {
  const uid = useUserInfoStore().user.id
  const raw = await getReservationsByUserId(uid)
  // 按预订日期降序
  raw.sort((a, b) => b.bookDate.localeCompare(a.bookDate))

  const enriched = await Promise.all(
    raw.map(async rec => {
      const hotel: Hotel = await getHotelById(rec.hotelId)
      const types: RoomType[] = await getRoomTypesByHotel(rec.hotelId)
      const rt = types.find(t => t.typeId === rec.typeId)
      return {
        ...rec,
        hotelName: hotel.hotelName,
        typeName: rt?.typeName || '未知房型'
      }
    })
  )
  hotelRecords.value = enriched
}

function onTabClick(tab: any) {
  if (tab.name === 'hotel') {
    loadHotelRecords()
  }
}

function formatDate(_: any, __: any, value: string) {
  return value ? value.split(' ')[0] : ''
}

onMounted(() => {
  if (activeTab.value === 'hotel') {
    loadHotelRecords()
  }
})

/** 打开自定义支付弹窗 */
function handleRepay(row: HotelReservation & { hotelName: string; typeName: string }) {
  selectedReservation.value = row
  isHotelPayVisible.value = true
}

/** 支付完成后刷新列表 */
function onPaymentSuccess() {
  isHotelPayVisible.value = false
  ElMessage.success('还款成功')
  loadHotelRecords()
}

/**
 * 守约状态格式化
 * formatter(row, column, cellValue)
 */
function formatPromise(_: any, __: any, value: number) {
  switch (value) {
    case 1: return '守约'
    case 2: return '逾期'
    default: return '未到期'
  }
}
</script>

<style scoped>
.records-page {
  padding: 24px;
}
.records-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.records-header h2 {
  flex: 1;
  text-align: center;
  margin: 0;
}
.records-header .el-button {
  padding: 0;
}
.records-content {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
}
</style>