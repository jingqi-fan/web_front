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

    <div class="user-info-bar" v-if="userName" @click="fetchCredit">
      <span>欢迎 <b>{{ userName }}</b> 使用信用商业服务</span>
      <span>
    当前信用分：
    <template v-if="isLoading">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <b>信用分获取中...</b>
    </template>
    <template v-else>
      <b>{{ creditScore }}</b>
    </template>
  </span>
      <span>信用等级：<b>{{ creditLevel }}</b></span>
    </div>

    <!-- 卡片式走马灯 -->
    <el-carousel
      type="card"
      height="270px"
      :interval="3500"
      arrow="always"
      indicator-position="outside"
      ref="carouselRef"
      @mouseenter="pauseCarousel"
      @mouseleave="playCarousel"
      :autoplay="autoplayEnabled"
      class="features-carousel"
      @change="onCarouselChange"
    >
      <el-carousel-item
        v-for="(item, idx) in features"
        :key="item.title"
      >
        <router-link
          :to="item.route"
          class="carousel-card-link"
          @mouseenter="onCardHover(idx)"
          @mouseleave="onCardLeave"
        >
          <el-card
            class="feature-card"
            shadow="hover"
          >
            <el-icon class="icon">
              <component :is="item.icon" />
            </el-icon>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p >
          </el-card>
        </router-link>
      </el-carousel-item>
    </el-carousel>

    <!-- 推荐区域，插槽式灵活组件（主卡片hover时显示） -->
    <transition name="fade">
      <div
        class="recommend-area"
        :key="activeIndex"
        @mouseenter="pauseCarousel"
        @mouseleave="playCarousel"
      >
        <component
          :is="features[activeIndex].recommendComponent"
          :title="features[activeIndex].title"
        >
          <!-- 如果没有传入专属组件，可默认降级为简单提示 -->
          <template #default>
            智能推荐：{{ features[activeIndex].title }}
          </template>
        </component>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {
  ShoppingCart,
  House,
  OfficeBuilding,
  Message
} from '@element-plus/icons-vue'
import { reactive, ref ,computed, onMounted } from 'vue'
import { useUserInfoStore } from "../../stores/useUserInfoStore"
import { getUserCreditScoreInfo } from '../../api/user'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import type { CarouselRef } from 'element-plus'

import RecommendShopping from './RecommendShopping.vue'
import RecommendRent from './RecommendRent.vue'
import RecommendHotel from './RecommendHotel.vue'

const userName = ref('')
const creditScore = ref(0)
const creditLevel = ref('')
const isLoading = ref(true)



const userInfoStore = useUserInfoStore()

const features = reactive([
  {
    title: '信用购物',
    desc: '在线选购，快速结算；凭信用分可享免押金或分期优惠。',
    icon: ShoppingCart,
    route:'/creditbusiness/credit-shopping',
    recommendComponent: RecommendShopping // 这里填自定义的组件
  },
  {
    title: '信用租房',
    desc: '租房无忧，押金减免；信用分越高，可选房源越丰富。',
    icon: House,
    route:'/creditbusiness/credit-rent',
    recommendComponent: RecommendRent
  },
  {
    title: '酒店预订',
    desc: '实时查看酒店列表，根据信用分享受押金豁免及折扣。',
    icon: OfficeBuilding,
    route: '/creditbusiness/hotel-list',
    recommendComponent: RecommendHotel
  }
])

// 引用 el-carousel 实例
const carouselRef = ref<CarouselRef|null> (null)
const autoplayEnabled = ref(true)
const pauseCarousel = () => autoplayEnabled.value = false
const playCarousel = () => autoplayEnabled.value = true

const showRecommend = ref(false)
const activeIndex = ref(0)

const onCarouselChange = (index: number) => {
  activeIndex.value = index
}
const onCardHover = (idx: number) => {
  if (idx === activeIndex.value) showRecommend.value = true
}
const onCardLeave = () => showRecommend.value = false



async function fetchCredit() {
  try {
    isLoading.value = true
    const userInfo = useUserInfoStore().user
    userName.value = userInfo.nickName || '未登录'
    const uc = await getUserCreditScoreInfo(userInfo.id)
    creditScore.value = uc.creditScore ?? 0

    if (creditScore.value > 700) {
      creditLevel.value = '钻石级'
    } else if (creditScore.value >= 651) {
      creditLevel.value = '铂金级'
    } else if (creditScore.value >= 601) {
      creditLevel.value = '黄金级'
    } else if (creditScore.value >= 551) {
      creditLevel.value = '白银级'
    } else {
      creditLevel.value = '青铜级'
    }
  } catch (err: any) {
    creditScore.value = 0
    creditLevel.value = '未知'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchCredit)
</script>

<style scoped lang="scss">
.credit-home {
  position: relative;
  padding: 32px;
  background-color: #F0F6FA;
  min-height: 100vh;

  .header-row {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
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
}
.user-info-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 45px;
  font-size: 16px;
  color: #4b5972;
  background: #f7fbff;
  border-radius: 10px;
  padding: 12px 0;
  margin-bottom: 10px;
  margin-top: 0;
  b {
    font-weight: bold;
    color: #2551a5;
  }
  .loading-icon {
    margin-right: 4px;
    vertical-align: middle;
    font-size: 18px;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.features-carousel {
  max-width: 90%;
  margin: 0 auto;
  .el-carousel__item.is-active .feature-card {
    transform: scale(1.08);
    box-shadow: 0 8px 32px #f1f2e7;
    border-radius: 18px;
    z-index: 2;
  }
  .carousel-card-link {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-decoration: none;
  }
  .feature-card {
    width: 360px;
    min-height: 200px;
    margin: 0 auto;
    text-align: center;
    padding: 32px 20px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 16px #eeeff0;
    transition: transform 0.3s, box-shadow 0.3s;
    .icon {
      font-size: 44px;
      color: var(--primary-color, #658bb0);
      margin-bottom: 18px;
    }
    h3 {
      font-size: 22px;
      color: #2f3b52;
      font-weight: bold;
      margin-bottom: 12px;
    }
    p {
      font-size: 15px;
      color: #606266;
    }
  }

}

/* 推荐区域样式 */
.recommend-area {
  width: 90%;
  margin: 32px auto 0 auto;
  padding: 34px 20px;
  background: linear-gradient(90deg,#f3f6fa 70%,#e9eef9 100%);
  border-radius: 18px;
  box-shadow: 0 2px 16px #e1e7f0;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #2f3b52;
  letter-spacing: 1px;
  opacity: 0.98;
  transition: all 0.23s cubic-bezier(.4,2,.4,1);
}

/* 推荐弹出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .22s cubic-bezier(.4,2,.4,1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

@media (max-width: 600px) {
  .features-carousel .feature-card {
    width: 95vw;
    padding: 18px 6px;
  }
  .recommend-area {
    width: 96vw;
    font-size: 16px;
    padding: 20px 5px;
  }
}
</style>