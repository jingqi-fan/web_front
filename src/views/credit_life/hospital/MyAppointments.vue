<template>
  <div>
    <h2>我的医院预约</h2>
    <ul>
      <li v-for="a in appointments" :key="a.appointmentId">
        {{ a.createTimeStr }} - {{ a.departmentName }} {{ a.doctorName }} ({{ a.doctorTitleStr }})
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosInstance from '@/plugins/axios.ts';
const appointments = ref<any[]>([]);
onMounted(async () => {
  const res = await axiosInstance.get('/hospital/order/list');
  appointments.value = res.data?.data || [];
});
</script>