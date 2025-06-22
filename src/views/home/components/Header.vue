<template>
  <header class="login-header">
    <auto-monitor-logo class="logo" @click="goToHome" />

    <div class="header-option">
      <t-button variant="text" @click="goToHomePage">
        首页
      </t-button>
      <t-button variant="text" @click="goToUserCenter">
        个人中心
      </t-button>

      <t-button variant="text" @click="goToCreditBusiness">
        信用商业
      </t-button>

      <t-button variant="text" @click="goToCreditLife">
        信用生活
      </t-button>

      <t-button variant="text" @click="goToCreditManage">
        信用管理
      </t-button>
    </div>

    <div class="header-button">
      <!-- 登录/注册按钮 -->
      <t-button
          style="height: 40px;  color: #FFFFFF"
          theme="primary"
          shape="rectangle"
          variant="base"
          @click="Login"
      >
        登录 / 注册
      </t-button>
    </div>

    <div class="operations-container">
      <!-- 政府 按钮 -->
      <t-button theme="default" shape="square" variant="text" @click="navToGovernment">
        <t-icon name="double-storey" class="icon" />
      </t-button>

      <!-- 帮助按钮 -->
      <t-button theme="default" shape="square" variant="text" @click="navToHelper">
        <t-icon name="help-circle" class="icon" />
      </t-button>

      <!-- 语言切换开关 -->
      <t-switch v-model="slotChecked" size="large" style="margin-left: 15px">
        <template #label="slotProps">{{ slotProps.value ? '中' : 'En' }}</template>
      </t-switch>
    </div>
  </header>
</template>

<script setup lang="tsx">
import AutoMonitorLogo from "@/assets/logo.svg";
import Logo from "@/assets/logo-image.png"

import { ref } from "vue";
import {ElMessage} from "element-plus";
import useRouterStore from "../../../stores/useSystemStore.ts";
import router from "../../../router";

import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";


const routerStore = useRouterStore();
// 用于语言切换
const slotChecked = ref(true);

const isUserLogged=()=>{
  const userStore = useUserInfoStore();
  return userStore.user !== null;
}
const goToHomePage = () => {
  router.push('/');
}
//个人中心
const goToUserCenter = () => {
  if(!isUserLogged()){
    routerStore.setRouter('/personal')
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  router.push('/personal');
};

const goToHome = () => {
  ElMessage.success('西湖市 欢迎你的加入!')
};


const goToCreditBusiness = () => {
  if(!isUserLogged()){
    routerStore.setRouter('/creditbusiness')
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  router.push('/creditbusiness');
};

const goToCreditLife = () => {
  ElMessage.success('信用生活即将上线，敬请期待!')
  // if(!isUserLogged()){
  //   routerStore.setRouter('/life')
  //   ElMessage.warning('请先登录')
  //   router.push('/login')
  //   return
  // }
  // // 跳转到应用中心页面
  // router.push('/life');
};
const goToCreditManage = () => {
  ElMessage.success('信用管理即将上线，敬请期待!')
  // if(!isUserLogged()){
  //   routerStore.setRouter('/manage')
  //   ElMessage.warning('请先登录')
  //   router.push('/login')
  //   return
  // }
  // router.push('/manage');
}

const navToGovernment = () => {
  window.open('https://www.hangzhou.gov.cn/');
};

const navToHelper = () => {
  window.open('https://www.chinasofti.com/');
};

const Login = () => {
  router.push('/login');
};
</script>

<style lang="less" scoped>
.header-option {
  display: flex;
  align-items: center;
  gap: 80px;
}

.login-header {

  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(5px);
  color: RGB(255, 255, 255, 2.0);

  .logo {
    width: 200px;
    cursor: pointer;
  }

  .operations-container {
    display: flex;
    align-items: center;

    .t-button {
      margin-left: 16px;
    }

    .icon {
      height: 20px;
      width: 20px;
      padding: 20px;
      box-sizing: content-box;

      &:hover {
        cursor: pointer;
      }
    }
  }
}

.header-option .t-button {
  font-size: 20px;
  padding: 8px 16px;
}

.header-button .t-button {
  font-size: 18px;
}
</style>
