<template>
  <div>
    <h1>管理员端</h1>
    <el-button @click="dataCenter" type="primary">数据中心</el-button>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";

const dataCenter = () => {
  router.push('/manager/dataCenter')
}
</script>

<style scoped lang="scss">

</style>