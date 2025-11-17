<template>
  <div class="login-wrapper">
    <login-header  @click="goToHome" />
    <div class="login-container" >
      <div class="title-container">
        <h1 class="title margin-no">{{type==='register'?'注册：':'登录到 :'}}</h1>
        <h1 class="title">
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span style="color: #105e3f">第21人民医院智能平台</span>
<!--          <span style="color: dodgerblue">个人信用</span>-->
<!--          <span style="color: lightskyblue">平台</span>-->
        </h1>

        <div class="sub-title">
          <p class="tip">{{ type == 'register' ? '已有账号?' : '没有账号吗?' }}</p>
          <p class="tip" @click="switchType(type == 'register' ? 'login' : 'register')">
            {{ type == 'register' ? '登录' : '注册新账号' }}
          </p>
        </div>
      </div>

      <login v-if="type === 'login'" />
      <register v-else @register-success="switchType('login')" />
    </div>

<!--    <footer class="copyright">Copyright @ 2024-2030 西湖市人民政府. All Rights Reserved</footer>-->
  </div>
</template>
<script lang="tsx">
export default {
  name: 'LoginIndex',
};
</script>
<script setup lang="tsx">
import { ref } from 'vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import LoginHeader from './components/Header.vue';
import router from "../../router";


const goToHome=()=>{
  router.push('/')
}
const type = ref('login');
const switchType = (val: string) => {
  type.value = val;
};
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
