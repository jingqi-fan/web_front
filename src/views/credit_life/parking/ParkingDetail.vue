<template>
  <div class="parking-detail">
    <div class="header">
      <h2>{{ lotInfo?.parkingLotName }}</h2>
      <p>{{ lotInfo?.parkingLotLocation }}</p>
      <p>类型：{{ formatType(lotInfo?.parkingLotType) }} | 总车位：{{ lotInfo?.totalSpaces }} | 剩余：{{ lotInfo?.leftCount }}</p>
    </div>

    <el-divider />

    <div class="space-list">
      <h3>车位列表</h3>
      <el-table :data="spaces" border>
        <el-table-column prop="spaceNumber" label="车位编号" />
        <el-table-column prop="spaceType" label="类型" :formatter="formatSpaceType" />
        <el-table-column prop="spaceStatus" label="状态" :formatter="formatSpaceStatus" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" :disabled="row.spaceStatus !== 0" @click="openPreOrder(row)">预约</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="预约停车">
      <el-form :model="preOrder" label-width="100px">
        <el-form-item label="预约时间">
          <el-date-picker v-model="timeRange" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPreOrder">预下单</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getParkingLotInfoById, getSpaces, savePreOrderInfo } from '@/api/life/park.ts'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const lotId = Number(route.params.lotId)
const userId = 1 // 假设为登录用户ID

const lotInfo = ref<any>()
const spaces = ref<any[]>([])
const dialogVisible = ref(false)
const selectedSpace = ref<any>(null)
const timeRange = ref<[Date, Date]>()

const preOrder = ref({
  lotId,
  spaceNum: '',
  startTime: 0,
  endTime: 0
})

const formatType = (type: number) => ['默认', '市中心', '商业区', '住宅区', '旅游区', '医院', '室内', '室外', '露天', '地下'][type] || '未知'
const formatSpaceType = (row: any) => ['普通', '残疾人', '充电'][row.spaceType] || '-'
const formatSpaceStatus = (row: any) => ['空闲', '占用', '维护中', '已预约'][row.spaceStatus] || '-'

const fetchData = async () => {
  const lotRes = await getParkingLotInfoById(lotId)
  if (lotRes.code === 200) lotInfo.value = lotRes.data

  const spaceRes = await getSpaces(lotId)
  if (spaceRes.code === 200) spaces.value = spaceRes.data
}

const openPreOrder = (space: any) => {
  selectedSpace.value = space
  timeRange.value = undefined
  dialogVisible.value = true
}

import { useParkingOrderStore } from '@/stores/useParkingOrderStore.ts'

const parkingOrderStore = useParkingOrderStore()

const submitPreOrder = async () => {
  if (!timeRange.value) {
    ElMessage.warning('请选择预约时间')
    return
  }
  const [start, end] = timeRange.value
  preOrder.value = {
    lotId,
    spaceNum: selectedSpace.value.spaceNumber,
    startTime: start.getTime(),
    endTime: end.getTime()
  }

  const res = await savePreOrderInfo(preOrder.value, userId)
  if (res.code === 200) {
    ElMessage.success('预下单成功，跳转确认页')
    // ✅ 使用 Pinia 代替 sessionStorage
    parkingOrderStore.setPreOrderInfo(res.data)

    await router.push({
      name: 'ParkingOrderConfirm',
      query: {id: userId, appointmentId: res.data.appointmentId}
    })
  } else {
    ElMessage.error('预下单失败')
  }
}


onMounted(() => fetchData())
</script>
