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

      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" style="margin-right: 40px;cursor:pointer;"></el-avatar>
    </div>

    <div class="content-container">
      <div class="left">
        <div class="left-info">
          <div style="display: flex;justify-content: space-between;align-items: center">
            <h2 style="margin-left: 20px">个人信息</h2>
            <el-button type="primary" @click="editInfo" style="margin-right: 20px;margin-top: 14px">编辑基本信息</el-button>
          </div>

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
              <p class="value">{{getCreditScoreLevel()}}</p>
            </div>

            <div>
              <img :src="creditScore.idNumber?RegisterIdNumberPng:UnregisterIdNumberPng" alt="" style="width: 200px;height: 90px">
            </div>
          </div>


        </div>
        <div class="left-charts">
          <el-tabs v-model="activeChart" stretch style="width: 400px">
            <el-tab-pane label="信用分变化折线图" name="credit" />
            <el-tab-pane label="消费折线图" name="consume" />
          </el-tabs>
          <div ref="chartRef" style="height: 400px; width: 100%; padding: 10px;" />
        </div>

      </div>
      <div class="right">
        <div class="right-top">
          <div class="top-top">
            <div class="top-top-left">

            </div>
            <div class="top-top-right">
              <EChartsGauge :creditScore="creditScoreValue" style="margin-left: 2px"/>
            </div>
          </div>
          <div class="top-bottom">

          </div>
        </div>
        <div class="right-middle">

        </div>
        <div class="right-bottom">

        </div>
      </div>

    </div>



  </div>
  <el-dialog v-model="dialogFormVisible" title="修改个人信息" width="600">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话" prop="phone">
            <el-input v-model="form.phone" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="省份" prop="province">
            <el-input v-model="form.province" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市" prop="city">
            <el-input v-model="form.city" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="县/市区" prop="country">
            <el-input v-model="form.country" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="乡/镇/街道" prop="township">
            <el-input v-model="form.township" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import Logo from "./component/Logo.vue"
import router from "@/router";
import {computed,ref, onMounted, onBeforeUnmount,reactive} from 'vue';
import lottie from 'lottie-web';
import {ElMessage} from "element-plus";
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";
import {useUserCreditScoreStore} from "@/stores/useUserCreditScore.ts";
import RegisterIdNumberPng from "@/assets/register_id_number.png";
import UnregisterIdNumberPng from "@/assets/unregister_id_number.png";
import {useTokenStore} from "@/stores";
import {updateUserInfo} from "@/api/user.ts";
const userInfo=ref(null)
const creditScore=ref(null)
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
    await router.push('/login');
    return;
  }

  userInfo.value = userInfoStore.user;
  creditScore.value = userCreditScore.score;
  form.username=userInfoStore.user.username
  form.nickname=userInfoStore.user.nickName
  form.email=userInfoStore.user.email
  form.phone=userInfoStore.user.phone
  form.gender=userInfoStore.user.gender
  form.province=userInfoStore.user.province
  form.city=userInfoStore.user.city
  form.country=userInfoStore.user.county
  form.township=userInfoStore.user.township
});
const dialogFormVisible = ref(false)
const editInfo=()=>{
  dialogFormVisible.value=true
}
const form = reactive({
  username: '',
  nickname: '',
  profilePicture: '',
  email: '',
  phone: '',
  gender: '',
  province: '',
  city: '',
  country: '',
  township: ''
})
const formRef = ref()

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
}
const submitForm = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;

    try {
      const tokenStore = useTokenStore();
      const uuid = tokenStore.token.userId;

      const res = await updateUserInfo(uuid, {
        ...form
      });

      ElMessage.success('更新成功');
      dialogFormVisible.value = false;
    } catch (e) {
      ElMessage.error('更新失败，请重试');
    }
  });
};

//用户信用分
import EChartsGauge from './component/EChartsGauge.vue'
const creditScoreValue = ref(560) // 示例信用分


const getCreditScoreLevel=()=>{
  if(creditScore.value.creditScore>=750){
    return '优秀'
  }else if(creditScore.value.creditScore>=650){
    return '良好'
  }else if(creditScore.value.creditScore>=550){
    return '一般'
  }else{
    return `较差${creditScore.value.creditScore}`
  }
}

// 在组件卸载前清除定时器
onBeforeUnmount(() => {
  lottie.destroy();
});




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
//图表
import * as echarts from 'echarts';
import { nextTick, watch } from 'vue';

const activeChart = ref('credit'); // 默认选中信用分折线图
const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;



const renderChart = async () => {
  if (!chartRef.value) return;

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value);
  } else {
    chartInstance.clear();
  }

  chartInstance.showLoading();

  try {
    const response = await fetchChartDataFromApi();
    const data = response.data;

    chartInstance.hideLoading();

    const option = {
      title: {
        text: activeChart.value === 'credit' ? '信用分变化' : '消费变化'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: data.map(d => d.date)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data.map(d => d.value),
          type: 'line',
          smooth: true,
          areaStyle: activeChart.value === 'consume' ? {} : undefined
        }
      ]
    };

    chartInstance.setOption(option);
  } catch (e) {
    chartInstance.hideLoading();
    ElMessage.error("图表加载失败");
  }
};

const fetchChartDataFromApi = async (): Promise<{ data: { date: string; value: number }[] }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (activeChart.value === 'credit') {
        resolve({
          data: [
            { date: '1月', value: 650 },
            { date: '2月', value: 670 },
            { date: '3月', value: 690 },
            { date: '4月', value: 710 },
            { date: '5月', value: 740 },
          ]
        });
      } else {
        resolve({
          data: [
            { date: '1月', value: 1200 },
            { date: '2月', value: 1800 },
            { date: '3月', value: 1400 },
            { date: '4月', value: 2000 },
            { date: '5月', value: 1700 },
          ]
        });
      }
    }, 800); // 模拟延迟
  });
};


onMounted(() => {
  nextTick(() => renderChart());
});

watch(activeChart, () => {
  nextTick(() => renderChart());
});


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
  height: 1000px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-rows: auto auto;
  gap: 10px;
}


.left-info{
  height: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.left-charts{
  height: 480px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.right{
  height: 780px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-rows: auto auto auto;
  gap: 10px;
}
.right-top{
  height: 280px;
  width: 100%;
  background-color: #BFE7FF;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-rows: auto auto;
}
.top-top{
  height: 180px;
  width: 100%;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;

}
.top-top-left{
  border-radius: 8px;
  background-color: #ff6347;
}
.top-top-right{
  width: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: #E6D6F5;
}
.top-bottom{
  height: 80px;
  width: 100%;
  display: flex;
  border-radius: 8px;
  justify-content: flex-start;
  background-color: black;
  align-items: center;
}
.right-middle{
  height: 400px;
  width: 100%;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.right-bottom{
  height: 220px;
  width: 100%;
  background-color: #6dd5ed;
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
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
</style>