<template>
  <div class="logo-container">
    <img src="@/assets/logo-image.png" alt="logo-symbol" class="logo-image" />
    <div class="logo-text-box">
      <div class="logo-text-wrapper">
        <div class="logo-text">西湖分</div>
        <div class="credit">Credit</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 静态组件
</script>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  padding: 16px;
}

.logo-image {
  height: 78px;
  width: auto;
  margin-right: 20px;
}

.logo-text-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo-text-wrapper {
  position: relative;
  display: inline-block;
}

.logo-text {
  font-size: 36px;
  font-weight: bold;
  background: linear-gradient(to right, #00d4ff, #0080ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.credit {
  position: absolute;
  right: 0;
  bottom: -24px;
  font-size: 16px;
  font-style: italic;
  background: linear-gradient(to right, #00d4ff, #0080ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 1px 1px #ccc;
}
</style>
