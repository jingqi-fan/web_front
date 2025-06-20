<template>
  <div>
    <h1>vue3-setup模板</h1>
    <el-button @click="getUI">用户信息</el-button>

  </div>
</template>

<script setup lang="ts">
import {useUserInfoStore} from "../stores/useUserInfoStore.ts";
import {ElMessage} from "element-plus";
import type {User} from "../entity/user.ts";
import {useTokenStore} from "../stores";




const getUI = () => {
  const userInfoStore = useUserInfoStore();
  const user=userInfoStore.user
  console.log(user);
}
</script>

<style scoped lang="scss">

</style>