<template>
  <div>
    <h2>推荐医生</h2>
    <ul>
      <li v-for="d in doctors" :key="d.doctorId">
        {{ d.doctorName }} - {{ d.departmentName }} ({{ d.doctorTitle }})
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axiosInstance from '@/plugins/axios.ts';
const doctors = ref<any[]>([]);
onMounted(async () => {
  const res = await axiosInstance.get('/hospital/recommend');
  doctors.value = res.data?.data || [];
});
</script>