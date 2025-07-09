<template>
  <div class="main-container animate__animated animate__fadeIn">
    <div class="header-container animate__animated animate__fadeInDown animate__fast">
      <logo style="margin-left: 20px;cursor: pointer" @click="backHome"/>
      <el-popover
          placement="right"
          :width="150"
          trigger="hover"
          content="酒店、租房、购物更省心"
      >
        <template #reference>
          <div class="card-icon animate__animated animate__zoomIn" @click="goToCreditBusiness" style="cursor: pointer">
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
          <div class="card-icon animate__animated animate__zoomIn" @click="goToCreditLife" style="cursor: pointer">
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
          <div class="card-icon animate__animated animate__zoomIn" @click="goToCreditManagerPage" style="cursor: pointer">
            <div ref="creditManagerContainer" class="lottie-container"></div>
          </div>
        </template>
      </el-popover>

      <el-popover
          placement="bottom-end"
          :width="160"
          trigger="hover"
          popper-class="custom-avatar-popover"
      >
        <template #reference>
          <el-avatar
              :src="avatarUrl"
              style="margin-right: 40px; cursor: pointer;"
              class="animate__animated animate__fadeInRight"
          />
        </template>

        <div class="avatar-options">
          <div class="option-item" @click="handleEditRealInfo">
            <el-icon class="icon info"><UserFilled /></el-icon>
            信用信息
          </div>
          <div class="option-item" @click="handleChangeAvatar">
            <el-icon class="icon primary"><PictureFilled /></el-icon>
            更换头像
          </div>
          <div class="option-item logout" @click="logout">
            <el-icon class="icon danger"><SwitchButton /></el-icon>
            退出登录
          </div>
        </div>
      </el-popover>
    </div>

    <div class="content-container">
      <div class="left">
        <div class="left-info">
          <div style="display: flex;justify-content: space-between;align-items: center">
            <h2 style="margin-left: 20px">个人信息</h2>
            <el-button type="success" @click="editCreditScore" style="margin-left: 660px;margin-top: 14px" plain>完善/上传 实名资产信息</el-button>
            <el-button type="primary" @click="editInfo" style="margin-right: 20px;margin-top: 14px" plain>编辑基本信息</el-button>
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
              <p class="label">真实姓名</p>
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
              <img :src="getStatusPng()" alt="" style="width: 200px;height: 90px">
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
          <div class="top-content">
            <el-avatar
                class="avatar"
                :src="avatarUrl"
            />
            <EChartsGauge :creditScore="creditScoreValue" style="height: 160px;width: 160px" />
          </div>

          <div class="greeting-section">
            <p class="greeting-text">{{ getGood() }} 👋</p>
            <p class="greeting-subtext">
              这是你加入 <strong>西湖分</strong> 的第 <strong>{{ daysSince(joinedDays) }}</strong> 天！
            </p>
          </div>
        </div>
        <div class="right-middle">
          <div class="ranking-container">
            <h3 style="margin-bottom: 10px; text-align: center;">信用排行榜</h3>
            <ul class="ranking-list">
              <li v-for="(user, index) in creditRankList" :key="index" class="ranking-item">
                <span class="rank-num">{{ index + 1 }}</span>
                <el-avatar :src="user.avatar" />
                <span class="user-area">{{ user.area }}</span>
                <span class="user-score">{{ user.score }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="right-bottom">
          <div class="recent-services">
            <h3 style="text-align: center; margin: 16px 0;">最近使用服务</h3>
            <div class="service-list">
              <div
                  v-for="(service, index) in recentServices"
                  :key="index"
                  class="service-card"
              >
                <div class="service-icon">{{ service.icon }}</div>
                <div class="service-name">{{ service.name }}</div>
              </div>
            </div>
          </div>
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
          <el-form-item label="真实姓名" prop="nickname">
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
            <el-input v-model="form.province"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市" prop="city">
            <el-input v-model="form.city"/>
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

  <el-dialog v-model="ucsDialogVisible" title="完善/修改用户信用分信息" width="1000">
    <el-form :model="ucForm" :rules="ucRules" ref="formRef" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="银行账户" prop="accountType">
            <el-input v-model="ucForm.accountType"/>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="20">

        <el-col :span="12">
          <el-form-item label="身份证号" prop="idNumber">
            <el-input v-model="ucForm.idNumber" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="工作类型" prop="categoryId">
            <el-select v-model="ucForm.jobType" placeholder="请选择工作类型">
              <el-option
                  v-for="job in jobTypes"
                  :key="job"
                  :label="job"
                  :value="job" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学历" prop="categoryId">
            <el-select v-model="ucForm.qualification" placeholder="请选择学历">
              <el-option
                  v-for="qu in qualifications"
                  :key="qu"
                  :label="qu"
                  :value="qu" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="婚姻状态" prop="gender">
            <el-radio-group v-model="ucForm.maritalStatus">
              <el-radio label="未婚">未婚</el-radio>
              <el-radio label="已婚">已婚</el-radio>
              <el-radio label="离婚">离婚</el-radio>
              <el-radio label="丧偶">丧偶</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="年收入" prop="annualIncome">
            <el-input-number v-model="ucForm.annualIncome" :min="0" :step="5000" :precision="2" />
          </el-form-item>
        </el-col>

      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="身份证正面" prop="idCardFront">
            <el-upload
                :before-upload="beforeUpload"
                :http-request="uploadProof('idCardFront')"
                :show-file-list="false"
            >
              <div class="upload-box">
                <img v-if="ucForm.idCardFront" :src="ucForm.idCardFront" alt="身份证正面" />
                <div v-else class="upload-placeholder">点击上传身份证正面</div>
              </div>
            </el-upload>
          </el-form-item>

        </el-col>

        <el-col :span="12">
          <el-form-item label="身份证反面" prop="idCardBack">
            <el-upload
                :before-upload="beforeUpload"
                :http-request="uploadProof('idCardBack')"
                :show-file-list="false"
            >
              <div class="upload-box">
                <img v-if="ucForm.idCardBack" :src="ucForm.idCardBack" alt="身份证反面" />
                <div v-else class="upload-placeholder">点击上传身份证反面</div>
              </div>
            </el-upload>

          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="工作证明" prop="workProof">
            <el-upload
                :before-upload="beforeUpload"
                :http-request="uploadProof('workProof')"
                :show-file-list="false"
            >
              <div class="upload-box">
                <img v-if="ucForm.workProof" :src="ucForm.workProof" alt="工作证明" />
                <div v-else class="upload-placeholder">点击上传工作证明</div>
              </div>
            </el-upload>

          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="学历证明" prop="educationProof">
            <el-upload
                :before-upload="beforeUpload"
                :http-request="uploadProof('educationProof')"
                :show-file-list="false"
            >
              <div class="upload-box">
                <img v-if="ucForm.educationProof" :src="ucForm.educationProof" alt="学历证明" />
                <div v-else class="upload-placeholder">点击上传学历证明</div>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="收入证明" prop="incomeProof">
            <el-upload
                :before-upload="beforeUpload"
                :http-request="uploadProof('incomeProof')"
                :show-file-list="false"
            >
              <div class="upload-box">
                <img v-if="ucForm.incomeProof" :src="ucForm.incomeProof" alt="收入证明" />
                <div v-else class="upload-placeholder">点击上传收入证明</div>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click=" ucsDialogVisible= false">取消</el-button>
        <el-button type="primary" @click="submitUcsForm">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="avatarDialogVisible" title="更换头像" width="400px">
    <el-upload
        class="avatar-uploader"
        :before-upload="beforeUpload"
        :http-request="uploadAvatar"
        :show-file-list="false"
    >
      <img v-if="previewAvatarUrl" :src="previewAvatarUrl" class="avatar-preview" />
      <div v-else class="upload-placeholder">点击上传头像</div>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="avatarDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAvatar">确认修改</el-button>
      </div>
    </template>
  </el-dialog>


</template>

<script setup lang="ts">
import Logo from "./component/Logo.vue"
import router from "@/router";
import {computed,ref, onMounted, onBeforeUnmount,reactive} from 'vue';
import lottie from 'lottie-web';
import {ElLoading, ElMessage} from "element-plus";
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";
import {useUserCreditScoreStore} from "@/stores/useUserCreditScore.ts";
import RegisterIdNumberPng from "@/assets/register_id_number.png";
import UnregisterIdNumberPng from "@/assets/unregister_id_number.png";
import CheckingPng from "@/assets/checking.png"
import NotPassPng from "@/assets/not_pass.png"
import {useTokenStore} from "@/stores";
import {updateUserInfo, getTopCreditUsers, userLogout, updateUserCreditScore, updateAvatar} from "@/api/user.ts";
const userInfo=ref(null)
const creditScore=ref(null)
const shoppingContainer = ref(null)
const lifeContainer=ref(null)
const creditManagerContainer=ref(null)


const getStatusPng = () => {
  const status = userCreditScoreStore.score.status;

  switch (status) {
    case 0:
      return UnregisterIdNumberPng;
    case 1:
      return CheckingPng;
    case 2:
      return NotPassPng;
    case 3:
      return RegisterIdNumberPng;
    default:
      return UnregisterIdNumberPng;
  }
}

// 动画加载
const avatarUrl=ref('')
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
//
const creditRankList = ref<{ avatar: string; score: number; area: string }[]>([])

onMounted(async () => {
  creditRankList.value = await getTopCreditUsers()
})


const avatarDialogVisible = ref(false);
const previewAvatarUrl = ref('');

// 打开弹窗
const handleChangeAvatar = () => {
  previewAvatarUrl.value = avatarUrl.value;
  avatarDialogVisible.value = true;
};

// 上传头像逻辑
const uploadAvatar = async ({ file }: { file: File }) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const { data } = await axiosInstance.post('/activity/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (data === '500') return ElMessage.error('上传失败');
    previewAvatarUrl.value = data;
    ElMessage.success('上传成功');
  } catch (err) {
    ElMessage.error('上传失败');
    console.error(err);
  }
};

// 提交头像更新
const submitAvatar = async () => {
  const userId = userInfoStore.user.id;
  if (!previewAvatarUrl.value) {
    ElMessage.warning('请上传头像');
    return;
  }
  try {
    await updateAvatar(userId, previewAvatarUrl.value);
    avatarUrl.value = previewAvatarUrl.value;
    ElMessage.success('头像更新成功');
    avatarDialogVisible.value = false;
  } catch (e) {
    ElMessage.error('头像更新失败');
    console.error(e);
  }
};

function getGood(): string {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 11) {
    return '早上好'
  } else if (hour >= 11 && hour < 13) {
    return '中午好'
  } else if (hour >= 13 && hour < 18) {
    return '下午好'
  } else {
    return '晚上好'
  }
}
const userInfoStore = useUserInfoStore();
const userCreditScoreStore = useUserCreditScoreStore();
onMounted(async () => {


  if (!userInfoStore.user || !userCreditScoreStore.score) {
    ElMessage.error('用户信息或信用评分加载失败，请重新登录');
    await router.push('/login');
    return;
  }

  userInfo.value = userInfoStore.user;
  creditScore.value = userCreditScoreStore.score;
  form.username=userInfoStore.user.username
  form.nickname=userInfoStore.user.nickName
  form.email=userInfoStore.user.email
  form.phone=userInfoStore.user.phone
  form.gender=userInfoStore.user.gender
  form.province=userInfoStore.user.province
  form.city=userInfoStore.user.city
  form.country=userInfoStore.user.county
  form.township=userInfoStore.user.township
  creditScoreValue.value=creditScore.value.creditScore
  joinedDays.value=userInfoStore.user.createTime
  avatarUrl.value=userInfoStore.user.profilePicture
});

const joinedDays=ref('')

function daysSince(dateStr: string): number {
  const inputDate = new Date(dateStr)  // 解析 ISO 字符串
  const now = new Date()

  const utc1 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const utc2 = Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate())

  const msPerDay = 1000 * 60 * 60 * 24
  return Math.floor((utc1 - utc2) / msPerDay)
}

const dialogFormVisible = ref(false)
const editInfo=()=>{
  dialogFormVisible.value=true
  if(form.nickname==="未设置"){
    form.nickname=''
  }
  if(form.email==="未设置"){
    form.email=''
  }
  if(form.phone==="未设置"){
    form.phone=''
  }
  if(form.gender==="未设置"){
    form.gender=''
  }
  if(form.province==="未设置"){
    form.province='浙江省'
  }
  if(form.city==="未设置"){
    form.city='杭州市'
  }
  if(form.country==="未设置"){
    form.country=''
  }
  if(form.township==="未设置"){
    form.township=''
  }
}
const form = reactive({
  username: '',
  nickname: '',
  profilePicture: '',
  email: '',
  phone: '',
  gender: '',
  province: '浙江省',
  city: '杭州市',
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

      ElMessage.success('更新成功,请重新登录');
      await getUserInfo(uuid);
      await getUserCreditScoreInfo(userInfoStore.user.id)
      dialogFormVisible.value = false;
    } catch (e) {
      ElMessage.error('更新失败，请重试');
    }
  });
};

//用户信用分
import EChartsGauge from './component/EChartsGauge.vue'
const creditScoreValue = ref(0) // 示例信用分

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
  if(userInfoStore.user===null){
    ElMessage.error('用户信息加载失败,请重新登录!');
    await router.push('/login')
    return
  }
  userInfo.value=userInfoStore.user

  if(userCreditScoreStore.score===null){
    ElMessage.error('信用评分加载失败,请重新登录尝试!');
    await router.push('/login')
    return
  }
  creditScore.value=userCreditScoreStore.score
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
import {PictureFilled, SwitchButton, UserFilled} from "@element-plus/icons-vue";
import {useDeviceStore} from "@/stores/useDeviceStore.ts";
import axiosInstance from "@/plugins/axios.ts";
import { getUserCreditScoreInfo, getUserInfo } from "../../api/user";

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
const allServices = [
  { name: '酒店预定', icon: '🏨' },
  { name: '二手房租赁', icon: '🏠' },
  { name: '优惠购物', icon: '🛍️' },
  { name: '舒心就医', icon: '🩺' },
  { name: '便捷停车', icon: '🅿️' },
  { name: '图书借阅', icon: '📚' },
  { name: '亲社会行为', icon: '🤝' },
];

const getRecentUsedServices = async () => {
  return new Promise<{ name: string; icon: string }[]>(resolve => {
    setTimeout(() => {
      // 模拟返回最近使用的3个服务
      const shuffled = allServices.sort(() => 0.5 - Math.random());
      resolve(shuffled.slice(0, 3));
    }, 500);
  });
};
const recentServices = ref<{ name: string; icon: string }[]>([]);

onMounted(async () => {
  recentServices.value = await getRecentUsedServices();
});

const logout=async ()=>{
  const id=userInfo.value.uuid
  const deviceStore=useDeviceStore()
  const device=deviceStore.device
  const res=await userLogout(id,device)
  if(res.status===200){
    await router.push('/home')
    ElMessage.success("退出成功")
  }
  else{
    ElMessage.error("退出失败")
    await router.push('/home')
  }
}
const ucsDialogVisible=ref(false);
const ucForm=reactive({
  accountType:'',
  idNumber:'',
  annualIncome:0.0,
  qualification:'',
  jobType:'',
  maritalStatus:'未婚',
  idCardFront: '',
  idCardBack: '',
  workProof: '',
  educationProof: '',
  incomeProof: ''
})
const editCreditScore=()=>{
  ucForm.accountType=userCreditScoreStore.score.accountType===''?'未填写':userCreditScoreStore.score.accountType
  ucForm.idNumber=userCreditScoreStore.score.idNumber===''?'未填写':userCreditScoreStore.score.idNumber
  ucForm.annualIncome=userCreditScoreStore.score.annualIncome===0.0?'未填写':userCreditScoreStore.score.annualIncome
  ucForm.qualification=userCreditScoreStore.score.qualification===''?'未填写':userCreditScoreStore.score.qualification
  ucForm.jobType=userCreditScoreStore.score.jobType===''?'未填写':userCreditScoreStore.score.jobType
  ucForm.maritalStatus=userCreditScoreStore.score.maritalStatus===''?'未婚':userCreditScoreStore.score.maritalStatus
  ucForm.idCardFront=userCreditScoreStore.score.idCardFront===''?'':userCreditScoreStore.score.idCardFront
  ucForm.idCardBack=userCreditScoreStore.score.idCardBack===''?'':userCreditScoreStore.score.idCardBack
  ucForm.workProof=userCreditScoreStore.score.workProof===''?'':userCreditScoreStore.score.workProof
  ucForm.educationProof=userCreditScoreStore.score.educationProof===''?'':userCreditScoreStore.score.educationProof
  ucForm.incomeProof=userCreditScoreStore.score.incomeProof===''?'':userCreditScoreStore.score.incomeProof
  ucsDialogVisible.value=true
}

const ucRules={
  accountType:[
    { required: true, message: '请输入账号', trigger: 'blur' },
  ],
  idNumber:[
    { required: true, message: '请输入身份证号', trigger: 'blur' },
  ],
  annualIncome:[
    { required: true, message: '请输入年收入', trigger: 'blur' },
  ],
  qualification:[
    { required: true, message: '请选择学历', trigger: 'blur' },
  ],
  jobType:[
    { required: true, message: '请选择职业', trigger: 'blur' },
  ],
  maritalStatus:[
    { required: true, message: '请选择婚姻状态', trigger: 'blur' },
  ],
  idCardFront:[
    { required: true, message: '请上传身份证正面', trigger: 'blur' },
  ],
  idCardBack:[
    { required: true, message: '请上传身份证反面', trigger: 'blur' },
  ],
  workProof:[
    { required: true, message: '请上传工作证明', trigger: 'blur' },
  ],
  educationProof:[
    { required: true, message: '请上传教育证明', trigger: 'blur' },
  ],
  incomeProof:[
    { required:true, message: '请上传收入证明', trigger: 'blur' },
  ]
}
const submitUcsForm = async () => {
  const userId = userInfoStore.user.id

  // 校验空字段
  const missing =
      !ucForm.accountType ||
      !ucForm.idNumber ||
      !ucForm.annualIncome ||
      !ucForm.qualification ||
      !ucForm.jobType ||
      !ucForm.maritalStatus ||
      !ucForm.idCardFront ||
      !ucForm.idCardBack ||
      !ucForm.workProof ||
      !ucForm.educationProof ||
      !ucForm.incomeProof

  if (missing) {
    ElMessage.error("请填写完整信息")
    return
  }

  // 显示加载动画
  const loading = ElLoading.service({
    lock: true,
    text: '提交中，请稍候...',
    background: 'rgba(0, 0, 0, 0.3)'
  })

  try {
    const res = await updateUserCreditScore(userId, ucForm)
    ElMessage.success("更新成功,请重新登录",res)
    ucsDialogVisible.value = false
    const tokenStore=useTokenStore()
    await getUserInfo(tokenStore.uuid);
    await getUserCreditScoreInfo(userInfoStore.user.id)
  } catch (error) {
    ElMessage.error("请求异常")
    console.error(error)
  } finally {
    loading.close()
  }
}
const qualifications=[
    '文盲',
    '小学',
    '初中',
    '高中',
    '大学及以上'
]
const jobTypes=[
    '公务员',
    '自由职业',
    '私营个体',
    '其他'
]
const beforeUpload = (file: File) => {
  const isImg = file.type.startsWith('image/')
  if (!isImg) ElMessage.warning('只能上传图片')
  return isImg
}
const uploadProof = (field: keyof typeof ucForm) => {
  return async ({ file }: { file: File }) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const { data } = await axiosInstance.post('/activity/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (data === '500') return ElMessage.error('图片上传失败')
      ucForm[field] = data
      ElMessage.success('上传成功')
    } catch (e){
      ElMessage.error('上传失败')
      console.log("图片上传失败:",e)
    }
  }
}
</script>

<style scoped lang="scss">
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
.proof-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-top: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.main-container {
  display:grid;
  gap: 10px;
  grid-template-rows: auto 3fr;
}
.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.upload-placeholder {
  font-size: 14px;
  color: #909399;
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
  height: 930px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-rows: auto auto auto;
  gap: 10px;
}
.right-top {
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .top-content {
    display: flex;
    align-items: center;
    gap: 40px;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border: 2px solid #e0e0e0;
  }

  .gauge {
    width: 120px;
    height: 120px;
  }

  .greeting-section {
    text-align: center;

    .greeting-text {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }

    .greeting-subtext {
      font-size: 14px;
      color: #888;
    }
  }
}


.top-bottom{
  height: 80px;
  width: 100%;
  display: flex;
  border-radius: 8px;
  justify-content: flex-start;
  align-items: center;
}
.right-middle{
  height: 410px;
  width: 100%;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.right-bottom{
  height: 190px;
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
//排行榜样式
.ranking-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  height: 100%;
  overflow: auto;

  .ranking-list {
    list-style: none;
    padding: 0;
    margin: 0;

    .ranking-item {
      display: flex;
      align-items: center;
      padding: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #eee;

      .rank-num {
        width: 20px;
        font-weight: bold;
        color: #409EFF;
        margin-right: 12px;
      }

      .el-avatar {
        margin-right: 12px;
      }

      .user-area {
        flex: 1;
        color: #333;
        font-size: 14px;
      }

      .user-score {
        font-weight: bold;
        color: #67C23A;
      }
    }
  }
}
.recent-services {
  padding: 8px;
  color: #fff;

  .service-list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }

  .service-card {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 8px;
    width: 80px;
    text-align: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

    .service-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }

    .service-name {
      font-size: 14px;
      font-weight: 500;
    }
  }
}


::v-deep(.custom-avatar-popover) {
  padding: 8px 0;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  background-color: #fff;
}

.avatar-options {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 12px;

  .option-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    padding: 10px 12px;
    border-radius: 8px;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;

    .icon {
      font-size: 18px;
      transition: color 0.3s;

      &.info {
        color: #409EFF; // 蓝色
      }

      &.primary {
        color: #67C23A; // 绿色
      }

      &.danger {
        color: #F56C6C; // 红色
      }
    }

    &:hover {
      background-color: #f5f7fa;
    }

    &.logout:hover {
      background-color: #fef0f0;
    }
  }
}
.upload-box {
  width: 80px;
  height: 80px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f5f7fa;
  transition: border-color 0.3s;
}

.upload-box:hover {
  border-color: #409EFF;
}

.upload-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  font-size: 12px;
  color: #909399;
  text-align: center;
  line-height: 1.2;
}

</style>