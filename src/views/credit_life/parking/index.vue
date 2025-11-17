<template>
  <div class="parking-home">
    <!-- 顶部标题栏 -->
    <el-header class="top-bar">
      <el-button type="text" :icon="Back" @click="goHome" >返回</el-button>
      <div class="title">智慧停车场</div>
      <div class="user-info">
        <span class="score">信用分：{{ creditScore.creditScore }}</span>
        <el-avatar :size="30" :src="userInfo.profilePicture" />
      </div>
    </el-header>

    <!-- 快捷服务卡片 -->
    <div class="section-title">便捷服务</div>
    <div class="quick-services">
      <el-card class="quick-card" shadow="hover">
        <el-icon class="card-icon" :style="{ color: '#409EFF' }"><Location /></el-icon>
        <div class="card-title">快速预约</div>
        <div class="card-subtitle">一键预约停车位</div>
        <el-button type="success" size="small" @click="goToPreorder">立即预约</el-button>
      </el-card>

      <el-card class="quick-card" shadow="hover">
        <el-icon class="card-icon" :style="{ color: '#E6A23C' }"><List /></el-icon>
        <div class="card-title">我的预约</div>
        <div class="card-subtitle">查看历史预约记录</div>
        <el-button type="success" size="small" @click="checkMyOrder">查看记录</el-button>
      </el-card>

      <el-card class="quick-card" shadow="hover">
        <el-icon class="card-icon" :style="{ color: '#67C23A' }"><Medal /></el-icon>
        <div class="card-title">信用分</div>
        <div class="card-subtitle">停车行为影响信用</div>
        <el-tag type="success">良好（{{creditScore.creditScore}}）</el-tag>
      </el-card>
    </div>

    <!-- 推荐停车场 -->
    <div class="section-title">推荐停车场</div>
    <div class="parking-list">
      <div class="parking-item" v-for="lot in parkingList" :key="lot.id">
        <div class="parking-image">
          <img :src="lot.image" alt="停车场图片" />
        </div>
        <div class="parking-info">
          <div class="row">
            <div class="lot-name">{{ lot.title }}</div>
            <div class="lot-available">剩余：{{ lot.leftCount }}位</div>
          </div>
          <div class="lot-location"><el-icon><Location /></el-icon> &nbsp;{{ lot.location }}</div>
          <el-button type="success" size="small" plain @click="homePreorder(lot.id)">预约</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Back, Medal, Location, List } from '@element-plus/icons-vue'
import { ref } from 'vue'
import router from '@/router'
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";
import {useUserCreditScoreStore} from "@/stores/useUserCreditScore.ts";
import {getRecommendParking} from "@/api/life/parking_api.ts";
import type {ParkingLotsSimpleInfoRes} from "@/api/life/parking_type.ts";

const goHome = () => {
  router.push('/life')
}

const userInfoStore=useUserInfoStore()
const userInfo=userInfoStore.user

const parkingUrlList=ref([
    "https://img1.baidu.com/it/u=1017872965,1036002085&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500",
    "https://img1.baidu.com/it/u=2882147940,1920245379&fm=253&fmt=auto&app=120&f=JPEG?w=667&h=500",
    "https://img1.baidu.com/it/u=3045287754,101730555&fm=253&fmt=auto&app=138&f=JPEG?w=749&h=500"
])

const userCreditScoreStore=useUserCreditScoreStore()
const creditScore=userCreditScoreStore.score

const parkingList = ref<ParkingLotsSimpleInfoRes[]>([])

const loadRecommendParkingLots = async () => {
  const res: ParkingLotsSimpleInfoRes[] = await getRecommendParking()
  parkingList.value = res.slice(0, 3).map((lot, index) => ({
    ...lot,
    image: parkingUrlList.value[index % parkingUrlList.value.length]
  }))
}

loadRecommendParkingLots()

const goToPreorder = () => {
  router.push('/parking/lots')
}
const homePreorder = (id: number) => {
  router.push(`/parking/lot/${id}`)
}
const checkMyOrder=()=>{
  router.push('/parking/space/my_order')
}
</script>

<style scoped lang="scss">
.parking-home {
  padding: 16px;
  background-color: #f5f7fa;
}
.quick-services {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;

  .quick-card {
    width: 200px;
    height: 160px;
    text-align: center;
    background: linear-gradient(135deg, #f3f9ff, #ffffff);
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
    }

    .card-icon {
      font-size: 48px;
      margin-bottom: 8px;
      color: #409EFF;
    }

    .card-title {
      font-size: 16px;
      font-weight: bold;
      margin: 2px 0;
    }

    .card-subtitle {
      font-size: 13px;
      color: #888;
      margin-bottom: 6px;
    }

    .el-button, .el-tag {
      font-size: 12px;
      padding: 4px 12px;
    }
  }
}

.book-item {
  width: 320px;
  height: 360px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.book-cover {
  height: 60%;
  width: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.book-info {
  height: 40%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .book-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .book-author {
    font-size: 13px;
    color: #888;
    margin: 4px 0;
  }

  .book-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .el-tag {
      font-size: 12px;
    }

    .el-button {
      padding: 4px 8px;
      font-size: 12px;
    }
  }
}

.top-bar {
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 0 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  .title {
    font-size: 18px;
    font-weight: bold;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;

    .score {
      font-size: 14px;
      color: #409EFF;
    }
  }
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 10px;
  gap:20px;
  color: #333;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    width: 4px;
    height: 16px;
    background-color: #409EFF;
    margin-right: 8px;
    border-radius: 2px;
  }
}

.quick-services {
  display: flex;
  justify-content: center;
  gap: 80px;
  margin-bottom: 30px;

  .quick-card {
    width: 340px;
    height: 180px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 16px 10px;

    .card-title {
      font-weight: bold;
      font-size: 15px;
    }

    .card-subtitle {
      font-size: 13px;
      color: #888;
    }
  }
}

.parking-list {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.parking-item {
  width: 420px;
  height: 360px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .parking-image {
    height: 60%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .parking-info {
    height: 40%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }

    .lot-location {
      font-size: 13px;
      color: #888;
    }

    .el-button {
      align-self: flex-end;
    }
  }
}
</style>