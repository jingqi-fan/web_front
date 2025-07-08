<template>
  <div class="parking-explore">
    <div class="page-header">
      <el-icon><Place /></el-icon>
      <span class="title">推荐停车场</span>
    </div>

    <!-- 类型筛选 -->
    <el-select v-model="query.type" placeholder="选择停车场类型" @change="fetchParkingList" style="margin-bottom: 20px; width: 200px">
      <el-option v-for="opt in typeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
    </el-select>

    <!-- 推荐卡片列表 -->
    <el-row :gutter="20">
      <el-col :span="8" v-for="item in parkingList" :key="item.id">
        <el-card :body-style="{ padding: '16px' }" shadow="hover" @click="goToDetail(item.id)" style="cursor: pointer">
          <img :src="item.image" alt="封面" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px" />
          <div style="margin-top: 12px">
            <h3>{{ item.title }}</h3>
            <p>{{ item.location }}</p>
            <p>剩余车位：{{ item.leftCount }} / {{ item.totalCount }}</p>
            <p>价格：{{ item.price }} 元/小时</p>
            <el-tag size="small" style="margin-top: 5px">{{ item.tag }}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getRecommendParking, getParkingByType } from '@/api/life/park.ts'
import type { ParkingLotsSimpleInfoRes, ParkingLotsInfoRes } from '@/api/life/type.ts'
import { useRouter } from 'vue-router'
import { Place } from '@element-plus/icons-vue'

const router = useRouter()
const parkingList = ref<(ParkingLotsSimpleInfoRes | ParkingLotsInfoRes)[]>([])

const query = reactive({
  type: 0,
  title: '',
  pageNum: 1,
  pageSize: 10
})

const typeOptions = [
  { value: 0, label: '全部' },
  { value: 1, label: '市中心' },
  { value: 2, label: '商业中心' },
  { value: 3, label: '住宅区' },
  { value: 4, label: '旅游景点区' },
  { value: 5, label: '医院周边' },
  { value: 6, label: '室内' },
  { value: 7, label: '室外' },
  { value: 8, label: '露天' },
  { value: 9, label: '地下' }
]

const fetchParkingList = async () => {
  if (query.type === 0) {
    const res = await getRecommendParking()
    if (res.code === 200) {
      parkingList.value = res.data
    }
  } else {
    const res = await getParkingByType(query.pageNum, query.pageSize, query.type, '')
    if (res.code === 200) {
      parkingList.value = res.data.lotsInfoResList
    }
  }
}

const goToDetail = (lotId: number) => {
  router.push({ name: 'ParkingDetail', params: { lotId } })
}

onMounted(() => {
  fetchParkingList()
})
</script>

<style scoped>
.page-header {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.page-header .el-icon {
  margin-right: 8px;
}
</style>
