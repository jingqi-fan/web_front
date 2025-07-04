
<!-- src/views/credit_life/parking/MyOrders.vue -->
<template>
  <div>
    <h2>我的预约记录</h2>
    <ul>
      <li v-for="order in orders" :key="order.appointmentId">
        {{ order.title }} - {{ order.appointTimeStr }}
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosInstance from '@/plugins/axios.ts';

const orders = ref<any[]>([]);

onMounted(async () => {
  const res = await axiosInstance.get('/api/park/appointmentList');
  orders.value = res.data?.data || [];
});
</script>