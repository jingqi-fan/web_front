<template>
  <div class="hotel-list-page">
    <!-- 筛选 + 搜索 -->
    <el-row class="filter-search" :gutter="16" align="middle">
      <!-- 筛选 -->
      <el-col :span="16" class="filter-col">
        <el-input-number
          v-model="minScore"
          :step="0.1"
          placeholder="最低评分"
          class="input-inline"
        />
        <el-input
          v-model="location"
          placeholder="位置关键字"
          clearable
          class="input-inline"
        />
        <el-input-number
          v-model="minPrice"
          placeholder="价格下限"
          class="input-inline"
        />
        <el-input-number
          v-model="maxPrice"
          placeholder="价格上限"
          class="input-inline"
        />
        <el-button type="primary" @click="onFilter">筛 选</el-button>
        <el-button @click="onReset">重 置</el-button>
      </el-col>
      <!-- 名称搜索 -->
      <el-col :span="8" class="search-col">
        <el-input
          v-model="searchName"
          placeholder="酒店名称精确搜索"
          clearable
          class="search-input"
        />
        <el-button type="primary" @click="onSearch">搜 索</el-button>
      </el-col>
    </el-row>

    <!-- 列表卡片 -->
    <el-row class="hotel-list" :gutter="24">
      <el-col v-for="h in hotels" :key="h.id" :span="6">
        <el-card class="hotel-card" shadow="hover">
          <img
            class="hotel-cover"
            :src="`/${h.img}`"
            alt="酒店图"
          />
          <div class="hotel-info">
            <h4>{{ h.hotelName }}</h4>
            <el-rate
              :model-value="h.score"
              disabled
              show-score
              allow-half
              class="rate"
            />
            <p class="location">
              <el-icon><Location /></el-icon>
              {{ h.location }}
            </p >
            <p class="price">¥<strong>{{ h.price }}</strong> 起</p >
          </div>
          <template #footer>
            <el-button type="text" @click="goDetail(h.id)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { filterHotels, searchHotelsByName } from '../api/hotel'
import type { Hotel } from '../entity/Hotel'
import { View, Location } from '@element-plus/icons-vue'

const router = useRouter()
const hotels = ref<Hotel[]>([])

const minScore = ref<number|undefined>()
const location = ref<string>('')
const minPrice = ref<number|undefined>()
const maxPrice = ref<number|undefined>()
const searchName = ref<string>('')

async function loadAll() {
  hotels.value = await filterHotels({})
}
onMounted(loadAll)

async function onFilter() {
  // 筛选前清空搜索
  searchName.value = ''
  hotels.value = await filterHotels({
    minScore: minScore.value,
    location: location.value || undefined,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
  })
}

async function onSearch() {
  // 搜索前清空筛选
  minScore.value = undefined
  location.value = ''
  minPrice.value = undefined
  maxPrice.value = undefined
  hotels.value = await searchHotelsByName(searchName.value || undefined)
}

function onReset() {
  searchName.value = ''
  minScore.value = undefined
  location.value = ''
  minPrice.value = undefined
  maxPrice.value = undefined
}

function goDetail(id: number) {
  router.push({ name: 'HotelDetail', params: { hotelId: id } })
}
</script>

<style lang="scss" scoped>
.hotel-list-page {
  padding: 24px;

  .filter-search {
    margin-bottom: 24px;

    .input-inline {
      width: 140px;
      margin-right: 8px;
    }

    .search-col {
      text-align: right;

      .search-input {
        width: 200px;
        margin-right: 8px;
      }
    }
  }

  .hotel-list {
    margin-top: 16px;

    .hotel-card {
      border-radius: 8px;
      overflow: hidden;

      .hotel-cover {
        width: 100%;
        height: 140px;
        object-fit: cover;
      }

      .hotel-info {
        padding: 12px 0;

        h4 {
          margin: 0 0 8px;
          font-size: 16px;
          color: var(--text-color);
        }

        .rate {
          margin-bottom: 8px;
        }

        .location {
          font-size: 12px;
          color: #909399;
          margin-bottom: 4px;
        }

        .price {
          font-size: 18px;
          color: var(--primary-color);
        }
      }

      .el-card__footer {
        text-align: right;
        padding-top: 12px;
      }
    }
  }
}
</style>