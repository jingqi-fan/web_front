<!-- ActivityCard.vue -->
<template>
  <el-card class="activity-card" shadow="hover">
    <div class="activity-header">
      <el-image :src="item.logo" class="activity-image" fit="cover" />
      <div class="activity-info">
        <h3 class="activity-title">{{ item.title }}</h3>
        <div class="activity-intro">{{ item.introduce }}</div>
        <div class="activity-footer">
          <el-button size="small" v-if="showAction" type="primary" @click="$emit('join', item.id)">参加</el-button>
          <el-button size="small" v-if="showAction" type="danger" @click="$emit('exit', item.id)">退出</el-button>
          <el-button size="small" v-if="showAction" type="success" @click="$emit('finish', item.id)">完成</el-button>
          <el-button size="small" plain @click="$emit('view', item)">详情</el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type {ActivitiesDTO} from "@/api/prosocail_behavior/user_activity_type.ts";

defineProps<{
  item: ActivitiesDTO
  showAction?: boolean
}>()
</script>
