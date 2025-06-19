<template>
  <header class="login-header">
    <auto-monitor-logo class="logo" />

    <div class="operations-container">
      <t-button theme="default" shape="square" variant="text" @click="navToGitee">
        <t-icon name="logo-github" class="icon" />
      </t-button>
      <t-button theme="default" shape="square" variant="text" @click="navToHelper">
        <t-icon name="help-circle" class="icon" />
      </t-button>
      <t-switch v-model="slotChecked" size="large" style="margin-left: 15px">
        <template #label="slotProps">{{ slotProps.value ? '中' : 'En' }}</template>
      </t-switch>
    </div>
  </header>
</template>

<script setup lang="ts">
import AutoMonitorLogo from '@/assets/logo.svg';
import {ref} from "vue";

const slotChecked = ref(true);



const navToGitee = () => {
  window.open('https://gitee.com/sekirosdadfs/AutoMonitor.git');
};

const navToHelper = () => {
  window.open('https://www.swcontest.com.cn/index');
};
</script>

<style lang="less" scoped>
.login-header {
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(5px);
  color: var(--td-text-color-primary);
  &:hover {
    background-color: rgba(255, 255, 255, 0.1); // 鼠标悬停时改变背景颜色
    cursor: pointer; // 鼠标悬停时改变光标样式
  }

  .logo {
    width: 330px;
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
      padding: 6px;
      box-sizing: content-box;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
