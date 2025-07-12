<template>
  <el-container  class="borrow-center">
    <el-header class="top-bar">
      <el-button type="text" :icon="Back" @click="router.back()" />
      <div class="title">图书借阅中心</div>
      <div class="right-area">
        <el-button type="primary" size="small" @click="goToMyBorrowings">我的借阅</el-button>
        <el-avatar :size="30" :src="userInfo.profilePicture" />
      </div>
    </el-header>
    <el-container class="main-body">
      <el-aside width="180px" class="aside">
        <el-menu :default-active="activeCategory.toString()" @select="handleCategoryChange">
          <el-menu-item index="0">全部分类</el-menu-item>
          <el-menu-item
              v-for="category in categories"
              :key="category.id"
              :index="category.id.toString()"
          >
            {{ category.name }}
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="content">
        <div class="search-bar">
          <el-input
              v-model="searchKeyword"
              placeholder="请输入书名"
              prefix-icon="Search"
              @input="handleSearch"
              clearable
              style="width: 300px"
          />
        </div>
        <div class="book-list">
          <el-card
              v-for="book in filteredBooks"
              :key="book.id"
              class="book-card"
              shadow="hover"
          >
            <div class="book-cover">
              <img :src="book.image" alt="封面" />
            </div>
            <div class="book-info">
              <div class="book-title">{{ book.bookName }}</div>
              <div class="book-author">作者：{{ book.author }}</div>
              <div class="book-intro">{{ book.bookIntroduction }}</div>
              <div class="book-footer">
                <el-tag :type="book.stock > 0 ? 'success' : 'info'" size="small">
                  {{ book.stock > 0 ? '可借阅' : '已借出' }}
                </el-tag>
                <div class="button-group">
                  <el-button
                      type="info"
                      size="small"
                      plain
                      @click="viewDetail(book.id)"
                  >
                    详情
                  </el-button>
                  <el-button
                      type="primary"
                      size="small"
                      :disabled="book.stock <= 0 || borrowList.includes(book.id)"
                      @click="addToList(book.id)"
                  >
                    借阅
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <div class="pagination">
          <el-pagination
              background
              layout="prev, pager, next"
              :page-size="pageSize"
              :total="total"
              v-model:current-page="currentPage"
          />
        </div>
      </el-main>

    </el-container>
    <el-footer class="borrow-footer">
      <div class="footer-content">
        <span>当前借阅书籍：<strong>{{ borrowList.length }}</strong> 本</span>
        <el-button type="primary" style="margin-left: 1100px" size="small" @click="viewPreBookList">查看清单</el-button>
        <el-button type="success" size="small" @click="submitBorrowList">提交借阅</el-button>
      </div>
    </el-footer>
  </el-container>
  <el-dialog
      v-model="borrowListDialogVisible"
      title="我的借阅清单"
      width="600px"
      :close-on-click-modal="false"
  >
    <div v-if="borrowListData.length === 0">暂无借阅项</div>
    <div v-else class="borrow-list-dialog">
      <div
          class="borrow-item"
          v-for="book in borrowListData"
          :key="book.id"
      >
        <img :src="book.image" alt="封面" class="book-img" />
        <div class="book-info">
          <div class="book-title">{{ book.bookName }}</div>
          <div class="book-author">作者：{{ book.author }}</div>
          <div class="book-price">预计费用：{{ book.estimatedCost || '免费' }}</div>
        </div>
      </div>
    </div>
  </el-dialog>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Back } from '@element-plus/icons-vue'
import {
  addToBookListing,
  deleteFromBookListing,
  getBookDetail, getBookListing,
  getBooksPage,
  getBorrowRecords,
  preOrderBooks
} from '@/api/life/book_api'
import type { Book } from '@/api/life/book_api'
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";
import {ElMessage, ElMessageBox} from "element-plus";
import router from "@/router";

const goToMyBorrowings = () => router.push('/my-borrowings')

// 分类列表
const categories = [
  { id: 1, name: '文学' },
  { id: 2, name: '社科' },
  { id: 3, name: '科技' },
  { id: 4, name: '少儿' },
  { id: 5, name: '教育' },
  { id: 6, name: '生活' },
  { id: 7, name: '技术应用' },
  { id: 8, name: '艺术' },
]

const activeCategory = ref(0)
const bookList = ref<Book[]>([])
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = 10
const total = ref(0)

const userInfoStore=useUserInfoStore()
const userInfo = userInfoStore.user
const fetchBookPage = async () => {
  const res = await getBooksPage(currentPage.value, pageSize, activeCategory.value, '')
  bookList.value = res.booksList
  total.value = res.total
}

onMounted(fetchBookPage)

const handleCategoryChange = (id: string) => {
  activeCategory.value = Number(id)
  currentPage.value = 1
  fetchBookPage()
}
watch(currentPage, () => {
  fetchBookPage()
})

const filteredBooks = computed(() =>
    bookList.value.filter((book) =>
        book.bookName.toLowerCase().includes(searchKeyword.value.toLowerCase().trim())
    )
)
const viewDetail =async (bookId: number) => {
  const res=await getBookDetail(bookId)
  await ElMessageBox.confirm({
    title: '图书详情',
    message: `书名：${res.bookName}，作者：${res.author}`,
    confirmButtonText: '确定'
  })
}

const userId=userInfo.id
const borrowList = ref<number[]>([])

const addToList = async (bookId: number) => {
  if (borrowList.value.includes(bookId)) {
    ElMessage.warning('已在借阅清单中')
    return
  }
  const res = await addToBookListing(bookId, userId)
  ElMessage.success(res || '添加成功')
  borrowList.value.push(bookId)
}

const removeFromList = async (bookId: number) => {
  const res = await deleteFromBookListing(bookId, userId)
  ElMessage.success(res || '删除成功')
  borrowList.value = borrowList.value.filter(id => id !== bookId)
}

const submitBorrowList = async () => {
  if (borrowList.value.length === 0) {
    ElMessage.warning('请先选择要借阅的图书')
    return
  }
  const res=await preOrderBooks(userId)

  await ElMessageBox.alert(`成功提交 ${borrowList.value.length} 本图书的借阅请求`,res?res: '借阅成功')
  borrowList.value = []
}
const borrowListDialogVisible = ref(false)
const borrowListData = ref<Book[]>([])

const viewPreBookList = async () => {

  const res = await getBookListing(userId)
  console.log("预览借阅项",res)
  borrowListData.value = res || []
  borrowListDialogVisible.value = true
}

</script>

<style scoped lang="scss">
.borrow-center {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
}

.borrow-list-dialog {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px 0;

  .borrow-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 8px;
    border-bottom: 1px solid #eee;

    .book-img {
      width: 80px;
      height: 100px;
      object-fit: cover;
      border-radius: 4px;
    }

    .book-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .book-title {
        font-weight: bold;
        font-size: 15px;
        color: #333;
      }

      .book-author,
      .book-price {
        font-size: 13px;
        color: #666;
      }
    }
  }
}

.top-bar {
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 0 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

  .title {
    font-size: 18px;
    font-weight: bold;
  }

  .right-area {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
.borrow-footer {
  position: sticky;
  bottom: 0;
  z-index: 99;
  background: white;
  overflow-y: hidden;
  height: 80px;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.08);
  padding: 10px 20px;

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #333;

    strong {
      color: #409EFF;
      margin: 0 4px;
    }
  }
}

.book-info {
  .book-intro {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
    line-height: 1.3;
    max-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* ✅ 两行溢出省略 */
    -webkit-box-orient: vertical;
  }

  .book-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;

    .button-group {
      display: flex;
      gap: 6px;
    }

    .el-button {
      font-size: 12px;
      padding: 4px 8px;
    }
  }
}

.aside {
  background: white;
  min-height: calc(100vh - 80px);
  border-radius: 8px;
  padding: 10px 0;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
}

.content {
  flex: 1;
  padding: 20px;
  background: #f0f2f5;
  overflow-y: auto;
}


.search-bar {
  margin-bottom: 16px;
}

.book-list {
  display: flex;
  flex-wrap: wrap;
  height: 560px;
  overflow-y: auto;
  gap: 16px;

  .book-card {
    width: 220px;
    height: 340px;
    display: flex;
    flex-direction: column;

    .book-cover {
      height: 180px;
      img {
        width: 220px;
        height: 200px;
        margin-top: -18px;
        margin-left: -20px;
        margin-right: -18px;
        object-fit: fill;
        border-radius: 4px;
      }
    }

    .book-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 8px;

      .book-title {
        font-weight: bold;
        margin-left: -12px;
        font-size: 15px;
        color: #333;
      }

      .book-author {
        font-size: 13px;
        margin-left: -12px;
        color: #888;
        margin-top: 4px;
      }

      .book-footer {
        display: flex;
        margin-left: -12px;
        justify-content: space-between;
        align-items: center;
        margin-top: 6px;
      }
    }
  }
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
