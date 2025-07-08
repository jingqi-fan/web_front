<template>
  <div class="recommend-hotel-container">
    <!-- 上方文字说明 -->
    <div class="recommend-desc">
      <h3>👍智能推荐：酒店预订</h3>
      <p>优选高分好评酒店，信用分达标可享免押入住，先住后付更安心。</p >
      <p class="highlight">热门景区酒店火爆预订中，快来看看哪些你常住或心仪的酒店吧！</p >
    </div>

    <!-- 下方水平卡片走马灯 -->
    <el-carousel
      class="hotel-carousel"
      type="card"
      arrow="always"
      :interval="4500"
      :autoplay="true"
      height="320px"
      indicator-position="outside"
    >
    <el-carousel-item v-for="hotel in hotels" :key="hotel.id">
  <el-card class="hotel-card" shadow="hover">
    <!-- 右上角印章 -->
    <div v-if="hotel.nearby" class="recommend-badge">
      {{ hotel.nearby }}
    </div>

    <img
      class="hotel-image"
      :src="`/${hotel.img}`"
      alt="酒店图片"
    />

    <div class="hotel-info">
      <h4 class="hotel-name">{{ hotel.hotelName }}</h4>
      <div class="hotel-meta">
        <span class="hotel-rating">⭐ {{ hotel.score }}</span>
        <span class="hotel-price">
          ¥{{ hotel.price }}
          <!-- 新增：预订次数 -->
          <span class="hotel-bookings">（预订次数：{{ hotel.location }}）</span>
        </span>
      </div>
    </div>
  </el-card>
</el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Hotel } from '../../entity/Hotel'
import { useUserInfoStore } from '../../stores/useUserInfoStore'
import { getHotelTops } from '../../api/hotel'
import { OfficeBuilding } from '@element-plus/icons-vue'

const hotels = ref<Hotel[]>([])
const userInfoStore = useUserInfoStore()

async function fetchHotels() {
  try {
    const userId = userInfoStore.user.id
    hotels.value = await getHotelTops(userId)
  } catch (err) {
    console.error('获取酒店推荐失败', err)
  }
}

onMounted(fetchHotels)
</script>

<style scoped lang="scss">
.recommend-hotel-container {
  max-width: 1000px;
  margin: 6px auto;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);

  /* 上方文字说明 */
  .recommend-desc {
    text-align: center;
    margin-bottom: 24px;
    h3 {
      font-size: 24px;
      color: #6a1b9a;
      margin-bottom: 8px;
    }
    p {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
      &.highlight {
        color: #7d3faf;
        margin-top: 8px;
      }
    }
  }

  /* Carousel 全宽显示 */
  .hotel-carousel {
    width: 100%;
    .el-carousel__arrow {
      // 扩大箭头，避免与卡片重叠
      width: 40px !important;
      height: 40px !important;
      background: rgba(0, 0, 0, 0.3);
      color: #fff !important;
      border-radius: 50%;
      z-index: 5;
    }
    .el-carousel__arrow--left {
      left: -50px !important;
    }
    .el-carousel__arrow--right {
      right: -50px !important;
    }
  }

  /* 每个酒店卡片 */
  .hotel-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    border-radius: 10px;
    overflow: hidden;
    background: #fafafa;

    .hotel-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }
    /* 印章样式 */
    .recommend-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ed5a5a;      /* 红色印章底色 */
  color: white;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 10;
     }
    .hotel-info {
      width: 100%;
      padding: 12px 16px;
      text-align: center;

      .hotel-name {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
      }
      .hotel-meta {
        display: flex;
        justify-content: center;
        gap: 24px;
        font-size: 14px;
        color: #666;

        .hotel-rating {
          display: flex;
          align-items: center;
        }
        .hotel-price {
          color: #4d1712;
          font-weight: 500;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .recommend-hotel-container {
    padding: 16px;
    .hotel-carousel {
      .el-carousel__arrow--left {
        left: 0 !important;
      }
      .el-carousel__arrow--right {
        right: 0 !important;
      }
    }
    .hotel-card {
      .hotel-image {
        height: 140px;
      }
    }
  }
}
</style>