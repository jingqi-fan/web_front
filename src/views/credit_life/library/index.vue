<template>
  <div class="library-home">
    <!-- 顶部标题栏 -->
    <el-header class="top-bar">
      <el-button type="text" :icon="Back" @click="goHome" />
      <div class="title">智慧图书馆</div>
      <div class="user-info">
        <span class="score">信用分：{{ creditScore }}</span>
        <el-avatar :size="30" :src="avatar" />
      </div>
    </el-header>

    <!-- 快捷服务卡片 -->
    <div class="section-title">快捷服务</div>
    <div class="quick-services">

      <el-card class="quick-card" shadow="hover" @click="goToBorrowBook">
        <el-icon class="card-icon" :style="{ color: '#409EFF' }"><Reading /></el-icon>
        <div class="card-title">快速借阅</div>
        <div class="card-subtitle">便捷扫码，自助借书</div>
        <el-button type="success" size="small">立即借阅</el-button>
      </el-card>

      <el-card class="quick-card" shadow="hover">
        <el-icon class="card-icon" :style="{ color: '#E6A23C' }"><Document /></el-icon>
        <div class="card-title">我的借阅</div>
        <div class="card-subtitle">查看历史与当前借阅</div>
        <el-button type="success" size="small" @click="MyOrderList">查看记录</el-button>
      </el-card>

      <el-card class="quick-card" shadow="hover">
        <el-icon class="card-icon" :style="{ color: '#67C23A' }"><Medal /></el-icon>
        <div class="card-title">信用分</div>
        <div class="card-subtitle">借阅行为影响信用</div>
        <el-tag type="success">您的信用良好</el-tag>
      </el-card>

    </div>

    <!-- 热门图书推荐 -->
    <div class="book-recommend-section">
      <div class="section-title">热门图书推荐</div>
      <div class="book-list">
        <div class="book-item" v-for="book in bookList" :key="book.id">
          <div class="book-cover">
            <img :src="book.image" alt="封面" />
          </div>
          <div class="book-info">
            <div class="book-title">{{ book.bookName }}</div>
            <div class="book-author">{{ book.author }}</div>
            <div class="book-footer">
              <el-tag :type="book.stock>0 ? 'success' : 'info'" size="small">
                {{ book.stock>0 ? '可借阅' : '已借出' }}
              </el-tag>
              <el-button
                  type="primary"
                  size="small"
                  :disabled="book.stock<=0"
                  @click="borrow(book)"
              >
                借阅
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {Back, Document, Medal, Reading} from "@element-plus/icons-vue";
import router from "@/router";
import {addToBookListing, type Book, getRecommendBooks} from "@/api/life/book_api.ts";
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";
import {useUserCreditScoreStore} from "@/stores/useUserCreditScore.ts";


const creditScore = ref(0)
const userInfoStore=useUserInfoStore()
const userInfo=userInfoStore.user
const userCreditScore=useUserCreditScoreStore()
const score=userCreditScore.score
const avatar = ref('')
const loadBasicInfo= ()=>{
  creditScore.value=score.creditScore
  avatar.value=userInfo.profilePicture
}
loadBasicInfo()

const goHome = () => {
  router.push('/life')
}
const bookList =ref<Book[]>([])
const getRecommendBookList=async ()=>{
  const res:Book[]=await getRecommendBooks()
  console.log(res)
  bookList.value=res
}
getRecommendBookList()


const borrow = async (book: Book) => {
  const res = await addToBookListing(book.id, userInfo.id)
  ElMessage.success(res || '已添加到借阅清单')

  await router.push('/life/book/list')
}


const goToBorrowBook=()=>{
  router.push('/life/book/list')
}
const MyOrderList=()=>{
  router.push('/book/my_order')
}
</script>

<style scoped lang="scss">
.library-home {
  padding: 16px;
  background-color: #f5f7fa;
}
.card-icon {
  font-size: 40px;
  margin-bottom: 10px;
}
.top-bar {
  height: 70px;
  display: flex;
  border-radius: 8px;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 0 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  .title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
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
  color: #333;
  display: flex;
  align-items: center;
  margin: 20px 0 10px;

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
  gap: 20px;
  margin-bottom: 30px;

  .quick-card {
    width: 220px;
    height: 180px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 16px 10px;

    .card-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .card-title {
      font-weight: bold;
      font-size: 15px;
      margin-bottom: 2px;
    }

    .card-subtitle {
      font-size: 13px;
      color: #888;
      margin-bottom: 8px;
    }

    .el-tag {
      font-size: 12px;
      padding: 2px 6px;
    }
  }
}


.book-section {
  .section-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 12px;
    color: #333;
  }

  .book-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .book-card {
      width: calc(50% - 8px);
    }

    .book-container {
      display: flex;

      .book-img {
        flex: 3;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }
      }

      .book-info {
        flex: 2;
        padding-left: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .book-name {
          font-size: 15px;
          font-weight: bold;
          color: #333;
        }

        .book-author {
          font-size: 13px;
          color: #666;
          margin: 4px 0;
        }

        el-tag {
          margin-bottom: 6px;
        }
      }
    }
  }
}
.book-recommend-section {
  padding: 10px 20px;

  .section-title {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 12px;
  }

  .book-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .book-item {
    width: 240px;
    height: 340px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .book-cover {
      flex: 3;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }

    .book-info {
      flex: 2;
      padding: 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .book-title {
        font-weight: bold;
        font-size: 14px;
        color: #333;
        line-height: 1.2;
      }

      .book-author {
        font-size: 13px;
        color: #888;
        margin-top: 2px;
      }

      .book-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 6px;
      }
    }
  }
}
.book-list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.book-item {
  width: 280px;     // ✅ 固定宽度
  height: 360px;    // ✅ 固定高度
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.book-cover {
  height: 60%;     // ✅ 固定比例：上 60% 为图片区域
  width: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;  // ✅ 图片裁剪填充，不拉伸变形
    display: block;
  }
}

.book-info {
  height: 40%;     // ✅ 下 40% 为文字区域
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .book-title {
    font-weight: bold;
    font-size: 14px;
    color: #333;
    line-height: 1.2;
  }

  .book-author {
    font-size: 13px;
    color: #888;
    margin-top: 2px;
  }

  .book-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;

    .el-tag {
      font-size: 12px;
    }

    .el-button {
      padding: 4px 8px;
      font-size: 12px;
    }
  }
}

</style>
