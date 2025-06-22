<template>
  <div class="credit-home">
    <div class="header-row">
    <h2 style="font-size: 30px;">信用商业中心</h2>
    <div class="mail-container">
      <router-link to="/creditbusiness/records" class="mail-button">
        <el-icon style="font-size: 40px;"><Message /></el-icon>
    </router-link>
      <div class="mail-desc">预订记录与还款</div>
    </div>
  </div>

    <!-- 原有功能卡片 -->
    <el-row class="features" :gutter="24">
      <el-col :span="8" v-for="item in features" :key="item.title">
        <el-card class="feature-card" shadow="hover">
          <router-link :to="item.route">
            <el-icon class="icon">
              <component :is="item.icon" />
            </el-icon>
          </router-link>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p >
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 导入图标
import {
  ShoppingCart,
  House,
  OfficeBuilding,
  Message
} from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { useUserInfoStore } from "../../stores/useUserInfoStore"

// 用户信息（可根据需要显示用户名等）
const userInfoStore = useUserInfoStore()

const features = reactive([
  {
    title: '信用购物',
    desc: '在线选购，快速结算；凭信用分可享免押金或分期优惠。',
    icon: ShoppingCart,
    route: '/creditbusiness/hotel-list'
  },
  {
    title: '信用租房',
    desc: '租房无忧，押金减免；信用分越高，可选房源越丰富。',
    icon: House,
    route: '/creditbusiness/hotel-list'
  },
  {
    title: '酒店预订',
    desc: '实时查看酒店列表，根据信用分享受押金豁免及折扣。',
    icon: OfficeBuilding,
    route: '/creditbusiness/hotel-list'
  }
])
</script>

<style scoped lang="scss">
.credit-home {
  position: relative;    /* 使下面的 mail-button 可绝对定位 */
  padding: 32px;
  background-color: #F0F6FA;

    .header-row {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 23px;
  
  }
  

  .mail-container {
    position: absolute;
    top:14px;
    right:0;
    text-align: center;
  }

  .mail-button .el-icon {
    color: var(--primary-color);
  }

  .mail-desc {
    font-size: 12px;
    font-weight: bold;
    color: #606266;
    margin-top: 2px;
  }

  .features {
    .feature-card {
      text-align: center;
      padding: 24px;

      .el-card__body {
        padding: 0;
      }

      .icon {
        font-size: 40px;
        color: var(--primary-color);
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        color: var(--text-color);
      }

      p {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>