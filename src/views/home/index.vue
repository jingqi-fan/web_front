<template>
  <div class="main-container">
    <div class="top-container">
      <div class="video-background">
        <video id="bg-video" autoplay muted loop>
          <source src="@/assets/vlog.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
        <div class="video-content">
          <t-form
              ref="form"
              :class="['item-container', `register-${type}`]"
              :data="formData"
              :rules="FORM_RULES"
              label-width="0"
              @submit="onSubmit"
          >

          </t-form>
        </div>
      </div>
      <div class="login-wrapper">
        <home-header class="animate__animated animate__fadeInDown"/>
      </div>
    </div>
    <div class="middle-container">
      <!-- 新闻资讯区域 -->
      <div class="news-section">
        <div class="section-header">
          <h2 class="section-title">新闻资讯</h2>
          <div class="section-subtitle">了解最新行业动态和政策信息</div>
        </div>

        <!-- 新闻分类导航 -->
        <div class="news-nav">
          <t-radio-group v-model="activeCategory" variant="default-filled">
            <t-radio-button value="policy">政策法规</t-radio-button>
            <t-radio-button value="industry">行业动态</t-radio-button>
            <t-radio-button value="finance">金融资讯</t-radio-button>
            <t-radio-button value="tech">科技创新</t-radio-button>
          </t-radio-group>
        </div>

        <!-- 新闻卡片展示区 -->
        <div class="news-container">
          <!-- 头条新闻 -->
          <div class="featured-news">
            <el-card shadow="hover" class="featured-card">
              <div class="featured-content">
                <div class="featured-image">
                  <img :src="featuredNews.image" alt="头条新闻图片">
                  <div class="featured-tag">头条</div>
                </div>
                <div class="featured-text">
                  <h3>{{ featuredNews.title }}</h3>
                  <p class="featured-desc">{{ featuredNews.description }}</p>
                  <div class="featured-meta">
                    <span class="news-date">{{ featuredNews.date }}</span>
                    <span class="news-author">{{ featuredNews.author }}</span>
                  </div>
                  <t-button theme="primary" variant="text" @click="readMore(featuredNews.id)">
                    阅读全文 <t-icon name="chevron-right" />
                  </t-button>
                </div>
              </div>
            </el-card>
          </div>

          <!-- 新闻列表 -->
          <div class="news-list">
            <div class="news-grid">
              <el-card
                  v-for="news in newsList"
                  :key="news.id"
                  shadow="hover"
                  class="news-card"
              >
                <div class="news-image">
                  <img :src="news.image" :alt="news.title">
                </div>
                <div class="news-content">
                  <div class="news-tags">
                    <t-tag v-for="tag in news.tags" :key="tag" theme="primary" variant="light">
                      {{ tag }}
                    </t-tag>
                  </div>
                  <h4 class="news-title">{{ news.title }}</h4>
                  <p class="news-desc">{{ news.description }}</p>
                  <div class="news-meta">
                    <span class="news-date">{{ news.date }}</span>
                    <span class="news-views">
                  <t-icon name="view" /> {{ news.views }}
                </span>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>

        <!-- 查看更多按钮 -->
        <div class="more-news">
          <t-button variant="outline" theme="primary" @click="loadMoreNews">
            查看更多资讯
          </t-button>
        </div>
      </div>
    </div>


    <div class="home-news">
      <footer class="copyright">Copyright @ 2025-2030 中软国际. All Rights Reserved</footer>
    </div>
  </div>
</template>

<script setup lang="tsx">


import { ref,onMounted,computed } from 'vue';
import HomeHeader from './components/Header.vue';
import {getNewsList} from "@/api/news.ts";
import type {News} from "@/entity/news.ts";



const type = ref('login');
const switchType = (val: string) => {
  type.value = val;
};
const newsData=ref<News[]>([])
// 模拟新闻数据
const loadNewsData =async () => {
  const res=await getNewsList()
  console.log("新闻",res)
  newsData.value=res.data
}
loadNewsData()


// 当前激活的分类
const activeCategory = ref('policy');

// 精选头条新闻
const featuredNews = computed(() => {
  return newsData.value.find(item => item.id === 1) || newsData.value[0];
});

// 根据分类筛选的新闻列表
const newsList = computed(() => {
  return newsData.value
      .filter(item => item.category === activeCategory.value)
      .slice(0, 4);
});

// 阅读更多处理
const readMore = (id: number) => {
  console.log(`阅读新闻ID: ${id}`);
  // 实际项目中这里会导航到新闻详情页
};

// 加载更多新闻
const loadMoreNews = () => {
  console.log('加载更多新闻');
  // 实际项目中这里会加载更多数据
};

// 页面加载时滚动到顶部
onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<style lang="less" scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

@import url('./index.less');
.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}
.main-container{
  display: grid;
  grid-template-rows: 2fr auto auto;
}
#bg-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-content {
  position: relative;
  z-index: 1;
}
// 新闻资讯区域样式
.news-section {
  padding: 60px 5%;
  background: #f8fafc;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a56db;
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 16px;
  color: #64748b;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 2px;
  }
}

.news-nav {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;

  :deep(.t-radio-group) {
    background: #fff;
    border-radius: 30px;
    padding: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  :deep(.t-radio-button) {
    padding: 10px 24px;
    border-radius: 30px;
    transition: all 0.3s ease;

    &.t-is-checked {
      background: linear-gradient(135deg, #1a56db, #0d4cd3);
      color: white;
    }
  }
}

.news-container {
  max-width: 1200px;
  margin: 0 auto;
}

.featured-news {
  margin-bottom: 40px;

  .featured-card {
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }
  }

  .featured-content {
    display: flex;
    gap: 30px;
    padding: 20px;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .featured-image {
    flex: 1;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    min-height: 300px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    .featured-tag {
      position: absolute;
      top: 15px;
      left: 15px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }
  }

  .featured-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h3 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 15px;
      color: #1e293b;
      line-height: 1.4;
    }

    .featured-desc {
      font-size: 16px;
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .featured-meta {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #94a3b8;

      .news-date {
        display: flex;
        align-items: center;

        &::before {
          content: "📅";
          margin-right: 5px;
        }
      }

      .news-author {
        display: flex;
        align-items: center;

        &::before {
          content: "✍️";
          margin-right: 5px;
        }
      }
    }
  }
}

.news-list {
  margin-top: 40px;

  .news-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
  }

  .news-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    height: 100%;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .news-image {
      height: 180px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    .news-content {
      padding: 20px;

      .news-tags {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
      }

      .news-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 10px;
        color: #1e293b;
        line-height: 1.4;
        height: 50px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .news-desc {
        font-size: 14px;
        color: #64748b;
        line-height: 1.6;
        margin-bottom: 15px;
        height: 65px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }

      .news-meta {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: #94a3b8;

        .news-views {
          display: flex;
          align-items: center;
          gap: 5px;
        }
      }
    }
  }
}

.more-news {
  text-align: center;
  margin-top: 50px;

  .t-button {
    padding: 12px 40px;
    border-radius: 30px;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(26, 86, 219, 0.3);
    }
  }
}


</style>
