<template>
  <div>
    <h2>推荐图书</h2>
    <ul>
      <li v-for="book in books" :key="book.id">
        {{ book.bookName }} - {{ book.author }}
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosInstance from '@/plugins/axios.ts';
const books = ref<any[]>([]);
onMounted(async () => {
  const res = await axiosInstance.get('/api/book/recommend');
  books.value = res.data?.data || [];
});
</script>