<template>
  <div class="order-confirm">
    <el-card v-if="preOrderInfo" class="order-card" shadow="hover">
      <h2>预约确认</h2>
      <p><strong>停车场：</strong>{{ preOrderInfo.parkingLotName }}</p>
      <p><strong>车位编号：</strong>{{ preOrderInfo.spaceNum }}</p>
      <p><strong>预约时间：</strong>{{ preOrderInfo.appointTimeStr }}</p>
      <p><strong>所需信用积分：</strong>{{ preOrderInfo.needCreditScore }}</p>
      <p><strong>当前信用积分：</strong>{{ preOrderInfo.currentCreditScore }}</p>
      <p><strong>预计停车时长：</strong>{{ preOrderInfo.spendTimeCount }} 小时</p>
      <p><strong>每小时单价：</strong>{{ preOrderInfo.price }} 元</p>
      <p><strong>合计金额：</strong>{{ preOrderInfo.totalPrice }} 元</p>

      <el-button type="primary" @click="confirmOrder" :loading="loading" style="margin-top: 20px">
        确认预约
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderParking } from '@/api/life/park.ts'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const appointmentId = Number(route.query.appointmentId)
const userId = Number(route.query.id)

//const preOrderInfo = ref<any>(null)
const loading = ref(false)

const confirmOrder = async () => {
  loading.value = true
  const res = await orderParking(appointmentId, userId)
  loading.value = false
  if (res.code === 200) {
    ElMessage.success('预约成功！')
    parkingOrderStore.clearPreOrderInfo()
    await router.push({name: 'MyAppointmentList'})
  } else {
    ElMessage.error('预约失败，请稍后重试')
  }
}

import { useParkingOrderStore } from '@/stores/useParkingOrderStore.ts'

const parkingOrderStore = useParkingOrderStore()
const preOrderInfo = computed(() => parkingOrderStore.preOrderInfo)

onMounted(() => {
  if (!preOrderInfo.value) {
    ElMessage.error('页面信息已过期，请重新预约')
    router.replace('/parking/explore') // 或者退回到列表页
  }
})
</script>

<style scoped>
.order-card {
  max-width: 600px;
  margin: 40px auto;
  font-size: 16px;
}
</style>
