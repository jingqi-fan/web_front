
<!-- src/views/credit_life/Score.vue -->
<template>
  <div>
    <h2>我的积分</h2>
    <p>当前积分：{{ score }}</p>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosInstance from '@/plugins/axios.ts';

const score = ref('');

onMounted(async () => {
  const res = await axiosInstance.get('/api/park/score');
  score.value = res.data?.data || '0';
});
</script>