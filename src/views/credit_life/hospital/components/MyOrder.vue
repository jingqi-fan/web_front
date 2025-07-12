<template>
  <div class="my-appointment">
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-date-picker
          v-model="filterDate"
          type="date"
          placeholder="选择日期"
          style="width: 200px"
      />
      <el-select v-model="filterStatus" placeholder="选择状态" style="width: 200px; margin-left: 20px">
        <el-option v-for="(label, value) in statusMap" :key="value" :label="label" :value="Number(value)" />
      </el-select>
      <el-button @click="filterList" style="margin-left: 20px">筛选</el-button>
      <el-button type="default" @click="resetFilter" style="margin-left: 10px">重置</el-button>
    </div>

    <!-- 预约列表 -->
    <div class="appointment-list">
      <el-card
          v-for="(item, index) in filteredList"
          :key="item.appointmentId"
          class="appointment-item"
          style="margin-top: 20px"
      >
        <div class="appointment-content">
          <div class="left-info">
            <div class="index">#{{ index + 1 }}</div>
            <div class="date">{{ item.createTimeStr }}</div>
            <div class="desc">{{ item.departmentName }} · {{ item.doctorName }}</div>
          </div>
          <div class="right-actions">
            <el-tag
                :class="'tag-status-' + item.status"
                disable-transitions
                :closable="false"
                @click="item.status === 2 && goToPay(item.appointmentId)"
                style="cursor: pointer;"
            >
              {{ statusMap[item.status] }}
            </el-tag>


            <el-button
                v-if="item.status === 0 || item.status === 1"
                type="danger"
                size="small"
                @click="cancel(item.appointmentId)"
            >
              取消预约
            </el-button>

            <el-button
                v-else-if="item.status === 2"
                type="primary"
                size="small"
                @click="goToPay(item.appointmentId)"
            >
              去支付
            </el-button>

            <el-button
                v-else-if="item.status === 3"
                type="default"
                size="small"
                disabled
            >
              已过期
            </el-button>

          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {cancelAppointment, getMyAppointments} from "@/api/life/hospital_api.ts";
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";
import type {MyAppointmentRes} from "@/api/life/hospital_type.ts";
import router from "@/router";

const filterDate = ref('')
const filterStatus = ref<number | ''>('')

const statusMap: Record<number, string> = {
  0: '预下单',
  1: '待就诊',
  2: '已就诊',
  3: '已过期',
  4: '已取消',
  5: '已完成'
}

const userInfoStore=useUserInfoStore()
const userInfo=userInfoStore.user

const appointmentList = ref<MyAppointmentRes[]>([])
const loadAppointmentData =async  () => {
  const res:MyAppointmentRes[]=await getMyAppointments(userInfo.id)
  appointmentList.value = res;
}
loadAppointmentData()

const goToPay = (appointmentId: number) => {
  ElMessage.info(`跳转到支付页：预约ID ${appointmentId}`)
  router.push(`/life/hospital_order_home/order_detail/${appointmentId}`)
}


const filteredList = computed(() => {
  return appointmentList.value.filter(item => {
    const matchDate = filterDate.value ? item.date === filterDate.value : true
    const matchStatus = filterStatus.value !== '' ? item.status === filterStatus.value : true
    return matchDate && matchStatus
  })
})
const cancel = (id: number) => {
  ElMessageBox.confirm('确定要取消这个预约吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    appointmentList.value = appointmentList.value.filter(item => item.appointmentId !== id)
    const res=cancelAppointment(id)
    ElMessage.success(res.msg?res.msg:'取消成功')
  }).catch(() => {
    ElMessage.info('取消操作已取消')
  })
}

const filterList = () => {
  // 实际由 computed 控制
}

const resetFilter = () => {
  filterDate.value = ''
  filterStatus.value = ''
}
</script>

<style scoped lang="scss">
.appointment-item {
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

}
.appointment-list{
  gap: 10px;
  height: 600px;
  overflow-y: auto;
  margin-top: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px;
}
.appointment-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
// 自定义 tag 背景色与文字颜色
.tag-status-0 {
  background-color: #e0f0ff;
  color: #409EFF;
  border-color: #c6e2ff;
}

.tag-status-1 {
  background-color: #fff7e6;
  color: #e6a23c;
  border-color: #f3d19e;
}

.tag-status-2 {
  background-color: #f0f9eb;
  color: #67c23a;
  border-color: #c2e7b0;
}

.tag-status-3 {
  background-color: #fef0f0;
  color: #f56c6c;
  border-color: #fab6b6;
}

.left-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.index {
  font-size: 14px;
  color: #999;
  margin-bottom: 4px;
}

.left-info .date {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.left-info .desc {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.right-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  white-space: nowrap;
}

</style>
