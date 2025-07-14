<template>
  <div class="credit-life-index">
    <!-- 顶部栏 -->
    <div class="header-container animate__animated animate__fadeInDown">
      <logo style="margin-left: 20px; cursor: pointer" @click="backHome" />
      <div class="credit-life-title">
        <div class="main-title">信用生活<div class="title-decoration"></div></div>
        <div class="subtitle">让信用创造美好生活价值</div>
      </div>
      <el-dropdown trigger="hover">
        <span class="el-dropdown-link">
          <el-avatar :src="avatarUrl" style="cursor: pointer" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleEditRealInfo">
              <el-icon><UserFilled /></el-icon>
              信用信息
            </el-dropdown-item>

            <el-dropdown-item divided @click="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 主服务模块卡片 -->
    <div class="services-section animate__animated animate__fadeInUp">
      <div class="main-services">
        <CreditModuleCard
            icon="parking"
            title="停车服务"
            description="实时查询车位，信用积分减免停车费"
            hint="100积分可享1小时免费"
            to="/parking/home"
            cardClass="parking-card"
        />
        <CreditModuleCard
            icon="medical"
            title="医疗服务"
            description="预约挂号、健康档案，信用加速就医流程"
            hint="200积分免排队"
            to="/life/hospital"
            cardClass="medical-card"
        />
        <CreditModuleCard
            icon="library"
            title="图书服务"
            description="一键借阅，线上续期，信用免押借书"
            hint="300积分延长借阅15天"
            to="/life/library"
            cardClass="library-card"
        />
      </div>

      <!-- 信用摘要信息 -->
      <div class="circular-summary-section">
        <div class="circular-summary">
          <div class="circular-card animate__animated animate__zoomIn">
            <div class="circular-icon bg-blue">
              <el-icon><Lock /></el-icon>
            </div>
            <div class="circular-content">
              <h3>信用保障</h3>
              <p>全程加密保护，信用信息安全可靠</p>
            </div>
          </div>

          <div class="circular-card animate__animated animate__zoomIn">
            <div class="circular-icon bg-green">
              <el-icon><Refresh /></el-icon>
            </div>
            <div class="circular-content">
              <h3>闭环服务</h3>
              <p>积分使用、反馈提升完整闭环</p>
            </div>
          </div>

          <div class="circular-card animate__animated animate__zoomIn">
            <div class="circular-icon bg-purple">
              <el-icon><Headset /></el-icon>
            </div>
            <div class="circular-content">
              <h3>24小时支持</h3>
              <p>随时联系在线客服解决问题</p>
              <el-button class="support-btn" type="primary" round @click="contactSupport">联系客服</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 个人服务 -->
      <div class="personal-services animate__animated animate__fadeIn">
        <div class="mini-option orders-option" @click="getBacklogDetail">
          <div class="option-content">
            <div class="icon-badge">
              <el-icon class="option-icon"><List /></el-icon>
              <span v-if="pendingCount > 0" class="notification-badge">{{ pendingCount }}</span>
            </div>
            <div class="option-text">
              <h3>我的预约</h3>
              <p>待处理: {{ pendingCount }}项</p>
            </div>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
        </div>

        <div class="mini-option score-option">
          <div class="option-content">
            <div class="icon-badge">
              <el-icon class="option-icon"><Coin /></el-icon>
            </div>
            <div class="option-text">
              <h3>我的积分</h3>
              <div class="progress-container">
                <div class="progress-bar" :style="{ width: progressWidth }"></div>
              </div>
              <span>{{ creditScore }}分</span>
            </div>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 公告区 -->
    <el-carousel height="30px" direction="vertical" :autoplay="true" :interval="4000" indicator-position="none">
      <el-carousel-item v-for="(item, index) in notices" :key="index">
        <div style="padding-left: 10px">📢 {{ item }}</div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import Logo from '@/views/personal/component/Logo.vue';
import {
  ArrowRight,
  Coin,
  Headset,
  List,
  Lock,
  Refresh,
  SwitchButton,
  UserFilled
} from '@element-plus/icons-vue';
import CreditModuleCard from '@/views/credit_life/CreditModuleCard.vue';
import router from "@/router";
import {countBacklog} from "@/api/life/home.ts";
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";
import {useUserCreditScoreStore} from "@/stores/useUserCreditScore.ts";

const avatarUrl = ref('https://q8.itc.cn/q_70/images03/20250521/eac16c7d96884de3bd0cb499554c205a.jpeg');
const pendingCount = ref(0);

const userInfoStore=useUserInfoStore()
const getPendingCount=async ()=>{
  const id=userInfoStore.user.id
  console.log("home id:",id)
  const res=await countBacklog(id)
  console.log("home res:",res)
  pendingCount.value=res
}
getPendingCount()

const userCreditScore=useUserCreditScoreStore()
const creditScore = ref(0);
creditScore.value=userCreditScore.score.creditScore

const notices = ref([
  '信用积分规则更新：借阅图书按时归还可获双倍积分',
  '西湖医院本月推出积分优惠活动',
  '图书馆新到500册畅销书籍，欢迎信用免押借阅',
  '停车服务升级：信用分650+享每日首小时免费'
]);

const progressWidth = computed(() => `${Math.min((creditScore.value / 1000) * 100, 100)}%`);
const backHome = () => router.push('/home');
const handleEditRealInfo = () => router.push('/credit-life/real-info');
const handleChangeAvatar = () => alert('更换头像功能开发中');
const logout = () => alert('退出登录');
const contactSupport = () => alert('联系客服功能开发中');
const getBacklogDetail=async ()=>{
  
}
</script>

<style scoped lang="scss">
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

.credit-life-index {
  padding: 0 20px 30px;

  margin: 0 auto;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  position: relative;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 210px;
  background: linear-gradient(135deg, #1a56db 0%, #0d4cd3 100%);
  z-index: 0;
  border-radius: 0 0 20px 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 80px;
  position: relative;
  z-index: 1;

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;

    .logo-icon {
      height: 36px;
      width: auto;
    }

    .logo-text {
      font-size: 22px;
      font-weight: 700;
      color: white;
      letter-spacing: 1px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .credit-score-card {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 8px 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.25);
      }

      .score {
        font-size: 22px;
        font-weight: 800;
        color: #ffd43b;
        line-height: 1;
      }

      span {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 5px 10px 5px 15px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.25);
      }

      .user-name {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
}

.hero-section {
  position: relative;
  z-index: 1;
  margin-bottom: 40px;
  color: white;



}

.title {
  position: relative;
  z-index: 1;
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
  color: #333;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* 服务卡片区域整体布局优化 */
.services-section {
  display: grid;
  grid-template-columns: 2fr auto auto;
  height: 540px;
  margin: 40px 0;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a56db;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eaeaea;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 2px;
  }
}

/* 主服务卡片区域 */
.main-services {
  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(170px, 140px));
  width: 500px;
  gap: 24px;
  margin-bottom: 24px;
}
.display-card{
  display: flex;
  flex-direction: row;
}
/* 个人服务卡片区域 */
.personal-services {
  display: grid;
  justify-items: center;    /* 水平居中所有网格项 */
  align-items: center;      /* 垂直居中所有网格项 */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.mini-option {
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(13, 76, 211, 0.08);
  padding: 24px;
  display: flex;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  min-height: 120px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(13, 76, 211, 0.15);

    .arrow-icon {
      transform: translateX(3px);
      color: #1a56db;
    }
  }

  .option-content {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
  }

  .icon-badge {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 12px;

    .option-icon {
      font-size: 28px;
    }
  }

  .option-text {
    flex: 1;

    h3 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #222;
    }

    p, span {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }

  .arrow-icon {
    color: #9ca3af;
    font-size: 20px;
    transition: all 0.3s ease;
  }

  .notification-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #e53e3e;
    color: white;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .progress-container {
    width: 100%;
    height: 6px;
    background: #f3f4f6;
    border-radius: 3px;
    margin: 8px 0;
    overflow: hidden;

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #5e8fff, #1a56db);
      border-radius: 3px;
    }
  }
}

// 个性化主题
.orders-option {
  border-left: 4px solid #f59e0b;

  .icon-badge {
    background: rgba(245, 158, 11, 0.1);

    .option-icon {
      color: #f59e0b;
    }
  }
}

.score-option {
  border-left: 4px solid #8b5cf6;

  .icon-badge {
    background: rgba(139, 92, 246, 0.1);

    .option-icon {
      color: #8b5cf6;
    }
  }
}

/* 响应式调整 */
@media (max-width: 992px) {
  .main-services,
  .personal-services {
    grid-template-columns: 1fr;
  }

  .mini-option {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .mini-option {
    min-height: auto;

    .icon-badge {
      width: 48px;
      height: 48px;
    }

    .option-text h3 {
      font-size: 16px;
    }
  }
}

// 为不同卡片添加个性化主题
.parking-card {
  border-left: 4px solid #3b82f6;

  .module-icon {
    color: #3b82f6;
  }
}

.medical-card {
  border-left: 4px solid #ef4444;

  .module-icon {
    color: #ef4444;
  }
}

.library-card {
  border-left: 4px solid #10b981;

  .module-icon {
    color: #10b981;
  }
}

.orders-card {
  border-left: 4px solid #f59e0b;

  .module-icon {
    color: #f59e0b;
  }
}

.score-card {
  border-left: 4px solid #8b5cf6;

  .module-icon {
    color: #8b5cf6;
  }
}
.summary {
  margin: 10px 0;
  display: flex;
  flex-direction: column;

  .summary-card {
    height: 160px;

    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
  }

  .card-content {
    display: flex;
    gap: 20px;
    align-items: flex-start;

    .summary-icon {
      font-size: 36px;
      padding: 12px;
      border-radius: 50%;
      background: rgba(26, 86, 219, 0.1);
      color: #1a56db;
      flex-shrink: 0;
    }

    h3 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 10px;
      color: #222;
    }

    p {
      font-size: 14px;
      color: #666;
      margin-bottom: 15px;
      line-height: 1.6;
    }
  }

  .support-btn {
    background: linear-gradient(135deg, #1a56db 0%, #0d4cd3 100%);
    border: none;
    border-radius: 20px;
    font-weight: 500;
    padding: 10px 24px;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(13, 76, 211, 0.25);
    }
  }
}

@media (max-width: 768px) {
  .summary {
    .card-content {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .summary-icon {
      margin-bottom: 15px;
    }
  }
}

.announcement {
  background: white;
  border-radius: 16px;
  padding: 16px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;

  .announcement-icon {
    margin-right: 15px;

    .megaphone-icon {
      width: 24px;
      height: 24px;
      color: #1a56db;
    }
  }

  .swiper-container {
    flex: 1;
    height: 24px;
    overflow: hidden;

    .swiper-wrapper {
      animation: scrollAnnounce 25s linear infinite;
    }

    .swiper-slide {
      height: 24px;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #555;
      white-space: nowrap;
    }
  }
}

@keyframes scrollAnnounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(calc(-100%));
  }
}

// 响应式调整
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    padding-bottom: 50px;

    .header-right {
      width: 100%;
      justify-content: space-between;
    }
  }

  .title {
    font-size: 24px;
  }

  .hero-section {
    .welcome-title {
      font-size: 28px;
    }

    .subtitle {
      font-size: 16px;
    }
  }

  .modules {
    grid-template-columns: 1fr;
  }
}
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: relative;
}

.credit-life-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}

.main-title {
  font-size: 50px;
  font-weight: 700;
  color: #1a56db;
  position: relative;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(26, 86, 219, 0.15);
}

.title-decoration {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
  border-radius: 2px;
  opacity: 0.7;
}

.subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
  letter-spacing: 1.5px;
  font-weight: 500;
  opacity: 0.9;
}

/* 悬停动画效果 */
.main-title {
  transition: all 0.3s ease;
}

.main-title:hover {
  transform: scale(1.03);
  text-shadow: 0 4px 8px rgba(26, 86, 219, 0.2);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 11px;
  }
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #1a56db;
  flex-grow: 1;
  text-align: center;
  margin-left: -40px; /* 平衡左右图标宽度 */
  letter-spacing: 1px;
}
/* 新增小选项样式 */
.mini-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;

  /* 新增居中代码 */
  justify-items: center;    /* 水平居中所有网格项 */
  align-items: center;      /* 垂直居中所有网格项 */
  /* 或简写为：place-items: center; */
}

.mini-option {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(13, 76, 211, 0.1);
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s ease;
  min-height: auto;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(13, 76, 211, 0.15);
  }
}

.option-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  position: relative;

  .option-icon {
    width: 36px;
    height: 36px;
  }

  .notification-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #e53e3e;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
  }
}

.option-text {
  flex: 1;

  h3 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
    color: #222;
  }

  p {
    font-size: 13px;
    color: #666;
    margin: 0;
  }
}

.progress-container {
  width: 100%;
  position: relative;

  .progress-bar {
    height: 6px;
    background: linear-gradient(90deg, #5e8fff 0%, #1a56db 100%);
    border-radius: 3px;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  span {
    font-size: 12px;
    color: #666;
    position: relative;
    top: 8px;
  }
}

.option-arrow {
  .arrow-icon {
    width: 16px;
    height: 16px;
    color: #9ca3af;
  }
}

// 小选项个性化主题
.orders-option {
  width: 300px;
  border-left: 3px solid #f59e0b;

  .option-icon {
    color: #f59e0b;
  }
}

.score-option {
  width: 300px;
  border-left: 3px solid #8b5cf6;

  .option-icon {
    color: #8b5cf6;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .mini-options {
    grid-template-columns: 1fr;
  }
}
.parking-card {
  border-left: 4px solid #3b82f6;

  .module-icon {
    color: #3b82f6;
  }


}
.library-card{
  border-left: 4px solid #9ca3af;

  .module-icon {
    color: #9ca3af;
  }
}
.medical-card{
  border-left: 4px solid #e53e3e;

  .module-icon {
    color: #e53e3e;
  }
}
.circular-summary-section {
  margin: 50px 0;
  text-align: center;

  .section-title {
    font-size: 24px;
    font-weight: 600;
    color: #1a56db;
    margin-bottom: 40px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      border-radius: 2px;
    }
  }
}

.circular-summary {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
}

.circular-card {
  width: 210px;
  height: 210px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 30px rgba(26, 86, 219, 0.15);

    .circular-icon {
      transform: scale(1.1);
    }
  }

  .circular-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    transition: transform 0.3s ease;

    .el-icon {
      font-size: 30px;
      color: white;
    }
  }

  .bg-blue {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  }

  .bg-green {
    background: linear-gradient(135deg, #10b981, #047857);
  }

  .bg-purple {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  }

  .circular-content {
    text-align: center;

    h3 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 10px;
      color: #222;
    }

    p {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 15px;
    }
  }

  .support-btn {
    margin-top: 10px;
    padding: 8px 20px;
    font-size: 13px;
  }

  /* 装饰性圆环效果 */
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    border: 2px solid rgba(26, 86, 219, 0.1);
    z-index: -1;
    animation: rotate 15s linear infinite;
  }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式调整 */
@media (max-width: 992px) {
  .circular-summary {
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .circular-summary {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }

  .circular-card {
    width: 200px;
    height: 200px;
  }
}

@media (max-width: 480px) {
  .circular-summary-section .section-title {
    font-size: 20px;
  }

  .circular-card {
    width: 180px;
    height: 180px;
    padding: 25px;

    .circular-icon {
      width: 70px;
      height: 70px;
      margin-bottom: 15px;

      .el-icon {
        font-size: 30px;
      }
    }

    .circular-content {
      h3 {
        font-size: 16px;
      }

      p {
        font-size: 13px;
      }
    }

    .support-btn {
      padding: 6px 16px;
      font-size: 12px;
    }
  }
}
</style>