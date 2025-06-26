<template>
  <div class="right-top">
    <div class="top-content">
      <el-avatar
          class="avatar"
          :src="avatar"
      />
      <EChartsGauge :creditScore="creditScore" style="height: 160px;width: 160px" />
    </div>

    <div class="greeting-section">
      <p class="greeting-text">{{ greeting }} 👋</p>
      <p class="greeting-subtext">
        这是你加入 <strong>西湖分</strong> 的第 <strong>{{ daysSince(joinedDate) }}</strong> 天！
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EChartsGauge from './EChartsGauge.vue'

const props = defineProps<{
  avatar: string
  creditScore: number
  joinedDate: string
}>()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 11) return '早上好'
  else if (hour >= 11 && hour < 13) return '中午好'
  else if (hour >= 13 && hour < 18) return '下午好'
  else return '晚上好'
})

function daysSince(dateStr: string): number {
  const inputDate = new Date(dateStr)
  const now = new Date()

  const utc1 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const utc2 = Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate())

  const msPerDay = 1000 * 60 * 60 * 24
  return Math.floor((utc1 - utc2) / msPerDay)
}
</script>

<style scoped lang="scss">
.right-top {
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .top-content {
    display: flex;
    align-items: center;
    gap: 40px;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border: 2px solid #e0e0e0;
  }

  .greeting-section {
    text-align: center;

    .greeting-text {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }

    .greeting-subtext {
      font-size: 14px;
      color: #888;
    }
  }
}
</style>
