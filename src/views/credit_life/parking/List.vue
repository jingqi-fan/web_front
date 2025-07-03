<!-- 以下 parking 子模块页面目录结构及组件 -->

<!-- src/views/credit_life/parking/List.vue -->
<template>
  <div>
    <h2>推荐停车场</h2>
    <ul>
      <li v-for="lot in lots" :key="lot.id">
        <router-link :to="`/credit-life/parking/${lot.id}`">{{ lot.title }} - {{ lot.location }}</router-link>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axiosInstance from '@/plugins/axios.ts';

const lots = ref<any[]>([]);

onMounted(async () => {
  const res = await axiosInstance.get('/api/park/list');
  lots.value = res.data?.data || [];
});
</script>