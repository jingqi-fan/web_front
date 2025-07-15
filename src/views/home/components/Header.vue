<template>
  <header class="login-header">
    <auto-monitor-logo class="logo" @click="goToHome" />

    <div class="header-option">
      <t-button variant="text" @click="goToManagerPage">
        管理员入口
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
      <!-- 登录状态：头像 + 下拉菜单 -->
      <t-dropdown
          v-if="isLoggedIn"
          :options="userOptions"
          trigger="click"
          @click="handleUserOptionClick"
      >
        <t-avatar
            :image="user?.avatar || defaultAvatar"
            size="medium"
            style="cursor: pointer"
        />
      </t-dropdown>

      <!-- 未登录状态：登录/注册按钮 -->
      <t-button
          v-else
          style="height: 40px; color: #FFFFFF"
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


import { ref } from "vue";
import {ElMessage} from "element-plus";
import useRouterStore from "../../../stores/useSystemStore.ts";
import router from "../../../router";

import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";


import { computed } from 'vue';
import type { DropdownOption, DropdownProps } from 'tdesign-vue-next';
import {userLogout} from "@/api/user.ts";
import {useDeviceStore} from "@/stores/useDeviceStore.ts";

const userStore = useUserInfoStore();
const user = computed(() => userStore.user);
const isLoggedIn = computed(() => user.value !== null);

// 下拉菜单项
const userOptions: DropdownOption[] = [
  { content: '个人中心', value: 'personal' },
  { content: '首页', value: 'home' },
  { content: '退出登录', value: 'logout' },
];

// 下拉点击处理
const handleUserOptionClick: DropdownProps['onClick'] =async (data) => {
  switch (data.value) {
    case 'personal':
      await router.push('/personal');
      break;
    case 'home':
      await router.push('/welcome');
      break;
    case 'logout':
      const userInfoStore=useUserInfoStore();
      const deviceStore=useDeviceStore()
      await userLogout(userInfoStore.user.uuid,deviceStore.device)
      ElMessage.success('已退出登录');
      await router.push('/home');
      break;
  }
};

const Login = () => {
  router.push('/login');
};

const defaultAvatar=ref('')
defaultAvatar.value=userStore.user?.profilePicture || "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"


// 退出登录方法
const logout = () => {
  userStore.removeUserInfo();
  ElMessage.success("已退出登录");
  router.push("/login");
};

const routerStore = useRouterStore();
// 用于语言切换
const slotChecked = ref(true);

const isUserLogged=()=>{
  const userStore = useUserInfoStore();
  return userStore.user !== null;
}
const goToManagerPage = () => {
  // if(!isUserLogged()){
  //   routerStore.setRouter('/manager')
  //   ElMessage.warning('请先登录')
  //   router.push('/managerLogin')
  //   return
  // }
  router.push('/manager');
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
  if(!isUserLogged()){
    routerStore.setRouter('/life')
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  // 跳转到应用中心页面
  router.push('/life');
};
const goToCreditManage = () => {
  if(!isUserLogged()){
    routerStore.setRouter('/manage')
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  router.push('/manageHouse');
}

const navToGovernment = () => {
  router.push('/doctor/login')
};

const navToHelper = () => {
  window.open('https://www.chinasofti.com/');
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
