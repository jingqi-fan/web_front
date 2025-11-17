<template>
  <header class="login-header">
    <!-- 只保留 PNG logo -->
    <img src="@/assets/logo_small.png" class="logo" />

    <div class="operations-container">
      <t-button theme="default" shape="square" variant="text" @click="navToGovernment">
        <t-icon name="double-storey" class="icon" />
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
// SVG 已经不用了，这里就不导入了
// import AutoMonitorLogo from '@/assets/logo.svg';
import { ref } from "vue";

const slotChecked = ref(true);

const navToGovernment = () => {
  window.open("https://www.hangzhou.gov.cn/");
};

const navToHelper = () => {
  window.open("https://www.chinasofti.com/");
};
</script>

<style lang="less" scoped>
.login-header {
  padding: 0 24px;
  display: flex;
  align-items: center;      // 改成从左往右排
  backdrop-filter: blur(5px);
  color: var(--td-text-color-primary);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    cursor: pointer;
  }

  .logo {
    width: 80px;
    cursor: pointer;
    padding: 6px;
  }

  .operations-container {
    margin-left: auto;      // 把右边按钮整体推到最右侧
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
