<template>
  <div class="parking-system">
    <!-- 顶部标题栏 -->
    <el-header class="top-bar">
      <el-button type="text" :icon="Back" @click="goBack" >返回</el-button>
      <div class="title">智能停车系统</div>
      <el-avatar :size="30" :src="userInfo.avatar" />
    </el-header>

    <el-container>
      <!-- 左侧导航栏 -->
      <el-aside width="240px" class="side-nav">
        <el-menu default-active="0" @select="handleSelect">
          <el-sub-menu index="area">
            <template #title>区域分类</template>
            <el-menu-item index="0"><el-icon><Location /></el-icon> 默认</el-menu-item>
            <el-menu-item index="1"><el-icon><Location /></el-icon> 市中心区域</el-menu-item>
            <el-menu-item index="2"><el-icon><OfficeBuilding /></el-icon> 商业中心区域</el-menu-item>
            <el-menu-item index="3"><el-icon><House /></el-icon> 住宅区</el-menu-item>
            <el-menu-item index="4"><el-icon><Flag /></el-icon> 旅游景点区</el-menu-item>
            <el-menu-item index="5"><el-icon><Medal /></el-icon> 医院周边</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="type">
            <template #title>停车场类型</template>
            <el-menu-item index="6"><el-icon><Grid /></el-icon> 室内停车场</el-menu-item>
            <el-menu-item index="7"><el-icon><Sunny /></el-icon> 室外停车场</el-menu-item>
            <el-menu-item index="8"><el-icon><Moon /></el-icon> 露天停车场</el-menu-item>
            <el-menu-item index="9"><el-icon><Box /></el-icon> 地下停车场</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容区 -->
      <el-main class="parking-content">
        <!-- 筛选栏 -->
        <div class="filter-bar">
          <el-input v-model="searchKeyword" placeholder="搜索停车场名称" style="width: 220px" />
          <el-select v-model="selectedTag" placeholder="选择标签" style="width: 160px">
            <el-option label="全部" value="" />
            <el-option label="室内" value="室内" />
            <el-option label="室外" value="室外" />
            <el-option label="露天" value="露天" />
            <el-option label="地下" value="地下" />
          </el-select>
          <el-select v-model="priceSort" placeholder="按价格排序" style="width: 160px">
            <el-option label="默认" value="default" />
            <el-option label="价格升序" value="asc" />
            <el-option label="价格降序" value="desc" />
          </el-select>
          <el-button type="success" @click="applyFilters">筛选</el-button>
        </div>

        <el-row :gutter="20" style="height: 600px;overflow-y: auto">
          <el-col v-for="lot in filteredList" :key="lot.id" :span="6">
            <el-card class="parking-card">
              <div class="card-header">
                <span class="lot-title">{{ lot.title }}</span>
                <el-tag :type="tagColorMap[lot.tag] || 'info'">{{ getParkingType(lot.tag) }}</el-tag>
              </div>
              <div class="card-location">
                <el-icon><Location /></el-icon>
                {{ lot.location }}
              </div>
              <div class="card-stats">
                <div>
                  <div class="label">总车位</div>
                  <div class="value">{{ lot.totalCount }}</div>
                </div>
                <div>
                  <div class="label">剩余车位</div>
                  <div class="value" :style="{ color: getSpaceColor(lot.leftCount, lot.totalCount) }">
                    {{ lot.leftCount }}
                  </div>
                </div>
                <div>
                  <div class="label">收费标准</div>
                  <div class="value">¥{{ lot.price }}</div>
                </div>
              </div>
              <div class="card-actions">
                <el-button type="info" size="small" @click="detailOfParkingLot">详情</el-button>
                <el-button type="success" size="small" @click="preorderParkingLot(lot.id)">预约</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <div class="pagination">
          <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :page-size="pageSize"
              @current-change="handlePageChange"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getParkingByType } from '@/api/life/parking_api'
import type { ParkingLotsInfoRes } from '@/api/life/parking_type'
import { useUserInfoStore } from '@/stores/useUserInfoStore'
import { Location, Back, OfficeBuilding, House, Medal, Flag, Grid, Sunny, Moon, Box } from '@element-plus/icons-vue'
import router from "@/router";

const userInfo = useUserInfoStore().user
const parkingList = ref<ParkingLotsInfoRes[]>([])
const total = ref(0)
const pageSize = 10
const currentType = ref('1')
const searchKeyword = ref('')
const selectedTag = ref('')
const priceSort = ref('default')

const tagColorMap: Record<string, string> = {
  '0': 'info',
  '1': 'success',
  '2': 'warning',
  '3': 'info',
  '4': 'info',
  '5': 'info',
  '6': 'danger',
  '7': 'danger',
  '8': 'danger',
  '9': 'info',
}

const preorderParkingLot=(id:number)=>{
  router.push(`/parking/lot/${id}`)
}
const detailOfParkingLot=()=>{
  ElMessage.warning("暂未开放详情功能！")
}


const getSpaceColor = (left: number, total: number): string => {
  const ratio = left / total
  if (ratio > 0.5) return '#67C23A' // 绿色
  if (ratio > 0.3) return '#409EFF' // 蓝色
  if (ratio > 0.1) return '#E6A23C' // 黄色
  return '#F56C6C' // 红色
}

const filteredList = computed(() => {
  let list = parkingList.value
  if (searchKeyword.value) {
    list = list.filter(l => l.title.includes(searchKeyword.value))
  }
  if (selectedTag.value) {
    list = list.filter(l => l.tag === selectedTag.value)
  }
  if (priceSort.value === 'asc') {
    list = [...list].sort((a, b) => a.price - b.price)
  } else if (priceSort.value === 'desc') {
    list = [...list].sort((a, b) => b.price - a.price)
  }
  return list
})

const goBack = () => history.back()

const fetchData = async (pageNum = 1) => {
  try {
    const res = await getParkingByType(pageNum, pageSize, currentType.value)
    parkingList.value = res.lotsInfoResList
    total.value = res.totalCount
  } catch (err) {
    ElMessage.error('加载停车场信息失败')
  }
}

const handleSelect = (index: string) => {
  currentType.value = Number(index)
  fetchData(1)
}

const handlePageChange = (page: number) => {
  fetchData(page)
}
const getParkingType=(type:string)=>{
  switch(type){
    case '0':return '默认'
    case '1':return '市中心区域'
    case '2':return '商业中心区'
    case '3':return '住宅区'
    case '4':return '旅游景点区'
    case '5':return '医院周边'
    case '6':return '室内'
    case '7':return '室外'
    case '8':return '露天'
    case '9':return '地下'
    default: return '暂无分类'
  }
}
const applyFilters = () => {}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.parking-system {
  background-color: #f5f7fa;
  height: 98vh;
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #eee;

  .title {
    font-size: 18px;
    font-weight: bold;
  }
}

.side-nav {
  background-color: #fff;
  padding: 12px 0;
  height: 100%;
  border-right: 1px solid #eee;
}

.parking-content {
  padding: 20px;
  height: 750px;
  background-color: #f0f2f5;
  overflow-y: auto;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.parking-card {
  margin-bottom: 20px;
  width: 280px;
  height: 180px;
  border-radius: 10px;

  .card-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
  }

  .card-location {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .card-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .label {
      font-size: 12px;
      color: #999;
    }
    .value {
      font-size: 14px;
      font-weight: bold;
    }
  }

  .card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}

.pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
