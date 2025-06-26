<template>
  <div class="shopping-container">
    <!-- 页面头部 -->
    <div class="header">
      <div class="header-content">
        <h1 class="title">
          <el-icon class="title-icon"><ShoppingCart /></el-icon>
          信用购物
        </h1>
       
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-card class="filter-card">
        <div class="filter-container">
          <!-- 商品名称搜索 -->
          <div class="search-box">
            <el-input
              v-model="searchForm.name"
              placeholder="搜索您想要的商品..."
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
              class="search-input"
              size="large"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleSearch" class="search-btn" size="large">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
          </div>

          <!-- 筛选条件 -->
          <div class="filter-row">
            <!-- 分类筛选 -->
            <div class="filter-item">
              <label class="filter-label">商品分类</label>
              <el-select
                v-model="searchForm.category"
                placeholder="选择分类"
                clearable
                @change="handleSearch"
                class="category-select"
                size="large"
              >
                <el-option
                  v-for="category in categories"
                  :key="category"
                  :label="category"
                  :value="category"
                />
              </el-select>
            </div>

            <!-- 价格范围筛选 -->
            <div class="filter-item">
              <label class="filter-label">价格范围</label>
              <div class="price-range">
                <el-input
                  v-model.number="searchForm.minPrice"
                  placeholder="最低价"
                  type="number"
                  @change="handleSearch"
                  class="price-input"
                  size="large"
                >
                  <template #prefix>¥</template>
                </el-input>
                <span class="price-separator">-</span>
                <el-input
                  v-model.number="searchForm.maxPrice"
                  placeholder="最高价"
                  type="number"
                  @change="handleSearch"
                  class="price-input"
                  size="large"
                >
                  <template #prefix>¥</template>
                </el-input>
              </div>
            </div>

            <!-- 重置按钮 -->
            <div class="filter-item">
              <el-button @click="resetFilters" class="reset-btn" size="large">
                <el-icon><RefreshLeft /></el-icon>
                重置筛选
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 商品列表 -->
    <div class="content-section">
      <el-card class="product-card">
        <!-- 商品统计信息 -->
        <div class="product-stats">
          <div class="stats-info">
            <span class="stats-text">共找到 <strong>{{ pagination.total }}</strong> 件商品</span>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-content">
            <el-icon class="is-loading loading-icon"><Loading /></el-icon>
            <p class="loading-text">正在加载商品信息...</p>
          </div>
        </div>

        <!-- 商品网格 -->
        <div v-else class="product-grid">
          <div
            v-for="product in productList"
            :key="product.id"
            class="product-item"
          >
            <el-card :body-style="{ padding: '0px' }" shadow="hover" class="product-card-item">
              <!-- 商品图片 -->
              <div class="product-image">
                <img
                  :src="product.img || '/api/placeholder/320/240'"
                  :alt="product.name"
                  @error="handleImageError"
                />
                <div class="product-overlay">
                  <el-button type="primary" circle @click="viewProduct(product)" size="large">
                    <el-icon><View /></el-icon>
                  </el-button>
                </div>
                <!-- 分类标签 -->
                <div class="category-badge">
                  <el-tag type="success" size="small">{{ product.category }}</el-tag>
                </div>
              </div>

              <!-- 商品信息 -->
              <div class="product-info">
                <h3 class="product-name" :title="product.name">{{ product.name }}</h3>
                
                <div class="product-price">
                  <span class="price">¥{{ formatPrice(product.price) }}</span>
                </div>
                
                <div class="product-shop">
                  <el-icon class="shop-icon"><Shop /></el-icon>
                  <span class="shop-name">{{ product.shop }}</span>
                </div>

                <div class="product-actions">
                  <el-button type="primary" @click="viewProduct(product)" class="view-btn">
                    <el-icon><View /></el-icon>
                    查看详情
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </div>

        <!-- 无数据状态 -->
        <div v-if="!loading && productList.length === 0" class="empty-state">
          <div class="empty-content">
            <el-icon class="empty-icon"><Box /></el-icon>
            <h3 class="empty-title">暂无商品</h3>
            <p class="empty-description">没有找到符合条件的商品，试试调整筛选条件</p>
            <el-button type="primary" @click="resetFilters" class="empty-btn">
              重新搜索
            </el-button>
          </div>
        </div>

        <!-- 分页组件 -->
        <div class="pagination-container" v-if="productList.length > 0">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[4, 8, 12, 16]"
            :small="false"
            :disabled="loading"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, View, Shop,ShoppingCart,  RefreshLeft, Loading, Box } from '@element-plus/icons-vue'
import { 
    getCommodityList, 
    getCommodityCategories, 
    searchCommodityByName,
    filterCommodityByCategory,
    filterCommodityByPriceRange,
    filterCommodities
} from '../api/commodity.ts'
import type { Commodity, CommoditySearchParams } from '../entity/Commodity.ts'

// 路由
const router = useRouter()

// 响应式数据
const loading = ref(false)
const productList = ref([])
const categories = ref([])

// 搜索表单
const searchForm = reactive({
  name: '',
  category: '',
  minPrice: null,
  maxPrice: null
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 4, // 修改为每页4条数据
  total: 0
})

// 获取分类列表
const fetchCategories = async () => {
  try {
    categories.value = await getCommodityCategories()
  } catch (error) {
    console.error('获取分类列表失败:', error)
    // 如果获取失败，使用默认分类
    categories.value = ['电子产品', '服装', '图书', '家居', '食品', '运动', '美妆']
  }
}

// 获取商品列表
const fetchProducts = async () => {
  loading.value = true
  try {
    const params: CommoditySearchParams = {
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...(searchForm.name && { name: searchForm.name }),
      ...(searchForm.category && { category: searchForm.category }),
      ...(searchForm.minPrice && { minPrice: searchForm.minPrice }),
      ...(searchForm.maxPrice && { maxPrice: searchForm.maxPrice })
    }
    
    const response = await getCommodityList(params)
    
    productList.value = response.records
    pagination.total = response.total
    pagination.currentPage = response.current
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
    productList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.currentPage = 1
  fetchProducts()
}

// 重置筛选条件
const resetFilters = () => {
  searchForm.name = ''
  searchForm.category = ''
  searchForm.minPrice = null
  searchForm.maxPrice = null
  pagination.currentPage = 1
  fetchProducts()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  fetchProducts()
}

// 当前页改变
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  fetchProducts()
}

// 格式化价格
const formatPrice = (price) => {
  return parseFloat(price).toFixed(2)
}

// 图片加载错误处理
const handleImageError = (event) => {
  event.target.src = '/api/placeholder/320/240'
}

// 查看商品详情
const viewProduct = (product) => {
  router.push({
    name: 'CommodityDetailsInCredit',
    params: { id: product.id }
  })
}

// 组件挂载时获取数据
onMounted(async () => {
  await fetchCategories() // 先获取分类
  await fetchProducts()   // 再获取商品
})
</script>

<style scoped>
.shopping-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
  opacity: 0.3;
}

.header-content {
  position: relative;
  z-index: 1;
}

.title {
  margin: 0 0 10px 0;
  font-size: 36px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.title-icon {
  font-size: 40px;
}

.subtitle {
  margin: 0;
  font-size: 18px;
  opacity: 0.9;
  font-weight: 300;
}

.search-filter-section {
  padding: 30px 20px;
  background: transparent;
}

.filter-card {
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: none;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.filter-container {
  padding: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.search-input {
  flex: 1;
  max-width: 500px;
}

.search-btn {
  padding: 12px 30px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.filter-row {
  display: flex;
  align-items: flex-end;
  gap: 25px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 5px;
}

.category-select {
  width: 180px;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price-input {
  width: 120px;
}

.price-separator {
  color: #999;
  font-weight: 500;
}

.reset-btn {
  border-radius: 12px;
  color: #666;
  border-color: #ddd;
}

.content-section {
  padding: 0 20px 40px;
}

.product-card {
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.product-stats {
  padding: 20px 25px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.stats-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stats-text {
  font-size: 16px;
  color: #666;
}

.loading-container {
  padding: 60px 20px;
  text-align: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.loading-icon {
  font-size: 48px;
  color: #667eea;
}

.loading-text {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  padding: 25px;
}

.product-card-item {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 480px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.product-card-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card-item:hover .product-image img {
  transform: scale(1.08);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card-item:hover .product-overlay {
  opacity: 1;
}

.category-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
}

.product-info {
  padding: 20px;
  height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  margin: 12px 0;
}

.price {
  font-size: 24px;
  font-weight: 700;
  color: #e74c3c;
  text-shadow: 0 1px 2px rgba(231, 76, 60, 0.2);
}

.product-shop {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  margin: 12px 0;
}

.shop-icon {
  color: #999;
}

.shop-name {
  font-weight: 500;
}

.product-actions {
  margin-top: auto;
}

.view-btn {
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.empty-icon {
  font-size: 64px;
  color: #ddd;
}

.empty-title {
  font-size: 24px;
  color: #666;
  margin: 0;
}

.empty-description {
  font-size: 16px;
  color: #999;
  margin: 0;
}

.empty-btn {
  border-radius: 12px;
  padding: 12px 30px;
  font-weight: 600;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 30px 20px 20px;
  border-top: 1px solid #f0f0f0;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 28px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .search-box {
    flex-direction: column;
    gap: 10px;
  }
  
  .search-input {
    max-width: none;
  }
  
  .price-range {
    justify-content: center;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
    padding: 15px;
  }
  
  .header {
    padding: 30px 15px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 14px;
  }
}
</style>