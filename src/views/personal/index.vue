<template>
  <div class="main-container">
    <div class="header-container">
      <logo style="margin-left: 20px;cursor: pointer" @click="backHome"/>
      <el-popover
          placement="right"
          :width="150"
          trigger="hover"
          content="酒店、租房、购物更省心"
      >
        <template #reference>
          <div class="card-icon" @click="goToCreditBusiness" style="cursor: pointer">
            <div ref="shoppingContainer" class="lottie-container"></div>
          </div>
        </template>
      </el-popover>

      <el-popover
          placement="right"
          :width="150"
          trigger="hover"
          content="停车、就医、借阅更舒心"
      >
        <template #reference>
          <div class="card-icon" @click="goToCreditLife" style="cursor: pointer">
            <div ref="lifeContainer" class="lottie-container"></div>
          </div>
        </template>
      </el-popover>

      <el-popover
          placement="right"
          :width="150"
          trigger="hover"
          content="个人信用一目了然"
      >
        <template #reference>
          <div @click="goToCreditManagerPage" class="card-icon" style="cursor: pointer">
            <div ref="creditManagerContainer" class="lottie-container"></div>
          </div>
        </template>
      </el-popover>
      <el-avatar style="margin-right: 40px;cursor:pointer;"></el-avatar>
    </div>

    <div class="content-container">
      <div class="left">
        <div class="left-info">
          <h2 style="margin-left: 20px">个人信息</h2>
          <div class="info-row">
            <div class="info-item">
              <p class="label">姓名</p>
              <p class="value">{{userInfo.username}}</p>
            </div>
            <div class="info-item">
              <p class="label">电话</p>
              <p class="value">{{userInfo.phone}}</p>
            </div>
            <div class="info-item">
              <p class="label">昵称</p>
              <p class="value">{{userInfo.nickName}}</p>
            </div>
            <div class="info-item">
              <p class="label">住址</p>
              <p class="value">{{userInfo.address}}</p>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <p class="label">性别</p>
              <p class="value">{{userInfo.gender}}</p>
            </div>
            <div  class="info-item">
              <p  class="label">邮箱</p>
              <p  class="value">{{userInfo.email}}</p>
            </div>
            <div class="info-item" >
              <p  class="label">身份证号</p>
              <p class="value">{{creditScore.idNumber}}</p>
            </div>
            <div  class="info-item">
              <p  class="label">账户</p>
              <p class="value">{{creditScore.accountType}}</p>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <p  class="label">年收入</p>
              <p class="value">{{creditScore.annualIncome}}</p>
            </div>
            <div  class="info-item">
              <p class="label">学历</p>
              <p class="value">{{creditScore.qualification}}</p>
            </div>
            <div  class="info-item">
              <p class="label">工作类型</p>
              <p class="value">{{creditScore.jobType}}</p>
            </div>
            <div  class="info-item">
              <p class="label">婚姻状态</p>
              <p class="value">{{creditScore.maritalStatus}}</p>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <p class="label">信用等级</p>
              <p class="value">优秀</p>
            </div>
          </div>


        </div>
        <div class="left-charts">

        </div>
      </div>
      <div class="right">

      </div>

    </div>


  </div>
</template>

<script setup lang="ts">
import Logo from "./component/Logo.vue"
import router from "@/router";
import {ref, onMounted, onBeforeUnmount} from 'vue';
import lottie from 'lottie-web';
import {ElMessage} from "element-plus";
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";
import {useUserCreditScoreStore} from "@/stores/useUserCreditScore.ts";


//lottie动画部分
const shoppingContainer = ref(null)
const lifeContainer=ref(null)
const creditManagerContainer=ref(null)
let intervalId: ReturnType<typeof setInterval> | null = null;
// 动画加载
onMounted(() => {
  lottie.loadAnimation({
    container: shoppingContainer.value!,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: new URL('@/assets/shopping.json', import.meta.url).href,
  });
  lottie.loadAnimation({
    container: lifeContainer.value!,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: new URL('@/assets/life.json', import.meta.url).href,
  });
  lottie.loadAnimation({
    container: creditManagerContainer.value!,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: new URL('@/assets/personal.json', import.meta.url).href,
  });
});
onMounted(async () => {
  const userInfoStore = useUserInfoStore();
  const userCreditScore = useUserCreditScoreStore();

  if (!userInfoStore.user || !userCreditScore.score) {
    ElMessage.error('用户信息或信用评分加载失败，请重新登录');
    router.push('/login');
    return;
  }

  userInfo.value = userInfoStore.user;
  creditScore.value = userCreditScore.score;
});

// 在组件卸载前清除定时器
onBeforeUnmount(() => {
  lottie.destroy();
});


const userInfo=ref()
const creditScore=ref()

const loadUserInfoAndCreditScore=async ()=>{
  const userInfoStore=useUserInfoStore()
  if(userInfoStore.user===null){
    ElMessage.error('用户信息加载失败,请重新登录!');
    router.push('/login')
    return
  }
  userInfo.value=userInfoStore.user
  console.log("userInfo.value",userInfo.value)


  const userCreditScore=useUserCreditScoreStore()
  if(userCreditScore.score===null){
    ElMessage.error('信用评分加载失败,请重新登录尝试!');
    console.log("creditScore.value",userCreditScore.score)
    router.push('/login')
    return
  }
  creditScore.value=userCreditScore.score
  console.log("creditScore.value",userCreditScore.score)
}
loadUserInfoAndCreditScore()


const backHome = () => {
  router.push('/home')
}
const goToCreditManagerPage = () => {
  ElMessage.info('功能暂未开放');
}
const goToCreditLife = () => {
  ElMessage.info('功能暂未开放');
}
const goToCreditBusiness = () => {
  router.push('/creditbusiness')
}
</script>

<style scoped lang="scss">
.main-container {
  display:grid;
  gap: 10px;
  grid-template-rows: auto 3fr;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;

  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.lottie-container{
  height: 100px;
  width: 100px;
}
.content-container{
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 10px;
}
.left{
  height: 880px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-rows: auto auto;
  gap: 10px;
}
.right{
  height: 640px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

}
.left-info{

  height: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.left-charts{
  height: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.info-row {
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 20px;
}

.info-item {
  flex: 1;
  min-width: 0; // 防止内容撑破
  margin-right: 20px;
  overflow: hidden;
}

.label {
  color: #808080;
  font-size: 14px;
  margin-bottom: 4px;
}

.value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>