<template>
  <div>
    <h2>我的借阅记录</h2>
    <ul>
      <li v-for="b in records" :key="b.id">
        {{ b.bookName }} - {{ b.author }} - {{ b.publisher }}
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosInstance from '@/plugins/axios.ts';
const records = ref<any[]>([]);
onMounted(async () => {
  const res = await axiosInstance.get('/api/book/record');
  records.value = res.data?.data || [];
});
</script>