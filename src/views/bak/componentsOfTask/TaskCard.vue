<template>
  <el-card :body-style="{ padding: '10px 20px' }" class="task-card">
    <div class="task-header">
      <h3>{{ task.name || '未命名任务' }}</h3>
    </div>

    <el-divider style="margin-top: 2px; margin-bottom: 8px;"></el-divider>
    <div class="task-body">
      <p><strong>ID:</strong> {{ task.id }}</p>
      <p>
        <strong>状态:</strong>
        <el-tag :type="getStatusType(task.status)">
          {{ getStatusLabel(task.status) }}
        </el-tag>
      </p>
      <p><strong>描述:</strong> {{ task.description || '无描述' }}</p>
      <p><strong>分组:</strong> {{ task.group || '未分组' }}</p>
    </div>
    <div class="task-actions">
      <el-button type="success" plain @click="$emit('view', task)">查看</el-button>
      <el-button type="success" plain @click="$emit('details', task)">详情</el-button>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { ElCard, ElButton, ElTag, ElDivider } from 'element-plus';

const props = defineProps<{
  task: {
    id: string;
    name: string;
    status: string;
    description?: string;
    group?: string;
  };
}>();

const emit = defineEmits<{
  (e: 'view', task: any): void;
  (e: 'details', task: any): void;
}>();

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'ongoing':
      return '进行中';
    case 'not_started':
      return '未开始';
    case 'completed':
      return '已完成';
    default:
      return '未知状态';
  }
};

const getStatusType = (status: string) => {
  switch (status) {
    case 'ongoing':
      return 'info';
    case 'not_started':
      return 'warning';
    case 'completed':
      return 'success';
    default:
      return 'info';
  }
};
</script>

<style lang="scss" scoped>
.task-card {
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 380px;
  margin: 10px 0 0;
  box-sizing: border-box;
  position: relative;
}

.task-header {
  h3 {
    margin: 0;
    font-size: 1.2em;
    font-weight: bold;
    text-align: left;
  }
}

.task-body {
  text-align: left;

  p {
    margin: 5px 0;

    strong {
      margin-right: 5px;
    }
  }
}

.task-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}
</style>
