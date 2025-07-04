<template>
  <div>
    <h2>预约确认</h2>
    <p>预约编号：{{ appointmentId }}</p>
    <button @click="confirmOrder">确认下单</button>
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import axiosInstance from '@/plugins/axios.ts';

const route = useRoute();
const router = useRouter();
const appointmentId = route.params.appointmentId;

const confirmOrder = async () => {
  await axiosInstance.get(`/api/park/order/${appointmentId}`);
  router.push(`/api/credit-life/pay/${appointmentId}`);
};
</script>