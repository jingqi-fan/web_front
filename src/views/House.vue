<template>
  <div class="house-page">
    <!-- 头部 -->
    <div class="header">
      <div class="header-content">
        <div class="logo">便捷租房</div>
        <div style="color: rgba(255,255,255,0.8);">帮您找到理想的家</div>
      </div>
    </div>

    <!-- 搜索筛选区 -->
    <div class="search-section">
      <div class="search-content">
        <!-- 搜索框 -->
        <div class="filter-row">
          <div class="filter-label">搜索房源</div>
          <el-input
            v-model="searchTitle"
            placeholder="请输入房源标题关键词"
            class="search-bar"
            @keyup.enter="handleSearch"
            clearable>
            <template #append>
              <el-button @click="handleSearch" type="primary">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>

        <!-- 筛选条件 -->
        <div class="filter-row">
          <div class="filter-label">区域筛选</div>
          <div class="filter-group">
            <el-select v-model="selectedDistrict" placeholder="选择区域" clearable style="width: 150px">
              <el-option label="全部区域" value=""></el-option>
              <el-option 
                v-for="district in districtOptions" 
                :key="district" 
                :label="district" 
                :value="district">
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="filter-row">
          <div class="filter-label">租金范围</div>
          <div class="filter-group">
            <div class="price-range-inputs">
              <el-input-number 
                v-model="minPrice" 
                placeholder="最低价" 
                :min="0" 
                :precision="0"
                class="price-input"
                controls-position="right">
              </el-input-number>
              <span>-</span>
              <el-input-number 
                v-model="maxPrice" 
                placeholder="最高价" 
                :min="0" 
                :precision="0"
                class="price-input"
                controls-position="right">
              </el-input-number>
              <span style="color: #999; font-size: 14px;">元/月</span>
            </div>
          </div>
        </div>

        <div class="filter-row">
          <div class="filter-label">租赁类型</div>
          <div class="filter-group">
            <el-select v-model="selectedRentalType" placeholder="选择类型" clearable style="width: 150px">
              <el-option label="全部类型" value=""></el-option>
              <el-option label="整租" value="0"></el-option>
              <el-option label="合租" value="1"></el-option>
            </el-select>
          </div>
        </div>

        <div class="filter-row">
          <div class="filter-buttons">
            <el-button type="primary" @click="applyFilters">应用筛选</el-button>
            <el-button @click="clearFilters" class="clear-btn">清空筛选</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 统计信息 -->
      <div class="stats-section">
        <div class="stats-row">
          <div class="total-count">
            共找到 <span class="highlight">{{ totalHouses }}</span> 套房源
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading" :size="40"><Loading /></el-icon>
        <div style="margin-top: 16px;">正在加载房源信息...</div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="houseList.length === 0" class="empty-state">
        <div class="empty-icon">🏠</div>
        <div class="empty-text">暂无符合条件的房源</div>
        <div class="empty-hint">试试调整筛选条件或搜索其他关键词</div>
        <el-button @click="getAllHouses" style="margin-top: 16px;">重新加载</el-button>
      </div>

      <!-- 房源列表 -->
      <div v-else class="house-grid">
        <div 
          v-for="house in houseList" 
          :key="house.id" 
          class="house-card"
          @click="viewHouseDetail(house)">
          
          <div class="house-image">
            <img v-if="house.img" :src="house.img" :alt="house.title" @error="handleImageError">
            <div v-else>暂无图片</div>
            <div class="rental-badge" :class="getRentalTypeClass(house)">
              {{ getRentalTypeText(house) }}
            </div>
          </div>
          
          <div class="house-info">
            <div class="house-title">{{ house.title }}</div>
            
            <div class="house-address">
              <el-icon class="address-icon"><Location /></el-icon>
              {{ house.address }}
            </div>
            
            <div class="house-features">
              <div class="district-tag">{{ house.district }}</div>
              <div class="feature-tag">ID: {{ house.id }}</div>
            </div>
            
            <div class="house-price">
              <div class="price-section">
                <span class="price">¥{{ formatPrice(house.price) }}</span>
                <span class="price-unit">/月</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页组件 -->
      <div class="pagination-container" v-if="houseList.length > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[3, 6, 9, 12]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalHouses"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Location, Loading } from '@element-plus/icons-vue'
import { getHouseList, searchHouseByTitle, filterHouses, getDistrictOptions, filterHouseByDistrict, filterHouseByRentalType, filterHouseByPriceRange } from '../api/house.ts'
import type { House, HouseSearchParams } from '../entity/House.ts'
import { useRouter } from 'vue-router'




// 组件名称
const name = 'HousePage'
    // 响应式数据
    const houseList = ref([])
    const loading = ref(false)
    const searchTitle = ref('')
    const selectedDistrict = ref('')
    const selectedRentalType = ref('')
    const minPrice = ref(null)
    const maxPrice = ref(null)
    const districtOptions = ref([])
    const currentPage = ref(1)
    const pageSize = ref(3) // 修改默认每页显示3条数据
    const totalHouses = ref(0)


const router = useRouter()

    // 计算属性
    const totalCount = computed(() => houseList.value.length)

    // 获取所有房源
    const getAllHouses = async () => {
      loading.value = true
      try {
        const params: HouseSearchParams = {
          pageNum: currentPage.value,
          pageSize: pageSize.value
        }
        
        const response = await getHouseList(params)
        
        houseList.value = response.records
        totalHouses.value = response.total
        
        // 提取所有区域选项
        const districts = [...new Set(response.records.map(house => house.district).filter(d => d))]
        districtOptions.value = districts.sort()
        
        if (response.records.length > 0) {
          ElMessage.success(`成功加载 ${response.records.length} 套房源`)
        }
        
      } catch (error) {
        console.error('获取房源失败:', error)
        ElMessage.error(`获取房源数据失败: ${error.message}`)
        houseList.value = []
      } finally {
        loading.value = false
      }
    }

    // 按标题搜索
    const searchByTitle = async (title) => {
      if (!title.trim()) {
        getAllHouses()
        return
      }
      
      loading.value = true
      try {
        console.log('搜索标题:', title)
        const response = await searchHouseByTitle(title.trim(), currentPage.value, pageSize.value)
        console.log('搜索结果:', response)
        
        houseList.value = response.records
        totalHouses.value = response.total
        
        ElMessage.success(`搜索到 ${response.records.length} 套相关房源`)
      } catch (error) {
        console.error('搜索失败:', error)
        ElMessage.error('搜索失败，请稍后重试')
        houseList.value = []
      } finally {
        loading.value = false
      }
    }

    // 处理搜索
    const handleSearch = () => {
      console.log('执行搜索，关键词:', searchTitle.value)
      if (searchTitle.value.trim()) {
        // 清空其他筛选条件
        selectedDistrict.value = ''
        selectedRentalType.value = ''
        minPrice.value = null
        maxPrice.value = null
        currentPage.value = 1
        // 使用统一的getHouseList接口进行搜索
        searchHouses()
      } else {
        getAllHouses()
      }
    }

    // 统一的搜索函数
    const searchHouses = async () => {
      loading.value = true
      try {
        const params: HouseSearchParams = {
          pageNum: currentPage.value,
          pageSize: pageSize.value,
          ...(searchTitle.value && { title: searchTitle.value }),
          ...(selectedDistrict.value && { district: selectedDistrict.value }),
          ...(selectedRentalType.value && { rentalType: selectedRentalType.value }),
          ...(minPrice.value !== null && { minPrice: minPrice.value }),
          ...(maxPrice.value !== null && { maxPrice: maxPrice.value })
        }
        
        console.log('搜索参数:', params)
        const response = await getHouseList(params)
        
        houseList.value = response.records
        totalHouses.value = response.total
        
        if (searchTitle.value) {
          ElMessage.success(`搜索到 ${response.records.length} 套相关房源`)
        }
      } catch (error) {
        console.error('搜索失败:', error)
        ElMessage.error('搜索失败，请稍后重试')
        houseList.value = []
      } finally {
        loading.value = false
      }
    }

    // 单独的筛选方法
const filterByDistrict = async (district) => {
  loading.value = true
  try {
    const response = await filterHouseByDistrict(
      district,
      currentPage.value,
      pageSize.value
    )
    
    houseList.value = response.records
    totalHouses.value = response.total
    
    ElMessage.success(`筛选到 ${response.records.length} 套房源`)
  } catch (error) {
    console.error('区域筛选失败:', error)
    ElMessage.error('区域筛选失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

    const filterByRentalType = async (type) => {
  loading.value = true
  try {
    const response = await filterHouseByRentalType(
      type,
      currentPage.value,
      pageSize.value
    )
    
    houseList.value = response.records
    totalHouses.value = response.total
    
    ElMessage.success(`筛选到 ${response.records.length} 套房源`)
  } catch (error) {
    console.error('类型筛选失败:', error)
    ElMessage.error('类型筛选失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

    const filterByPriceRange = async (min, max) => {
  loading.value = true
  try {
    const response = await filterHouseByPriceRange(
      min,
      max,
      currentPage.value,
      pageSize.value
    )
    
    houseList.value = response.records
    totalHouses.value = response.total
    
    ElMessage.success(`筛选到 ${response.records.length} 套房源`)
  } catch (error) {
    console.error('价格筛选失败:', error)
    ElMessage.error('价格筛选失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

    // 应用筛选 - 支持多条件筛选
const applyFilters = async () => {
  console.log('应用筛选条件:', {
    district: selectedDistrict.value,
    rentalType: selectedRentalType.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value
  })
  
  // 清空搜索框
  searchTitle.value = ''
  // 重置到第一页
  currentPage.value = 1
  
  // 如果没有任何筛选条件，则获取所有房源
  if (!selectedDistrict.value && !selectedRentalType.value && 
      minPrice.value === null && maxPrice.value === null) {
    getAllHouses()
    return
  }
  
  // 使用统一的搜索函数进行筛选
  searchHouses()
}

    // 清空筛选
    const clearFilters = () => {
      searchTitle.value = ''
      selectedDistrict.value = ''
      selectedRentalType.value = ''
      minPrice.value = null
      maxPrice.value = null
      currentPage.value = 1
      getAllHouses()
    }

    // 获取租赁类型样式类
    const getRentalTypeClass = (house) => {
      const type = house.rentalType?.toString() || house.rental_type?.toString() || '0'
      return type === '0' ? 'whole' : 'shared'
    }

    // 获取租赁类型文本
    const getRentalTypeText = (house) => {
      const type = house.rentalType?.toString() || house.rental_type?.toString() || '0'
      return type === '0' ? '整租' : '合租'
    }

    // 查看房源详情
    //const viewHouseDetail = (house) => {
    //  ElMessage.info(`点击了房源: ${house.title}`)
  //  }







// 添加查看房源详情的方法
const viewHouseDetail = (house) => {
  console.log('点击查看房源详情:', house)
  // 跳转到房源详情页面，传递房源ID
  router.push({
    name: 'HouseDetailsInCredit',
    params: {
      id: house.id
    },
    query: {
      title: house.title // 可选：传递标题用于页面展示
    }
  })
}



    // 格式化价格
    const formatPrice = (price) => {
      if (price === null || price === undefined) return '0'
      return new Intl.NumberFormat('zh-CN').format(price)
    }

    // 处理图片加载错误
    const handleImageError = (event) => {
      event.target.style.display = 'none'
      event.target.parentNode.innerHTML = '<div style="color: #999; font-size: 14px;">图片加载失败</div>'
    }

    // 处理页码变化
    const handleCurrentChange = async (page) => {
      currentPage.value = page
      
      // 如果是搜索结果，则重新搜索
      if (searchTitle.value.trim()) {
        searchByTitle(searchTitle.value)
        return
      }
      
      // 检查是否有多个筛选条件
      const hasMultipleFilters = [
        !!selectedDistrict.value,
        !!selectedRentalType.value,
        minPrice.value !== null,
        maxPrice.value !== null
      ].filter(Boolean).length > 1
      
      // 如果有多个筛选条件，使用多条件筛选
      if (hasMultipleFilters) {
        loading.value = true
        try {
          // 构建查询参数，包含所有筛选条件
          const params = {
            pageNum: currentPage.value,
            pageSize: pageSize.value
          }
          
          if (selectedDistrict.value) {
            params.district = selectedDistrict.value
          }
          
          if (selectedRentalType.value) {
            params.rentalType = selectedRentalType.value
          }
          
          if (minPrice.value !== null) {
            params.minPrice = minPrice.value
          }
          
          if (maxPrice.value !== null) {
            params.maxPrice = maxPrice.value
          }
          
          // 使用 house.ts API 进行筛选
          const response = await filterHouses(params)
          
          // 处理分页数据结构
          houseList.value = response.records || []
          totalHouses.value = response.total || 0
        } catch (error) {
          console.error('分页筛选失败:', error)
          // 如果多条件筛选API不存在，则回退到单条件筛选
          handleSingleFilterPagination()
        } finally {
          loading.value = false
        }
      } else {
        // 单一筛选条件或无筛选条件
        handleSingleFilterPagination()
      }
    }
    
    // 处理单一筛选条件的分页
    const handleSingleFilterPagination = () => {
      if (selectedDistrict.value) {
        filterByDistrict(selectedDistrict.value)
      } else if (selectedRentalType.value) {
        filterByRentalType(selectedRentalType.value)
      } else if (minPrice.value !== null || maxPrice.value !== null) {
        filterByPriceRange(minPrice.value, maxPrice.value)
      } else {
        getAllHouses()
      }
    }
    
    // 处理每页显示数量变化
    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1 // 重置到第一页
      // 调用页码变化处理函数，复用逻辑
      handleCurrentChange(1)
    }

    // 组件挂载时获取数据
    onMounted(() => {
      console.log('组件挂载，开始获取数据')
      getAllHouses()
    })

// 在script setup中，所有的响应式变量和函数都会自动暴露给模板
// 不需要return语句
</script>

<style scoped>
/* 保持之前的所有样式... */
.house-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #18beaa 0%, #4c84ff 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 28px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.logo::before {
  content: "🏠";
  margin-right: 10px;
  font-size: 32px;
}

.search-section {
  background: white;
  padding: 30px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border-bottom: 1px solid #e8eaec;
}

.search-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 20px;
}

.filter-label {
  font-weight: 600;
  color: #333;
  min-width: 80px;
  font-size: 14px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.search-bar {
  width: 100%;
  max-width: 500px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.stats-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.stats-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-count {
  font-size: 16px;
  color: #333;
}

.highlight {
  color: #18beaa;
  font-weight: bold;
}

.debug-section {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
}

.debug-section h4 {
  margin-bottom: 10px;
  color: #495057;
}

.debug-section pre {
  background: white;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  font-size: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.house-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.house-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.house-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border-color: #18beaa;
}

.house-image {
  width: 100%;
  height: 220px;
  background: linear-gradient(45deg, #f0f2f5, #e1e5e9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  position: relative;
  overflow: hidden;
}

.house-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rental-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
}

.rental-badge.whole {
  background: linear-gradient(45deg, #52c41a, #73d13d);
}

.rental-badge.shared {
  background: linear-gradient(45deg, #fa8c16, #ffc53d);
}

.house-info {
  padding: 20px;
}

.house-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.house-address {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.address-icon {
  margin-right: 6px;
  color: #999;
}

.house-features {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  background: #f0f2f5;
  color: #666;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
}

.house-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-section {
  display: flex;
  align-items: baseline;
}

.price {
  color: #ff4757;
  font-size: 24px;
  font-weight: bold;
}

.price-unit {
  color: #999;
  font-size: 14px;
  margin-left: 4px;
}

.district-tag {
  background: #e6f7ff;
  color: #1890ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px;
  flex-direction: column;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 14px;
  color: #ccc;
}

.pagination-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.price-range-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price-input {
  width: 120px;
}

.filter-buttons {
  display: flex;
  gap: 12px;
}

.clear-btn {
  color: #666;
}
</style>