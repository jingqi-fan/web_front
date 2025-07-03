
<!-- src/views/credit_life/parking/Pay.vue -->
<template>
  <div>
    <h2>支付页面</h2>
    <p>总费用：{{ feeInfo?.totalFee }} 元</p>
    <button @click="pay">立即支付</button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axiosInstance from '@/plugins/axios.ts';

const route = useRoute();
const feeInfo = ref<any>(null);

onMounted(async () => {
  const res = await axiosInstance.get(`/api/park/fee/detail/${route.params.appointmentId}`);
  feeInfo.value = res.data?.data;
});

const pay = async () => {
  await axiosInstance.get(`/api/park/pay/fee/${feeInfo.value.parkingFeeId}`);
  alert('支付成功');
};
</script>