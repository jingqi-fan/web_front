<template>
  <div class="common-layout">
    <el-container>
      <el-header height="40">
        <!-- 顶部栏 -->
        <div class="header-container animate__animated animate__fadeInDown">
          <logo style="margin-left: 20px; cursor: pointer" @click="backHome" />
          <div class="credit-life-title">
            <div class="main-title">预约中心<div class="title-decoration"></div></div>
<!--            <div class="subtitle">就医便捷预约、一站式服务中心</div>-->
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
      </el-header>

      <el-container>
        <!-- 侧边导航栏 -->
        <el-aside width="200px" class="sidebar" >
          <h2>便捷预约></h2>
          <el-menu
              :default-active="activeMenu"
              class="el-menu-vertical-demo"
              router
          >
            <el-menu-item index="/life/hospital_order_home/preorder">
              <el-icon><Calendar /></el-icon>
              <span>快速预约</span>
            </el-menu-item>
            <el-menu-item index="/life/hospital_order_home/aiorder">
              <el-icon><Calendar /></el-icon>
              <span>AI协助预约</span>
            </el-menu-item>
            <el-menu-item index="/life/hospital_order_home/myorder">
              <el-icon><List /></el-icon>
              <span>我的预约</span>
            </el-menu-item>
          </el-menu>

        </el-aside>

        <!-- 页面主体内容 -->
        <el-main style="calc(100vh - 140px)">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import Logo from "@/views/personal/component/Logo.vue";
import {Calendar, List, SwitchButton, UserFilled} from "@element-plus/icons-vue";
import router from "@/router";
import { useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue'
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";
// 获取当前路由
const route = useRoute()
const activeMenu = computed(() => {
  return route.path
})
const handleSelect = (key: string) => {
  router.push(key)
}
const backHome=()=>{
  router.push('/welcome')
}
const avatarUrl=ref('')
const userInfoStore=useUserInfoStore()
avatarUrl.value=userInfoStore.user.profilePicture
</script>

<style scoped lang="less">
.header-container {
  display: flex;
  height: 70px;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: relative;
}
.sidebar {
  background-color: #f9fafb;
  border-right: 1px solid #e5e7eb;
  min-height: calc(100vh - 100px);
}
.credit-life-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}
.main-title {
  font-size: 42px;
  font-weight: 700;
  color: #1a56db;
  position: relative;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(26, 86, 219, 0.15);
}
/* 悬停动画效果 */
.main-title {
  font-size: 42px;
  font-weight: 700;
  color: #105e3f;   /* 主体绿色 */
  position: relative;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(16, 94, 63, 0.20); /* 绿色阴影 */
  transition: all 0.3s ease; /* 悬停动画 */
}

/* 悬停动画效果 */
.main-title:hover {
  transform: scale(1.03);
  text-shadow: 0 4px 8px rgba(16, 94, 63, 0.25);
}

.title-decoration {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;

  /* 绿色渐变透明线 */
  background: linear-gradient(
      90deg,
      transparent,
      #26d97a,   /* 明亮绿 */
      transparent
  );

  border-radius: 2px;
  opacity: 0.7;
}

.subtitle {
  font-size: 12px;
  color: #4b6356; /* 柔和深绿灰 */
  margin-top: 4px;
  letter-spacing: 1.5px;
  font-weight: 500;
  opacity: 0.9;
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
</style>/