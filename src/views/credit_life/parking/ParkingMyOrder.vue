<template>
  <div class="reservation-page">
    <!-- 顶部标题栏 -->
    <el-header class="top-bar">
      <el-button type="text" :icon="Back" @click="goBack" >返回</el-button>
      <div class="title">我的预约</div>
      <div class="right-actions">
        <el-button type="text" :icon="Refresh" @click="refreshList" />
        <el-dropdown>
          <el-avatar :src="user.profilePicture" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToProfile">个人中心</el-dropdown-item>
              <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 筛选区域 -->
    <div class="filter-area">
      <el-date-picker
          v-model="filter.date"
          type="date"
          placeholder="选择日期"
          value-format="YYYY-MM-DD"
          style="width: 160px"
      />
      <el-select v-model="filter.status" placeholder="预约状态" style="width: 160px">
        <el-option label="全部" value="" />
        <el-option label="预约" :value="0" />
        <el-option label="待使用" :value="1" />
        <el-option label="使用中" :value="2" />
        <el-option label="已完成" :value="3" />
      </el-select>
    </div>

    <!-- 列表区域 -->
    <el-main class="list-area">
      <el-card
          v-for="item in filteredList"
          :key="item.appointmentId"
          class="reservation-card"
      >
        <div class="card-wrapper">
          <div class="card-left">
            <div class="lot-title">
              {{ item.title }}
              <el-tag :type="statusTagType(item.tag)" size="small" effect="plain">
                {{ statusMap[Number(item.tag)] }}
              </el-tag>
            </div>
            <div class="time">{{ item.appointTimeStr }}</div>
            <div class="slot">车位编号：{{ item.spaceNum }}</div>
          </div>
          <div class="card-right">
            <el-button
                v-if="Number(item.tag) === 0"
                size="small"
                type="success"
                @click="startUse(item.appointmentId)"
            >开始使用</el-button>

            <el-button
                v-if="Number(item.tag) === 1"
                size="small"
                type="danger"
                @click="leave(item.appointmentId)"
            >离开停车场</el-button>

            <el-button
                v-if="Number(item.tag) === 2 || Number(item.tag) === 4"
                size="small"
                type="primary"
                @click="pay(item)"
            >支付费用</el-button>

            <el-tag
                v-if="Number(item.tag) === 3"
                type="info"
                size="small"
            >已完成</el-tag>
            <el-tag
                v-if="Number(item.tag) === 4"
                type="info"
                size="small"
            >已过期</el-tag>
          </div>
        </div>
      </el-card>

    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Back,
  Refresh,
} from '@element-plus/icons-vue'
import { useUserInfoStore } from '@/stores/useUserInfoStore'
import {getAppointmentList, leaveParking, startParkingUse} from "@/api/life/parking_api.ts";
import type {AppointmentListRes} from "@/api/life/parking_type.ts";
import {ElMessage} from "element-plus";
import router from "@/router";
import {useParkingOrderPayStore} from "@/stores/useParkingOrderPayStore.ts";

const userStore = useUserInfoStore()
const user = userStore.user

const goBack = () => history.back()
const goToProfile = () => console.log('跳转到个人中心')
const logout = () => console.log('退出登录')
const refreshList = () => console.log('刷新预约列表')

const reservationList = ref<AppointmentListRes[]>([])

const userInfoStore=useUserInfoStore()
const userInfo=userInfoStore.user
const loadAppointmentList=async ()=>{
  const res:AppointmentListRes[]=await getAppointmentList(userInfo.id)
  console.log("预约列表：",res)
  reservationList.value=res
}
loadAppointmentList()

// 筛选状态
const filter = ref({
  date: '',
  status: '',
})


const statusMap = ['待使用', '使用中', '已使用', '已完成', '已过期']
const statusTagType = (status: string) =>
    ['warning', 'success', 'primary', 'info','info'][Number(status)]

// 筛选后的列表
const filteredList = computed(() =>
    reservationList.value.filter((item) => {
      const matchStatus =
          filter.value.status === '' || item.tag === filter.value.status
      const matchDate =
          !filter.value.date || item.appointTimeStr.startsWith(filter.value.date)
      return matchStatus && matchDate
    })
)

// 操作按钮事件
const startUse =async (id: number) => {
  const res=await startParkingUse(id)
  if(res.code!==200){
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success("开始使用成功")
  await loadAppointmentList()
}
const pay = (item: AppointmentListRes) => {
  const parkingOrderPayStore=useParkingOrderPayStore()
  parkingOrderPayStore.setPay(item)
  router.push(`/parking/order/detail/${item.appointmentId}`)
}
const leave =async (id: number) => {
  const res=await leaveParking(id)
  ElMessage.success("离开停车场成功")
  await loadAppointmentList()
}
</script>

<style scoped lang="scss">
.reservation-page {
  min-height: 98vh;
  background: #f5f5f5;
}
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
  .title {
    font-size: 18px;
    font-weight: bold;
  }
  .right-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
.filter-area {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.list-area {
  padding: 16px;
  height: 600px;
  overflow-y: auto;
}

.demo-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.reservation-card {
  margin-bottom: 16px; // ✅ 条目间距
  border-radius: 10px;
  box-shadow: 0 0 10px var(--el-border-color-light);

  .card-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    height: auto;
  }

  .card-left {
    flex: 1;

    .lot-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .time, .slot {
      font-size: 14px;
      color: #666;
      margin-bottom: 4px;
    }
  }

  .card-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: 8px; // ✅ 多按钮换行间距
    min-width: 120px;
  }
}

</style>
