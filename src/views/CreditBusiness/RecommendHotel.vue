<template>
    <div class="recommend-container">
      <div class="recommend-title">
        <el-icon><OfficeBuilding /></el-icon>
        智能推荐：酒店预订
      </div>
      <div class="recommend-desc">
        <p>优选高评分酒店，部分房型支持免押入住，先住后付更安心。</p >
        <p style="color: #7d3faf;">热门景区酒店火爆预订中，信用分达标可享专属折扣！</p >
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { OfficeBuilding } from '@element-plus/icons-vue'
  </script>
  
  <style scoped>
  .recommend-container {
    padding: 10px 8px;
    text-align: center;
  }
  .recommend-title {
    font-size: 20px;
    font-weight: bold;
    color: #732d9d;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .recommend-title .el-icon {
    margin-right: 8px;
    font-size: 23px;
  }
  .recommend-desc {
    font-size: 15px;
    color: #405169;
    line-height: 1.7;
  }
  </style>