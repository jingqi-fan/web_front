<!-- src/components/Sidebar.vue -->
<template>
  <aside class="sidebar-el">
    <!-- 返回按钮 -->
    <div class="sidebar-header">
      <slot name="back" />
    </div>

    <!-- 主菜单 -->
    <el-menu
      class="sidebar-menu"
      :default-active="currentRoute"
      @select="handleSelect"
      background-color="transparent"
      text-color="rgba(255,255,255,0.9)"
      active-text-color="#fff"
    >
      <el-menu-item
        v-for="item in items"
        :key="item.route"
        :index="item.route"
        :disabled="item.disabled"
        class="menu-item"
      >
        {{ item.label }}
      </el-menu-item>
    </el-menu>

    <!-- 功能恢复按钮（仅禁用用户可见） -->
    <div v-if="banned" class="recover-wrapper">
      <el-button
        type="warning"
        size="large"
        :loading="recoverLoading"
        @click="attemptRecover"
      >
        功能恢复
      </el-button>
    </div>

    <!-- Ban 提示 -->
    <div v-if="banned" class="ban-message">
      <p>您存在严重失信行为</p >
      <p>已停用信用商业功能！</p >
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserInfoStore } from '../stores/useUserInfoStore'
import { getReservationsByUserId } from '../api/hotelReservation'
import axiosInstance from '../plugins/axios'

interface SidebarItem {
  label: string
  route: string
  disabled: boolean
}

// 接收侧边栏项及封禁状态
const props = defineProps<{
  items: SidebarItem[]
  banned: boolean
}>()

// 通知父组件恢复成功
const emit = defineEmits<{
  (e: 'recovered'): void
}>()

const router    = useRouter()
const route     = useRoute()
const currentRoute = computed(() => route.name as string)
const userId    = useUserInfoStore().user.id

const recoverLoading = ref(false)

function handleSelect(routeName: string) {
  const item = props.items.find(i => i.route === routeName)
  if (item && !item.disabled) {
    router.push({ name: routeName })
  }
}

async function attemptRecover() {
  // 1. 检查未支付订单
  const orders = await getReservationsByUserId(userId)
  const unpaid = orders.filter(o => o.isPay === 0)
  if (unpaid.length > 0) {
    ElMessage.warning('您尚未还清，暂无法恢复')
    return
  }

  // 2. 确认框
  try {
    await ElMessageBox.confirm(
      '您所有订单已还清，是否确认恢复信用商业功能？',
      '恢复确认',
      { type: 'warning' }
    )
  } catch {
    // 取消
    return
  }

  // 3. 调用恢复接口
  recoverLoading.value = true
  try {
    await axiosInstance.post(`/hotels/recover`, null, { params: { userId } })
    ElMessage.success('信用商业功能已恢复')
    emit('recovered')
  } catch (e) {
    console.error(e)
    ElMessage.error('恢复失败，请稍后重试')
  } finally {
    recoverLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.sidebar-el {
  width: 220px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, #3a6ea5, #2c5688);
  box-shadow: inset -5px 0 10px rgba(0, 0, 0, 0.2);

  .sidebar-header {
    padding: 16px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.2);
  }

  .sidebar-menu {
    flex: 1;
    border-right: none;
  }

  .menu-item {
    margin: 8px 12px;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 18px;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .menu-item:hover:not(.is-active):not(.is-disabled) {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
  .menu-item.is-active {
    background: #fff;
    color: #409eff !important;
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
  .menu-item.is-disabled {
    color: rgba(255, 255, 255, 0.4) !important;
    background: rgba(255, 255, 255, 0.02) !important;
    cursor: not-allowed !important;
  }

  .recover-wrapper {
    padding: 12px;
    text-align: center;
  }

  .ban-message {
    margin: 0 12px 16px;
    padding: 12px;
    background: #fde2e2;
    color: #f56c6c;
    font-size: 14px;
    text-align: center;
    border: 1px solid #fadbd9;
    border-radius: 4px;
    line-height: 1.4;
  }
}
</style>