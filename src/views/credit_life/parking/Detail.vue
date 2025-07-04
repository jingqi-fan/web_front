<!-- src/views/credit_life/parking/Detail.vue -->
<template>
  <div>
    <h2>{{ parkingLot?.parkingLotName }}</h2>
    <p>{{ parkingLot?.parkingLotLocation }}</p>
    <button @click="goToPreOrder">预约停车</button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosInstance from '@/plugins/axios.ts';

const route = useRoute();
const router = useRouter();
const parkingLot = ref<any>(null);

onMounted(async () => {
  const res = await axiosInstance.get(`/api/park/lot/${route.params.lotId}`);
  parkingLot.value = res.data?.data;
});

const goToPreOrder = () => {
  router.push(`/credit-life/preorder/${route.params.lotId}`);
};
</script>