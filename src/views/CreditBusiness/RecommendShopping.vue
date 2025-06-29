<template>
    <div class="recommend-container">
      <div class="recommend-title">
        <el-icon><ShoppingCart /></el-icon>
        智能推荐：信用购物
      </div>
      <div class="recommend-desc">
        <p>为你精选分期免押、热销好物，信用分越高，优惠越多。</p >
        <p style="color: #6b778c;">本月专享：满200减30元专属券，更多福利敬请期待！</p >
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ShoppingCart } from '@element-plus/icons-vue'
  </script>
  
  <style scoped>
  .recommend-container {
    padding: 10px 8px;
    text-align: center;
  }
  .recommend-title {
    font-size: 20px;
    font-weight: bold;
    color: #2762d7;
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