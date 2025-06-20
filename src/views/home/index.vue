<template>
  <div class="video-background">
    <video id="bg-video" autoplay muted loop>
      <source src="@/assets/vLog.mp4" type="video/mp4" />
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
    <home-header/>
  </div>
  <div class="home-news">
    <footer class="copyright">Copyright @ 2025-2030 中软国际. All Rights Reserved</footer>

  </div>


</template>

<script setup lang="tsx">


import { ref } from 'vue';
import HomeHeader from './components/Header.vue';



const type = ref('login');
const switchType = (val: string) => {
  type.value = val;
};
</script>

<style lang="less" scoped>
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

#bg-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-content {
  position: relative;
  z-index: 1;
}
</style>
