<template>
  <div class="header-container">
    <logo style="margin-left: 20px;cursor: pointer" @click="$emit('backHome')" />
    <el-popover
        v-for="(item, index) in popovers"
        :key="index"
        placement="right"
        :width="150"
        trigger="hover"
        :content="item.content"
    >
      <template #reference>
        <div class="card-icon" :style="{ cursor: 'pointer' }" @click="item.onClick">
          <div :ref="item.ref" class="lottie-container" />
        </div>
      </template>
    </el-popover>
    <el-avatar
        :src="avatarUrl"
        style="margin-right: 40px;cursor:pointer;"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import lottie from 'lottie-web';
import Logo from "./Logo.vue"

const props = defineProps<{ avatarUrl: string }>();

const emit = defineEmits(['backHome', 'goToCreditLife', 'goToCreditBusiness', 'goToCreditManagerPage']);

const shoppingRef = ref(null);
const lifeRef = ref(null);
const personalRef = ref(null);

onMounted(() => {
  const animations = [
    { container: shoppingRef, path: '@/assets/shopping.json' },
    { container: lifeRef, path: '@/assets/life.json' },
    { container: personalRef, path: '@/assets/personal.json' },
  ];

  animations.forEach(({ container, path }) => {
    lottie.loadAnimation({
      container: container.value!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: new URL(path, import.meta.url).href
    });
  });
});

const popovers = [
  {
    content: '酒店、租房、购物更省心',
    ref: shoppingRef,
    onClick: () => emit('goToCreditBusiness')
  },
  {
    content: '停车、就医、借阅更舒心',
    ref: lifeRef,
    onClick: () => emit('goToCreditLife')
  },
  {
    content: '个人信用一目了然',
    ref: personalRef,
    onClick: () => emit('goToCreditManagerPage')
  }
];
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.lottie-container {
  height: 100px;
  width: 100px;
}
</style>