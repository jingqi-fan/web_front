<!-- src/views/CreditBusiness.vue -->
<template>
  <div class="credit-business">
    <Sidebar :items="sidebarItems">
      <template #back>
        <!-- 跳回 /welcome -->
        <el-button type="text" @click="router.push({ name: 'welcome' }) "  style="font-size: 20px;">
          <el-icon style="font-size: 28px;"><ArrowLeft /></el-icon>
          返回
        </el-button>
      </template>
    </Sidebar>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '../../components/Sidebar.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const sidebarItems = computed(() => [
  { label: '概览',     route: 'CreditBusinessHome' },
  { label: '信用购物', route: 'CreditShopping' },
  { label: '信用租房', route: 'CreditRental' },
  { label: '酒店预订', route: 'HotelList' }
])
</script>

<style lang="scss" scoped>
@use '../../assets/styles/creditbusiness.scss';

.credit-business {
  display: flex;
  height: 100vh;

  .content {
    flex: 1;
    overflow-y: auto;
    background-color: #F0F6FA;
  }
}
</style>