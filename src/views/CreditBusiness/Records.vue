<template>
  <div class="records-page">
    <!-- 顶部返回 -->
    <div class="records-header">
      <el-button type="text" @click="goBack">
        <el-icon
          style="font-size: 32px; border-radius: 50%; background: var(--card-bg);
                 box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15); padding: 5px; cursor: pointer;"
        >
          <ArrowLeftBold />
        </el-icon>
      </el-button>
      <h2>预订记录</h2>
    </div>

    <!-- Tabs 切换 -->
    <el-tabs v-model="activeTab" @tab-click="onTabClick">
      <el-tab-pane label="信用购物"  name="shopping" />
      <el-tab-pane label="信用租房"  name="rental" />
      <el-tab-pane label="酒店预订"  name="hotel" />
    </el-tabs>

    <!-- 表格内容 -->
    <div class="records-content">
      <el-table
        v-if="activeTab === 'hotel'"
        :data="hotelRecords"
        stripe
        style="width: 100%;"
      >
        <!-- 1. 订单号 -->
        <el-table-column
          prop="orderId"
          label="订单号"
          width="80"
        />

        <!-- 原有列 -->
        <el-table-column
          prop="bookDate"
          label="预订日期"
          :formatter="formatDate"
        />
        <el-table-column prop="hotelName" label="酒店名称" />
        <el-table-column prop="typeName"  label="房型" />
        <el-table-column prop="price"     label="总价" />
        <el-table-column
          prop="checkinDate"
          label="入住日期"
          :formatter="formatDate"
        />
        <el-table-column
          prop="checkoutDate"
          label="截止日期"
          :formatter="formatDate"
        />

        <!-- 支付状态 -->
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

        <!-- 2. 守约状态 细化 -->
        <el-table-column label="守约状态" width="140">
          <template #default="{ row }">
            <span v-if="row.promise === 0">{{ formatRemainingDays(row) }}</span>
            <span v-else-if="row.promise === 1">守约</span>
            <span v-else-if="row.promise === 2">逾期{{ formatOverdueDays(row) }}天</span>
          </template>
        </el-table-column>

        <!-- 3. 取消预订 -->
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button
              v-if="row.isPay === 0 && isBeforeCheckin(row.checkinDate)"
              type="danger"
              size="mini"
              @click="handleCancel(row)"
            >
              取消预订
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 支付弹窗 -->
    <HotelPay
      v-if="selectedReservation"
      v-model="isHotelPayVisible"
      :reservation="selectedReservation"
      @success="onPaymentSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { useUserInfoStore } from '../../stores/useUserInfoStore'
import {
  getReservationsByUserId,
  repayReservation,
  cancelReservation
} from '../../api/hotelReservation'
import { getHotelById } from '../../api/hotel'
import { getRoomTypesByHotel } from '../../api/roomType'
import type { HotelReservation } from '../../entity/HotelReservation'
import type { Hotel } from '../../entity/Hotel'
import type { RoomType } from '../../entity/RoomType'
import HotelPay from './HotelPay.vue'

// 路由 & 返回
const router = useRouter()
function goBack() {
  router.back()
}

// Tabs 与数据
const activeTab = ref<'shopping'|'rental'|'hotel'>('hotel')
const hotelRecords = ref<(HotelReservation & {
  hotelName: string
  typeName: string
})[]>([])

// 支付弹窗控制
const isHotelPayVisible   = ref(false)
const selectedReservation = ref<HotelReservation & {
  hotelName: string; typeName: string
} | null>(null)

/** 拉取并补全记录 **/
async function loadHotelRecords() {
  const uid = useUserInfoStore().user.id
  const raw = await getReservationsByUserId(uid)
  raw.sort((a,b) => b.bookDate.localeCompare(a.bookDate))
  hotelRecords.value = await Promise.all(
    raw.map(async rec => {
      const hotel = await getHotelById(rec.hotelId)
      const types = await getRoomTypesByHotel(rec.hotelId)
      const rt = types.find(t => t.typeId === rec.typeId)
      return {
        ...rec,
        hotelName: hotel.hotelName,
        typeName: rt?.typeName || '未知房型'
      }
    })
  )
}

// Tabs 切换
function onTabClick(tab: any) {
  if (tab.name === 'hotel') loadHotelRecords()
}

// 初始化
onMounted(() => {
  if (activeTab.value === 'hotel') loadHotelRecords()
})

/** 打开还款弹窗 **/
function handleRepay(row: typeof selectedReservation.value) {
  selectedReservation.value = row
  isHotelPayVisible.value  = true
}

/** 支付完成 **/
function onPaymentSuccess() {
  isHotelPayVisible.value = false
  ElMessage.success('还款成功')
  loadHotelRecords()
}

/** 取消预订 **/
async function handleCancel(
  row: HotelReservation & { hotelName: string; typeName: string }
) {
  try {
    await ElMessageBox.confirm(
      `确定要取消该酒店预订吗？    订单号：${row.orderId} `,
      '取消确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await cancelReservation(row.orderId)
    ElMessage.success('取消预订成功')
    loadHotelRecords()
  } catch (err: any) {
    // 用户取消或出错都静默处理
    if (err !== 'cancel') {
      ElMessage.error('取消预订失败：' + (err.message || err))
    }
  }
}

/** 工具：格式化 YYYY-MM-DD **/
function formatDate(_: any, __: any, value: string) {
  return value ? value.split(' ')[0] : ''
}

/** 计算两个日期差，向上取整 **/
function diffDays(late: string, early: string) {
  const dLate  = new Date(late.split(' ')[0]).getTime()
  const dEarly = new Date(early.split(' ')[0]).getTime()
  return Math.ceil((dLate - dEarly) / (1000 * 3600 * 24))
}

/** 剩余天数 **/
function formatRemainingDays(row: any) {
  const today = new Date().toISOString().split('T')[0]
  return `剩余${diffDays(row.checkoutDate, today)}天`
}
/** 逾期天数 **/
 function formatOverdueDays(row: { checkoutDate: string; payDate?: string }) {
  // 截取日期部分（YYYY-MM-DD）
  const baseDate = row.payDate
    ? row.payDate.split('T')[0]
    : new Date().toISOString().split('T')[0];
  return diffDays(baseDate, row.checkoutDate);
}

/** 检查是否在入住日期之前 **/
function isBeforeCheckin(checkin: string) {
  const today = new Date().toISOString().split('T')[0]
  return new Date(today).getTime() < new Date(checkin.split(' ')[0]).getTime()
}
</script>

<style scoped>
.records-page    { padding: 24px; }
.records-header  { display: flex; align-items: center; margin-bottom: 16px; }
.records-header h2 { flex: 1; text-align: center; margin: 0; }
.records-content { background: #fff; padding: 16px; border-radius: 4px; }
</style>