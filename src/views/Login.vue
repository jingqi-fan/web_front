<template>
  <div>
    <h1>vue3-setup模板</h1>
    <el-button type="primary" @click="handlerLogin">登录</el-button>
    <el-text >{{text}}</el-text>
   <el-button @click="getText">获取用户信息</el-button>
    <el-button v-if="visible" @click="updateInfo">更新用户信息</el-button>
    <el-button @click="calculate">计算用户信用分</el-button>
    <el-button @click="getUCInfo">获取用户信用份信息</el-button>
    <el-text>{{uc}}</el-text>
    <el-button @click="router.push('/home')">导航->Home</el-button>

  </div>
</template>

<script setup lang="ts">

import {
  getUserCreditScoreInfo,
  getUserInfo,
  login,
  register,
  updateUserCreditScore,
  updateUserInfo
} from "../api/user.ts";
import {useTokenStore} from "../stores";
import {useUserInfoStore} from "../stores/useUserInfoStore.ts";
import {ref} from "vue";
import {ElMessage} from "element-plus";
import type {UserCreditScore} from "../entity/user_credit_score.ts";
import router from "../router";
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
  visible.value=true

}
const text=ref('')
const getText = async () => {
  try {
    const tokenStore = useTokenStore();
    // ✅ 添加await等待异步结果
    text.value = await getUserInfo(tokenStore.token.userId);
    console.log("id=",tokenStore.token.id)
    console.log('获取用户信息成功', text.value)
  } catch (error) {
    console.error('获取用户信息失败', error);
    ElMessage.error('用户信息加载失败');
  }

}
const updateInfo=async () => {
  const tokenStore = useTokenStore();
  const uuid=tokenStore.token.userId
  console.log("用户id",uuid)
  const res=await updateUserInfo(uuid,{
    username: "zachary",
    nickname: "kysonabb",
    profilePicture: "https://example.com/avatar.jpg",
    email: "zachary@example.com",
    phone: "15772779476",
    gender: "男",
    province: "浙江",
    city: "杭州",
    country: "西湖区",
    township: "西湖"
  })
  console.log(res)
}
const calculate=async () => {
  const userInfoStore=useUserInfoStore()
  const id=userInfoStore.user.id
  console.log("id=",id)
  const res=await updateUserCreditScore(id,{
    accountType: "330100194911070086",
    idNumber:"52242220030312081X",
    annualIncome:8328.0,
    qualification: "高中",
    jobType:"退休人员",
    maritalStatus:"已婚"
  })
  console.log("计算结果",res)
}
const uc=ref<UserCreditScore>()
const getUCInfo=async () => {
  const userInfoStore=useUserInfoStore()
  uc.value=await getUserCreditScoreInfo(userInfoStore.user.id)
  console.log("信用分信息",uc.value)
}

</script>

<style scoped lang="scss">

</style>