<template>
  <div class="hotel-list-page">
    <!-- 筛选 + 搜索 区（固定） -->
    <el-row class="filter-search" :gutter="16" align="middle">
      <!-- 筛 选 -->
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
      <!-- 搜 索 -->
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

    <!-- 中间可滚动列表 + 分页 -->
    <div class="hotel-list-container">
      <el-row class="hotel-list" :gutter="24">
        <el-col
          v-for="h in displayedHotels"
          :key="h.id"
          :span="6"
        >
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
              <el-button link @click="goDetail(h.id)">
                <el-icon><View /></el-icon>
                查看
              </el-button>
            </template>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分页控件 -->
      <el-pagination
        class="pagination"
        background
        :current-page="currentPage"
        :page-size="pageSize"
        :total="hotels.length"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { filterHotels, searchHotelsByName } from '../../api/hotel'
import type { Hotel } from '../../entity/Hotel'
import { View, Location } from '@element-plus/icons-vue'



const router = useRouter()
const hotels = ref<Hotel[]>([])

// 筛选/搜索条件
const minScore = ref<number|undefined>()
const location = ref<string>('')
const minPrice = ref<number|undefined>()
const maxPrice = ref<number|undefined>()
const searchName = ref<string>('')

// 分页状态
const pageSize = 12
const currentPage = ref(1)
const displayedHotels = computed(() =>
  hotels.value.slice(
    (currentPage.value - 1) * pageSize,
    currentPage.value * pageSize
  )
)

// 加载所有酒店
async function loadAll() {
  hotels.value = await filterHotels({})
  currentPage.value = 1
}

onMounted(loadAll)

// 筛选
async function onFilter() {
  searchName.value = ''
  hotels.value = await filterHotels({
    minScore: minScore.value,
    location: location.value || undefined,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
  })
  currentPage.value = 1
}

// 搜索
async function onSearch() {
  minScore.value = undefined
  location.value = ''
  minPrice.value = undefined
  maxPrice.value = undefined
  hotels.value = await searchHotelsByName(searchName.value || undefined)
  currentPage.value = 1
}

// 重置
async function onReset() {

  searchName.value = ''
  minScore.value = undefined
  location.value = ''
  minPrice.value = undefined
  maxPrice.value = undefined
  await loadAll()
}

// 翻页回调
function handlePageChange(page: number) {
  currentPage.value = page
}

// 详情跳转
function goDetail(id: number) {
  router.push({ name: 'HotelDetail', params: { hotelId: id } })
}
</script>

<style lang="scss" scoped>
.hotel-list-page {
  display: flex;
  flex-direction: column;
  height: 94vh;
  padding: 24px;
  background-color: #fff;
  overflow-y: hidden;

  .filter-search {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 10;
    margin-bottom: 16px;

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

  .hotel-list-container {
    margin-bottom: 1%;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 12px;

    .hotel-list {
      margin-top: 5;
      margin-bottom: 10;

      .hotel-card {
        border-radius: 8px;
        overflow: hidden;
        background-color: #fbfbf6;

        .hotel-cover {
          width: 100%;
          height: 145px;
          object-fit: cover;
        }

        .hotel-info {
          padding: 8px 0;

          h4 {
            margin: 0 0 8px;
            font-size: 16px;
            color: var(--text-color);
          }

          .rate {
            margin-bottom: 6px;
          }

          .location {
            font-size: 12px;
            color: #909399;
            margin-bottom: 4px;
          }

          .price {
            font-size: 18px;
            color: var(--primary-color);
            margin-bottom: 4px;
          }
        }

        .el-card__footer {
          text-align: right;
          padding-top: 6px;
        }
      }
    }

    .pagination {
      text-align: center;
      padding: 16px 0;
      background: #fff;
    }
  }
}
</style>