<template>
  <div class="common-layout">
    <!-- Header -->
    <el-header class="header">
      <div class="left-section">
        <system class="logo" @click="GoHome" />
        <span class="creator-center-text">信息发布管理平台</span>
      </div>
      <div class="right-section">
        <div class="icon-button-group">
          <el-button type="text" class="icon-button" @click="GoToManagerMainPage">
            <el-icon class="icon-small"><Position /></el-icon>
            <span>管理员首页</span>
          </el-button>
          <el-button type="text" class="icon-button" @click="GoToDashboard">
            <el-icon class="icon-small"><Link /></el-icon>
            <span>数据监控中心</span>
          </el-button>
          <el-button type="text" class="icon-button" @click="GoToExamineAndApprove">
            <el-icon class="icon-small"><Document /></el-icon>
            <span>审批中心</span>
          </el-button>
        </div>
        <div class="icon-clickable" @click="notification">
          <el-icon><Comment /></el-icon>
        </div>
        <div style="margin-right: 80px" class="icon-clickable" @click="userCenter">
          <el-popover
              placement="bottom"
              :width="300"
              trigger="hover"
          >
            <template #reference>
              <el-icon><UserFilled /></el-icon>
            </template>
          </el-popover>
        </div>
      </div>
    </el-header>

    <el-container class="body-container">
      <el-aside width="200px" class="left-aside">
        <div class="menu">
          <div style="font-size: 20px;font-weight: bold">管理中心</div>
          <el-menu class="el-menu-vertical-demo" background-color="#f5f5f5">
            <el-menu-item index="1" @click="GoToItem('/overview')">
              <el-icon><DataAnalysis /></el-icon>
              <span>新闻管理中心</span>
            </el-menu-item>
            <el-sub-menu index="2">
              <template #title><el-icon><Tickets /></el-icon>亲社会行为</template>
              <el-menu-item index="2-1" @click="GoToItem('/prosocial/type')"><el-icon><Management /></el-icon>大类管理</el-menu-item>
              <el-menu-item index="2-3" @click="GoToItem('/prosocial/item')"><el-icon><Document /></el-icon>条目管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title><el-icon><Reading /></el-icon>图书中心</template>
              <el-menu-item index="3-1" @click="GoToItem('/book/manager')"><el-icon><Collection /></el-icon>图书管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="4">
              <template #title><el-icon><Bicycle /></el-icon>停车中心</template>
              <el-menu-item index="4-1" @click="GoToItem('/parking/manager')"><el-icon><Location /></el-icon>停车场管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="5">
              <template #title><el-icon><DocumentCopy /></el-icon>医院系统</template>
              <el-menu-item index="5-1" @click="GoToItem('/hospital/department')"><el-icon><Medal/></el-icon>科室管理</el-menu-item>
              <el-menu-item index="5-2" @click="GoToItem('/hospital/doctor')"><el-icon><UserFilled /></el-icon>医生管理</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>
      </el-aside>
      <el-main class="main-content">
        <div class="scrollable-content">
          <router-view />
        </div>
      </el-main>
      <el-aside class="right-aside">
        <div class="right-content">
          <el-popover
              v-for="(popover, index) in popovers"
              :key="index"
              placement="left"
              width="200"
              trigger="hover"
              :title="popover.title"
          >
            <template #reference>
              <div class="right-button-container">
                <el-button :icon="popover.icon" type="text" />
              </div>
            </template>
            <template #default>
              <div>
                <p>{{ popover.content }}</p>
                <img
                    v-if="popover.imageSrc"
                    :src="popover.imageSrc"
                    alt="二维码"
                    class="popover-image"
                />
              </div>
            </template>
          </el-popover>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import System from '@/assets/system.svg';
import router from "@/router";
import QrCode from "@/assets/qrcode.jpg"
import {
  Bicycle,
  Collection,
  Comment, DataAnalysis, DataLine,
  Document, DocumentCopy,
  EditPen,
  Files, Grid, Link, List, Loading, Location, Management, Medal,
  OfficeBuilding, PhoneFilled,
  Position, Reading, Setting, Tickets,
  User,
  UserFilled
} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

const GoToManagerMainPage=()=>{
  //router.push('/manager');
  ElMessage.warning("管理员首页正在开发中...")
}
const GoToDashboard=()=>{
  router.push('/manager/dataCenter')
}

const GoToExamineAndApprove=()=>{
  router.push('/manager/examine')
}

const GoToItem=(url:string)=>{
  router.push('/publish/manager'+url);
}
const popovers = [
  {
    title: '设置',
    content: '这是设置按钮的提示信息。',
    icon: Setting,
    buttonText: '去设置',
    action: () => {
      console.log('设置按钮被点击');
    },
  },
  {
    title: '反馈',
    content: '编辑内容相关说明。编辑内容相关说明。编辑内容相关说明。',
    icon: EditPen,
    buttonText: '去编辑',
    action: () => {
      console.log('编辑按钮被点击');
    },
  },
  {
    title: '扫码关注我们 :',
    content: '',
    icon: PhoneFilled,
    imageSrc: QrCode,
  },
];
const GoHome = () => {
  router.push('/');
};


const notification = () => {
  ElMessage.error("不可用")
  //router.push('/notification')
};

const userCenter = () => {
  ElMessage.error("不可用")
  //router.push('/user')
};

</script>

<style scoped>
/* 总体布局 */
.common-layout {
  height: 98vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
/* header */
.header {
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #f5f5f5;
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.left-section {
  display: flex;
  align-items: center;
}

.logo {
  width: 50px;
  height: 50px;
  margin-right: 20px;
  cursor: pointer;
}

.creator-center-text {
  margin-left: 10px;
  font-size: 18px;
  font-weight: bold;
}

.right-section {
  display: flex;
  align-items: center;
}

.icon-button-group {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.icon-button {
  display: flex;
  align-items: center;
  margin-right: 10px;
  font-size: 14px;
  cursor: pointer;
}

.icon-button span {
  margin-left: 5px;
}

.icon-small {
  font-size: 18px;
}

.icon-clickable {
  font-size: 20px;
  margin-left: 20px;
  cursor: pointer;
  color: #606266;
  transition: color 0.3s;
}

.icon-clickable:hover {
  color: #409eff;
}

.body-container {
  display: flex;
  height: calc(100vh - 70px);
  margin-top: 70px;
  padding-top: 10px;
}

/* 菜单 */
.left-aside {
  background-color: #f5f5f5;
  margin-top: 8px;
  border-radius: 8px;
  padding: 20px;
  position: fixed;
  height: calc(100vh - 70px);
  top: 70px;
  width: 200px;
}

.el-sub-menu .el-sub-menu__title:hover {
  background-color: #f5f5f5 !important;
  color: #409eff !important;
}
.el-menu-item:hover {
  background-color: #f5f5f5 !important;
  color: #409eff !important;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.el-sub-menu .el-menu-item:hover {
  background-color: #f5f5f5 !important;
  color: #409eff !important;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Main */
.main-content {
  flex-grow: 1;
  overflow-y: hidden;
  padding: 20px;
  height: 100%;
  width: 100%;
  margin-left: 200px;
}

/* 右侧 */
.right-aside {
  background-color: rgba(255, 255, 255, 0);
  padding: 20px;
  border-radius: 8px;
  position: fixed;
  margin-right: 8px;
  margin-top: 8px;
  height: calc(100vh - 70px);
  width: 40px;
  top: 70px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  overflow: hidden;
}

.right-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.right-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.right-button-container:hover {
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


.el-button-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}


.right-item {
  margin-bottom: 20px;
  font-size: 16px;
  cursor: pointer;
  color: #606266;
}

.right-item:hover {
  color: #409eff;
}

.scrollable-content {
  margin-top: 1px;
  height: 100%;
  overflow-y: auto;
}
.el-popover {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.el-popover__title {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}
.popover-image {
  width: 150px;
  height: 150px;
  margin: 10px 0;
  display: block;
  object-fit: contain;
}

</style>
