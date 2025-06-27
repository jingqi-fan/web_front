<template>
    <div class="recommend-container">
      <div class="recommend-title">
        <el-icon><House /></el-icon>
        智能推荐：信用租房
      </div>
      <div class="recommend-desc">
        <p>精选高分房源、品质公寓，部分房型押金立减，月租优惠中。</p >
        <p style="color: #7e553c;">信用等级高可优先预订热门房源，享专属服务！</p >
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { House } from '@element-plus/icons-vue'
  </script>
  
  <style scoped>
  .recommend-container {
    padding: 10px 8px;
    text-align: center;
  }
  .recommend-title {
    font-size: 20px;
    font-weight: bold;
    color: #28754a;
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