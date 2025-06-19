<template>
  <div class="credit-home">
    <h2 class="title">信用商业中心</h2>
    <el-row class="features" :gutter="24">
      <el-col :span="8" v-for="item in features" :key="item.title">
        <el-card class="feature-card" shadow="hover">
          <!-- 使用新版图标 -->
          <el-icon class="icon">
            <component :is="item.icon" />
          </el-icon>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p >
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 导入最新图标组件  
import { ShoppingCart, House, OfficeBuilding } from '@element-plus/icons-vue'
import { reactive } from 'vue'





const features = reactive([
  {
    title: '信用购物',
    desc: '在线选购，快速结算；凭信用分可享免押金或分期优惠。',
    icon: ShoppingCart
  },
  {
    title: '信用租房',
    desc: '租房无忧，押金减免；信用分越高，可选房源越丰富。',
    icon: House
  },
  {
    title: '酒店预订',
    desc: '实时查看酒店列表，根据信用分享受押金豁免及折扣。',
    icon: OfficeBuilding
  }
])
</script>

<style scoped lang="scss">
/* 只要使用 creditbusiness.scss 提供的 CSS 变量即可 */
.credit-home {
  padding: 32px;
  background-color: #F0F6FA;

  .title {
    font-size: 32px;
    color: var(--primary-color);
    text-align: center;
    margin-bottom: 24px;
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