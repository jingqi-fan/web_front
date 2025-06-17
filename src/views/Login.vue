<template>
  <div>
    <h1>vue3-setup模板</h1>
    <el-button type="primary" @click="handlerLogin">登录</el-button>
    <el-text >{{text}}</el-text>
    <el-button v-if="visible" @click="updateInfo">更新用户信息</el-button>

  </div>
</template>

<script setup lang="ts">

import {getUserInfo, login, register, updateUserInfo} from "../api/user.ts";
import {useTokenStore} from "../stores";
import {ref} from "vue";
import {ElMessage} from "element-plus";
const deviceId="123456"
const visible=ref(false)
const username="zachary"
const password="123456"

const handlerLogin =async () => {
  const res=await login({
    username: username,
    password: password,
    device: deviceId
  })
  console.log("登录结果",res)
  await getText()
  visible.value=true
}
const text=ref('')
const getText = async () => {
  try {
    const tokenStore = useTokenStore();
    // ✅ 添加await等待异步结果
    text.value = await getUserInfo(tokenStore.token.userId);
    console.log('获取用户信息成功', text.value)
  } catch (error) {
    console.error('获取用户信息失败', error);
    ElMessage.error('用户信息加载失败');
  }
}
const updateInfo=async () => {
  const tokenStore = useTokenStore();
  const uuid=tokenStore.token.userId
  await updateUserInfo(uuid,{
    username: "zachary",
    nickname: "zachary",
    profilePicture: "https://example.com/avatar.jpg",
    email: "zachary@example.com",
    phone: "15772779476",
    gender: "男",
    province: "浙江",
    city: "杭州",
    country: "西湖区",
    township: "西湖"
  })
}


</script>

<style scoped lang="scss">

</style>