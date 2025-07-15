<template>
  <div class="recommend-shopping-container">
    <!-- 上方文字说明 -->
    <div class="recommend-desc">
      <h3>👍智能推荐：信用租房</h3>
      <p>根据你的居住需求，筛选优质房源，区域成熟，配套齐全，租期灵活，拎包即住！</p >
      <p class="highlight">真房源直租，无中介费，品质生活从此开启！</p >
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
      <el-carousel-item v-for="(item, idx) in houses" :key="item.id">
        <el-card class="commodity-card" shadow="hover">
          <!-- 右上角印章 -->

          <img
            class="commodity-image"
            :src="item.img"
            alt="商品图片"
          />

          <div class="commodity-info">
            <h4 class="commodity-name">{{ item.title }}</h4>
            <p class="commodity-category">位置：{{ item.address }}</p >
            <p class="commodity-price">价格：¥{{ item.price }}</p >
              <p class="commodity-purchases" v-if="item.rentalType === '0'">类型：整租</p>
              <p class="commodity-purchases" v-else-if="item.rentalType === '1'">类型：合租</p>

          </div>
        </el-card>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { House ,HouseSearchParams} from '../../entity/House'
import { useUserInfoStore } from '../../stores/useUserInfoStore'
import { getHouseList } from '../../api/house'
import { ShoppingCart, ShoppingCartFull } from '@element-plus/icons-vue'

const houses = ref<House[]>([])
const userInfoStore = useUserInfoStore()

async function fetchhouse() {
  try {
    const userId = userInfoStore.user.id
    const allHouses = (await getHouseList()).records
    houses.value = allHouses.sort(() => Math.random() - 0.5).slice(0, 10)
  } catch (err) {
    console.error('获取房屋推荐失败', err)
  }
}

onMounted(fetchhouse)
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
      color: #0e5b45;
      margin-bottom: 8px;
    }
    p {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
      &.highlight {
        color: #0e5b45;
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