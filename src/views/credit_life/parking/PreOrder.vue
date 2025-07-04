

<!-- src/views/credit_life/parking/PreOrder.vue -->
<template>
  <div>
    <h2>停车预约</h2>
    <form @submit.prevent="submit">
      <input v-model="form.spaceNum" placeholder="车位号" required />
      <input type="datetime-local" v-model.number="form.startTime" required />
      <input type="datetime-local" v-model.number="form.endTime" required />
      <button type="submit">提交预约</button>
    </form>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosInstance from '@/plugins/axios.ts';

const route = useRoute();
const router = useRouter();

const form = ref({
  lotId: Number(route.params.lotId),
  spaceNum: '',
  startTime: 0,
  endTime: 0
});

const submit = async () => {
  const res = await axiosInstance.post('/api/park/preOrder/save', form.value);
  const appointmentId = res.data?.data?.appointmentId;
  await router.push(`/api/credit-life/confirm-order/${appointmentId}`);
};
</script>