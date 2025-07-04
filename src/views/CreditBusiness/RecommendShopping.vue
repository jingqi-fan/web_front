<template>
  <div class="recommend-shopping-container">
    <!-- 上方文字说明 -->
    <div class="recommend-desc">
      <h3>👍智能推荐：信用购物</h3>
      <p>根据你的消费偏好，精选热销商品推荐，库存充足，限时优惠，立即选购！</p >
      <p class="highlight">爆款热销，抢先入手，不容错过！</p >
    </div>

    <!-- 下方水平卡片走马灯 -->
    <el-carousel
      class="shopping-carousel"
      type="card"
      arrow="always"
      :interval="4500"
      :autoplay="true"
      height="320px"
      indicator-position="outside"
    >
      <el-carousel-item v-for="(item, idx) in commodities" :key="item.id">
        <el-card class="commodity-card" shadow="hover">
          <!-- 右上角印章 -->
          <div v-if="idx < 3" class="recommend-badge">
            Top {{ idx + 1 }}
          </div>

          <img
            class="commodity-image"
            :src="item.imageUrl"
            alt="商品图片"
          />

          <div class="commodity-info">
            <h4 class="commodity-name">{{ item.name }}</h4>
            <p class="commodity-category">类别：{{ item.category }}</p >
            <p class="commodity-price">价格：¥{{ item.price }}</p >
            <p class="commodity-purchases">购买次数：{{ item.purchaseCount }}</p >
          </div>
        </el-card>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Commodity2 } from '../../entity/Commodity2'
import { useUserInfoStore } from '../../stores/useUserInfoStore'
import { getTopPurchased } from '../../api/commodity'
import { ShoppingCart, ShoppingCartFull } from '@element-plus/icons-vue'

const commodities = ref<Commodity2[]>([])
const userInfoStore = useUserInfoStore()

async function fetchCommodities() {
  try {
    const userId = userInfoStore.user.id
    commodities.value = await getTopPurchased(userId)
  } catch (err) {
    console.error('获取商品推荐失败', err)
  }
}

onMounted(fetchCommodities)
</script>

<style scoped>
.recommend-shopping-container {
  max-width: 1000px;
  margin: 6px auto;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

 /* 上方文字说明 */
 .recommend-desc {
    text-align: center;
    margin-bottom: 24px;
    h3 {
      font-size: 24px;
      color: #9a1b63;
      margin-bottom: 8px;
    }
    p {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
      &.highlight {
        color: #9a1b63;
        margin-top: 8px;
      }
    }
  }

.shopping-carousel {
  width: 100%;

}


.commodity-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    border-radius: 10px;
    overflow: hidden;
    background: #fafafa;
}

.recommend-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #f56c6c;
  color: #fff;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.commodity-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.commodity-info {
  padding: 8px;
  text-align: left;
}

.commodity-name {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.commodity-category,
.commodity-price,
.commodity-purchases {
  margin: 2px 0;
  font-size: 14px;
  color: #606266;
}

.commodity-price {
  color: #f56c6c;
  font-weight: 500;
}
</style>