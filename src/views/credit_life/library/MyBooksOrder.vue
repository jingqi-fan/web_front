<template>
  <div class="borrow-page">
    <!-- 顶部标题栏 -->
    <div class="header-bar">
      <el-button link :icon="Back" @click="goBack">返回</el-button>
      <div class="title">我的借阅</div>
      <el-dropdown>
        <img
            class="avatar"
            :src="userInfo.profilePicture"
            alt="头像"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goLibraryHome">图书馆主页</el-dropdown-item>
            <el-dropdown-item @click="goCreditLifeHome">信用生活主页</el-dropdown-item>
            <el-dropdown-item @click="goSystemHome">系统主页</el-dropdown-item>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 筛选框 -->
    <div class="filter-bar">
      <!-- 搜索栏 -->
      <el-input
          v-model="searchText"
          placeholder="搜索书名"
          clearable
          style="width: 220px"
      />

      <!-- 状态筛选 -->
      <el-select
          v-model="statusFilter"
          placeholder="借阅状态"
          clearable
          style="width: 140px"
      >
        <el-option
            v-for="item in staticStatuses"
            :key="item.id ?? 'all-status'"
            :label="item.label"
            :value="item.id"
        />
      </el-select>

      <!-- 分类筛选 -->
      <el-select
          v-model="categoryFilter"
          placeholder="图书分类"
          clearable
          style="width: 140px"
      >
        <el-option
            v-for="item in staticCategories"
            :key="item.id ?? 'all-cat'"
            :label="item.label"
            :value="item.id"
        />
      </el-select>
      <el-button @click="resetFilters">重置筛选</el-button>

    </div>

    <!-- 借阅列表 -->
    <div class="borrow-page-wrapper">
      <div class="borrow-page">
        <div class="borrow-list">
          <el-card
              v-for="record in filteredRecords"
              :key="record.id"
              class="borrow-card"
          >
            <div class="borrow-header">
              <span>借阅日期：{{ formatDate(record.borrowDate) }}</span>
              <span>到期：{{ formatDate(record.dueDate) }}</span>
            </div>
            <div class="book-items">
              <div
                  class="book-item"
                  v-for="book in record.books"
                  :key="book.id"
              >
                <img
                    class="book-cover"
                    :src="book.bookInfo.image"
                    alt="封面"
                />
                <div class="book-info">
                  <div class="book-name">{{ book.bookInfo.bookName }}</div>
                  <div class="book-meta">
                    <span>作者：{{ book.bookInfo.author }}</span>
                    <span>出版社：{{ book.bookInfo.publisher }}</span>
                  </div>
                  <el-tag
                      :type="book.borrowingStatus === 2 ? 'info' : 'success'"
                      size="small"
                  >
                    {{ getBookStatus(book.borrowingStatus) }}
                  </el-tag>
                </div>
                <div style="align-items: center;">
                  <el-button v-if="book.borrowingStatus===1" style="margin-top: 15px" type="primary" @click="returnBooks(book.bookId,book.borrowingId)">归还</el-button>
                  <el-button v-else-if="book.borrowingStatus===0" style="margin-top: 15px" type="success" @click="confirmBorrowBook">确认借阅</el-button>
                  <el-button v-else style="margin-top: 15px" type="info" disabled>已完成</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>

  </div>
</template>



<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import dayjs from 'dayjs'
import {getBorrowRecords, returnBook} from '@/api/life/book_api'
import type {BorrowingRecord, BorrowingResponse, SubBorrowing} from '@/api/life/book_type'
import {useUserInfoStore} from '@/stores/useUserInfoStore'
import router from '@/router'
import {Back} from "@element-plus/icons-vue";
import {userLogout} from "@/api/user.ts";
import {useDeviceStore} from "@/stores/useDeviceStore.ts";
import {ElMessage} from "element-plus";

const userInfoStore = useUserInfoStore()
const userInfo = userInfoStore.user
const defaultAvatar = '/default-avatar.png'

const searchText = ref('')

const bookBorrowings = ref<BorrowingRecord[]>([])
const bookSubBorrowings = ref<SubBorrowing[]>([])

onMounted(async () => {
  const res: BorrowingResponse = await getBorrowRecords(userInfo.id)
  bookBorrowings.value = res.bookBorrowings
  bookSubBorrowings.value = res.bookSubBorrowings
})

const borrowingRecords = computed(() => {
  return bookBorrowings.value.map((record) => {
    const books = bookSubBorrowings.value.filter(
        (sub) => sub.borrowingId === record.id
    )
    return {
      ...record,
      books,
    }
  })
})


const filteredRecords = computed(() => {
  return borrowingRecords.value
      .map((record) => {
        const filteredBooks = record.books.filter((b) => {
          const matchStatus =
              statusFilter.value === null || b.borrowingStatus === statusFilter.value
          const matchText =
              !searchText.value || b.bookInfo.bookName.includes(searchText.value)
          const matchCategory =
              categoryFilter.value === null || b.bookInfo.categoryId === categoryFilter.value
          return matchStatus && matchText && matchCategory
        })
        return {
          ...record,
          books: filteredBooks
        }
      })
      .filter((record) => record.books.length > 0)
})
const resetFilters = () => {
  searchText.value = ''
  statusFilter.value = null
  categoryFilter.value = null
}


const categoryFilter = ref<number | null>(null)
const statusFilter = ref<number | null>(null)

const staticCategories = [
  { id: null, label: '全部' },
  { id: 1, label: '文学' },
  { id: 2, label: '社科' },
  { id: 3, label: '科技' },
  { id: 4, label: '少儿' },
  { id: 5, label: '教育' },
  { id: 6, label: '生活' },
  { id: 7, label: '技术应用' },
  { id: 8, label: '艺术' }
]

const staticStatuses = [
  { id: null, label: '全部' },
  { id: 0, label: '预借阅' },
  { id: 1, label: '借阅中' },
  { id: 2, label: '已归还' }
]


const availableCategories = computed(() => {
  const categoryMap = new Map<number, string>()
  for (const b of bookSubBorrowings.value) {
    const categoryId = b.bookInfo?.categoryId
    const categoryName = b.bookInfo?.categoryName ?? `类目 ${categoryId}`
    if (categoryId != null && !categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, categoryName)
    }
  }
  return Array.from(categoryMap.entries()).map(([id, name]) => ({
    id,
    label: name,
  }))
})


const formatDate = (date: string) => dayjs(date).format('YYYY-MM-DD')
const goBack = () => router.back()
const logout =async  () => {
  const deviceStore=useDeviceStore()
  const res=await userLogout(userInfo.uuid,deviceStore.device)
  ElMessage.success("退出登录成功")
  await router.push('/home')
}

const returnBooks=async (bookId:number,borrowingId:number)=>{
  const ret=await returnBook(bookId,borrowingId)
  const res: BorrowingResponse = await getBorrowRecords(userInfo.id)
  bookBorrowings.value = res.bookBorrowings
  bookSubBorrowings.value = res.bookSubBorrowings
  ElMessage.success("归还成功")
}
const confirmBorrowBook= ()=>{
  router.push(`/book/pay/${userInfo.id}`)
}
const getBookStatus=(status: number) =>{
  switch (status) {
    case 0:
      return '预借阅'
    case 1:
      return '借阅中'
    case 2:
      return '已归还'
    default:
      return '错误的状态'
  }
}
const goLibraryHome=()=>router.push('/life/library')
const goCreditLifeHome=()=>router.push('/life')
const goSystemHome=()=>router.push('/welcome')
</script>


<style scoped lang="scss">
.borrow-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.borrow-page-wrapper {
  height: 80vh;
  overflow-y: auto;
}

.borrow-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
  }
}

.filter-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.borrow-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* 移除 max-height，避免页面内容溢出被限制 */
}


.borrow-card {
  padding: 14px;

  .borrow-header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 12px;
    color: #666;
  }

  .book-items {
    display: flex;
    flex-direction: column;
    max-height: 300px; // ✅ 这里保留
    overflow-y: auto;  // ✅ 内部书籍过多时单独滚动
    gap: 12px;
  }


  .book-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    background: #f8f8f8;
    padding: 10px;
    border-radius: 6px;

    .book-cover {
      width: 60px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
    }

    .book-info {
      flex: 1;
      height: 60px;

      .book-name {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 4px;
      }

      .book-meta {
        font-size: 13px;
        color: #888;
        margin-bottom: 6px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
    }
  }
}
</style>


