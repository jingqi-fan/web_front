<template>
  <div class="card-body">
    <el-card shadow="hover">
      <!-- 头部：患者姓名 -->
      <template #header>
        <div class="card-header">
          <span>{{ data.id }}</span>
        </div>
      </template>

      <!-- 中间内容区 -->
      <div class="main-content">
        <div class="info-row">
          <el-text class="label">信用分：</el-text>
          <el-text>{{ data.credit }}</el-text>
        </div>
        <div class="info-row">
          <el-text class="label">发起日期：</el-text>
          <el-text>{{ data.date }}</el-text>
        </div>
        <div class="info-row description">
          <el-text class="label">患者描述：</el-text>
          <el-text>{{ data.description }}</el-text>
        </div>
      </div>

      <!-- 底部操作区 -->
      <template #footer>
        <div class="footer-actions">
          <el-button type="info" plain @click="handleDetail">详情</el-button>
          <el-button type="primary" @click="handleAccept">接诊</el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      name: '',
      credit: 0,
      date: '',
      description: ''
    }),
  },
})

const emits = defineEmits(['detail', 'accept'])

const handleDetail = () => {
  emits('detail', props.data)
}
const handleAccept = () => {
  emits('accept', props.data)
}
</script>

<style scoped lang="scss">
.card-body {
  width: 320px;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 5px;

  .info-row {
    display: flex;
    gap: 8px;
    font-size: 14px;
    color: #444;

    .label {
      font-weight: 500;
      color: #666;
      min-width: 80px;
    }
  }

  .description {
    white-space: normal;
    word-break: break-all;
  }
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
