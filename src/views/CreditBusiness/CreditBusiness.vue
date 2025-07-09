<!-- src/views/CreditBusiness.vue -->
<template>
  <div class="credit-business">
    <Sidebar :items="sidebarItems" :banned="isBanned">
      <template #back>
        <el-button link @click="router.push({ name: 'welcome' })" style="font-size:20px; color:white">
          <el-icon style="font-size:28px; "><ArrowLeft/></el-icon>
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
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { computed, ref, onMounted } from 'vue'
import axiosInstance from '../../plugins/axios'
import { useUserInfoStore } from '../../stores/useUserInfoStore'

// 路由
const router = useRouter()

// Ban 状态
const isBanned = ref(false)
const userId = useUserInfoStore().user.id

onMounted(async () => {
  try {
    const res = await axiosInstance.get<number>('/hotels/checkban', {
      params: { userId }
    })
    isBanned.value = res.data === 1
    console.log('Ban 状态:', isBanned.value)
  } catch (e) {
    console.error('检查 Ban 状态失败', e)
  }
})

// 侧边栏项：若被 Ban，就禁用除“首页”之外的功能
const sidebarItems = computed(() => [
  { label: '首页',      route: 'CreditBusinessHome', disabled: false },
  { label: '信用购物',  route: 'CreditShopping',     disabled: isBanned.value },
  { label: '信用租房',  route: 'CreditRental',       disabled: isBanned.value },
  { label: '酒店预订',  route: 'HotelList',          disabled: isBanned.value }
])
</script>

<style scoped lang="scss">
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