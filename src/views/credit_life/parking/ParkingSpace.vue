<template>
  <div class="parking-slot-page">
    <!-- 顶部标题栏 -->
    <el-header class="top-bar">
      <el-button type="text" :icon="Back" @click="goBack" >返回</el-button>
      <div class="header-center">
        <div class="title">{{ lotBasicInfo?.parkingLotName }}</div>
        <div class="subtitle"><el-icon><LocationInformation /></el-icon> {{ lotBasicInfo?.parkingLotLocation }}</div>
      </div>
      <div class="available-count">可用车位：{{ lotBasicInfo?.leftCount }}</div>
    </el-header>

    <!-- 内容区域 -->
    <el-main class="main-content">
      <div class="section-title">请选择车位</div>
      <!-- 车位选择图 -->
      <div class="slot-grid">
        <div class="slot-row entrance">入口</div>
        <div class="slot-row-content">
          <div v-for="slot in layout" :key="slot.key" :class="['slot-box', slot.status, { selected: selectedSlot?.spaceId === slot.spaceId }]"
               :style="slot.style" @click="selectSlot(slot)">
            {{ slot.label }}
          </div>
        </div>
        <div class="slot-row exit">出口</div>
      </div>

      <div class="section-title">请选择预约时间</div>
      <!-- 时间段选择 -->
      <el-form :model="form" :rules="rules" ref="formRef" class="time-form" label-width="80px">
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
              v-model="form.startTime"
              type="datetime"
              placeholder="选择开始时间"
              value-format="x"
              format="YYYY-MM-DD HH"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="选择结束时间"
              value-format="x"
              format="YYYY-MM-DD HH"
          />
        </el-form-item>
      </el-form>

      <!-- 提交按钮 -->
      <el-button type="primary" class="submit-btn" @click="submit">提交预约</el-button>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import {getParkingLotInfo, getParkingSpaces, savePreOrderInfo} from '@/api/life/parking_api'
import type {ParkingLots, ParkingPreOrderInfoReq, ParkingPreOrderInfoRes} from "@/api/life/parking_type.ts";
import {Back, LocationInformation} from "@element-plus/icons-vue";
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";
import {useParkingSpacePreorderStore} from "@/stores/useParkingSpacePreorderStore.ts";
import router from "@/router";

const route = useRoute()
const parkingId = Number(route.params.id)

const availableCount = ref(0)

const formRef = ref()
const form = reactive({
  startTime: '',
  endTime: '',
})
const rules = {
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
}

const selectedSlot = ref<any>(null)
const selectSlot = (slot: any) => {
  if (slot.status === 'free') {
    selectedSlot.value = slot
  }
}

const lotBasicInfo=ref<ParkingLots>()
const loadParkingLotBasicInfo=async ()=>{
  const res:ParkingLots=await getParkingLotInfo(parkingId)
  console.log(res)
  lotBasicInfo.value=res
  console.log(lotBasicInfo.value)
}
loadParkingLotBasicInfo()

const spaceList = ref<any[]>([])
const layout = ref<any[]>([])

const loadParkingLotInfo = async () => {
  const res = await getParkingSpaces(parkingId)
  spaceList.value = res
  console.log("加载的车位数据",res)
  availableCount.value = res.filter((s: any) => s.spaceStatus === 0).length
  generateLayout()
}

const mapStatus = (status: number): string => {
  return ['free', 'occupied', 'maintenance', 'reserved'][status] || 'free'
}

const findSpace = (number: string) => {
  return spaceList.value.find((s) => s.spaceNumber.endsWith(number))
}

const generateLayout = () => {
  const styleBase = (row: number, col: number, rowSpan = 1, colSpan = 1) => ({
    gridRow: `${row} / span ${rowSpan}`,
    gridColumn: `${col} / span ${colSpan}`
  })
  layout.value = [
    { key: 'channel-1', label: '通道', style: styleBase(2, 1, 3), status: 'maintenance' },
    { key: 'A01', label: 'A01', style: styleBase(2, 2), ...findSpace('2-01') },
    { key: 'B03', label: 'B03', style: styleBase(5, 2), ...findSpace('2-06') },
    { key: 'B06', label: 'B06', style: styleBase(6, 2), ...findSpace('2-09') },
    { key: '通道-2', label: '通道', style: styleBase(2, 3), status: 'maintenance' },
    { key: 'A03', label: 'A03', style: styleBase(3, 3), ...findSpace('2-03') },
    { key: 'B01', label: 'B01', style: styleBase(4, 3), ...findSpace('2-05') },
    { key: 'B04', label: 'B04', style: styleBase(5, 3), ...findSpace('2-07') },
    { key: 'B07', label: 'B07', style: styleBase(6, 3), ...findSpace('2-10') },
    { key: 'A02', label: 'A02', style: styleBase(2, 4), ...findSpace('2-02') },
    { key: 'A04', label: 'A04', style: styleBase(3, 4), ...findSpace('2-04') },
    { key: '通道-3', label: '通道', style: styleBase(4, 4, 3), status: 'maintenance' },
    { key: '通道-4', label: '通道', style: styleBase(2, 5), status: 'maintenance' },
    { key: 'A05', label: 'A05', style: styleBase(3, 5), ...findSpace('2-08') },
    { key: 'B02', label: 'B02', style: styleBase(4, 5), ...findSpace('2-11') },
    { key: 'B05', label: 'B05', style: styleBase(5, 5), ...findSpace('2-12') },
    { key: '通道-5', label: '通道', style: styleBase(6, 5), status: 'maintenance' },
  ].map(item => ({
    ...item,
    status: item.status || mapStatus(item.spaceStatus || 0)
  }))
}
const userInfoStore = useUserInfoStore()
const userInfo = userInfoStore.user

const submit = async () => {
  const valid = await formRef.value.validate()
  if (!selectedSlot.value) {
    ElMessage.warning('请选择一个可用车位')
    return
  }
  if (valid) {
    try {
      if (!selectedSlot.value?.spaceNumber) {
        ElMessage.warning('请选择有效车位')
        return
      }

      const req:ParkingPreOrderInfoReq={
        lotId: Number(parkingId),
        spaceNum: selectedSlot.value.spaceNumber,
        startTime: Number(form.startTime),
        endTime: Number(form.endTime)
      }
      console.log("请求参数",req)
      const res:ParkingPreOrderInfoRes = await savePreOrderInfo(req, userInfo.id)
      const parkingSpacePreorderStore=useParkingSpacePreorderStore()
      parkingSpacePreorderStore.setPreorder(res)
      await router.push('/parking/order/confirm/pre')

      ElMessage.success('请确认预约信息')
    } catch (e) {
      ElMessage.error('提交失败，请稍后再试')
    }
  }
}


const goBack = () => history.back()

loadParkingLotInfo()
</script>


<style scoped lang="scss">
.parking-slot-page {
  background: #f9f9f9;
  min-height: 100vh;
}
.section-title {
  font-weight: bold;
  font-size: 16px;
  margin: 20px 0 10px;
  color: #333;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  .header-center {
    text-align: center;
    .title {
      font-weight: bold;
    }
    .subtitle {
      font-size: 12px;
      color: #888;
    }
  }
  .available-count {
    font-size: 14px;
    color: #67C23A;
  }
}

.main-content {
  padding: 20px;
}
.slot-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  .slot-row {
    text-align: center;
    padding: 10px;
    font-weight: bold;
    background: #ecf5ff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, .1);
  }
  .slot-row-content {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 50px);
    gap: 6px;
  }
  .slot-box {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    &.free {
      background: #e1f3d8;
      color: #67C23A;
    }
    &.occupied {
      background: #fde2e2;
      color: #F56C6C;
      cursor: not-allowed;
    }
    &.maintenance {
      background: #f4f4f5;
      color: #909399;
      cursor: not-allowed;
    }
    &.reserved {
      background: #fdf6ec;
      color: #e6a23c;
      cursor: not-allowed;
    }
    &.selected {
      border: 2px solid #409EFF;
    }
  }
}
.time-form {
  margin-bottom: 24px;
}
.submit-btn {
  width: 100%;
}
</style>
为什么现在的状态是车位全选的