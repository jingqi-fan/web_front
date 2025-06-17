<template>
  <div>
    <el-button @click="handlerLogin">登录</el-button>
    <el-button @click="getInfo">信息</el-button>
    <el-button @click="goToMap">数据中心</el-button>

  </div>
</template>

<script setup lang="ts">
import router from "../router";

const handlerLogin = () => {
  router.push('/login')
}
const getInfo = () => {
  router.push('/info')
}
const goToMap = () => {
  router.push('/map')
}
</script>

<style scoped lang="scss">

</style>