<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <el-row align="middle" class="header-content">
          <el-col :span="4" class="model-select-container">
            <!-- 图标 -->
            <model-icon class="logo" @click="GoHome"/>
            <!-- 大模型选择框 -->
            <el-select size="small" no-data-text="数据加载失败" effect="light" v-model="selectedModel" class="model-select" default-first-option>
              <el-option label="ChatGPT-4o" value="modelA" />
              <el-option label="ChatGPT-3 mini" value="modelB" />
              <el-option label="ChatGPT-4 plus" value="modelC" />
            </el-select>
          </el-col>

          <el-col :span="18" class="header-buttons">
            <!-- 按钮部分 -->
            <el-button type="text" icon="el-icon-bell" @click="goToAppCenter">信用商业</el-button>
            <el-button type="text" icon="el-icon-grid" @click="goToDataCenter">信用生活</el-button>
            <el-button style="margin-left: 10px;background-color: #f5f5f5" :icon="ChatDotRound" @click="goToMessageCenter" plain round></el-button>
            <el-button style="background-color: #f5f5f5" :icon="User" @click="goToUserCenter"  plain round></el-button>
          </el-col>
        </el-row>
      </el-header>

      <el-main class="main">
        <div class="welcome-message">
          <h2>欢迎使用“西湖分”个人信用平台!</h2>
        </div>
        <div class="message-container">
          <div class="input-wrapper">
            <el-input
                v-model="messageInput"
                placeholder="输入你想查询的问题..."
                clearable
                @input="handleMessageInput"
                class="message-input"
                type="textarea"
                :rows="6"
                show-word-limit
                :maxlength="6000"
                :style="{ border: 'none', backgroundColor: 'transparent',resize: 'none'  }"
            />
            <el-row class="message-actions" type="flex" justify="space-between" align="middle">
              <el-col :span="8">
                <!-- 文件上传按钮 TODO: 添加action="/upload",完成事件触发 -->
                <el-upload
                    class="upload-button"
                    :auto-upload="false"
                    :show-file-list="false"
                >
                  <el-button :icon="UploadFilled" @click="UploadFile"></el-button>
                </el-upload>
              </el-col>
              <el-col :span="8" class="send-button-container">
                <el-button type="info" :icon="Promotion" @click="handleSendMessage" plain></el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="card-row">
          <el-row :gutter="70" class="card-row">
            <el-col :span="12">
              <el-card class="card training">
                <div class="card-icon">
                  <div ref="modelTrainContainer" class="lottie-container"></div>
                </div>
                <h3 class="card-title">信用生活</h3>
                <p class="card-description">
                  停车、借书、就医一码通
                </p>
                <div class="card-actions">
                  <el-button :icon="Right"  type="text" @click="goToTraining">立即前往</el-button>
                  <el-button :icon="Link" type="text" @click="goToModelDoc">帮助文档</el-button>
                </div>
              </el-card>
            </el-col>

            <el-col :span="12">
              <el-card class="card square">
                <div class="card-icon">
                  <div ref="modelSquareContainer" class="lottie-container"></div>
                </div>
                <h3 class="card-title">信用商业</h3>
                <p class="card-description">
                  酒店、租房、购物，舒心乐享
                </p>
                <div class="card-actions">
                  <el-button :icon="Right" type="text" @click="goToModelSquare">立即前往</el-button>
                  <el-button :icon="Link"  type="text" @click="goToModelSquareDocument">帮助文档</el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <!-- 文字显示框 -->
        <div class="carousel-text">
          <div class="text-display" v-for="(message, index) in messagesList" :key="index" v-show="currentIndex === index">
            {{ message }}
            <el-button size="small" :icon="TopRight" type="primary" @click="goToMessageDetail(index)" plain round>查看详情</el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from 'vue';
import lottie from 'lottie-web';
import {ChatDotRound, Link, Promotion, Right, TopRight, UploadFilled, User} from "@element-plus/icons-vue";
import ModelIcon from '@/assets/ModelCenter.svg';
import router from "@/router/index.ts";
import {ElMessage} from "element-plus"; // 导入图标

// 数据与状态
const selectedModel = ref('modelA'); // 当前选择的大模型
const messageInput = ref(''); // 消息输入框内容
const isMessageProcessed = ref(false); // 是否在处理中
const messages = ref<string[]>([]); // 用户收到的信息

// 动画容器
const modelTrainContainer = ref(null);
const modelSquareContainer = ref(null);

const UploadFile=()=>{
  ElMessage.info("该功能暂不可用")
}

// 消息数组
const messagesList = ref([
  '收到新的消息：系统更新已完成！',
  '系统检测到新的训练任务开始执行。',
  '注意：明天将进行一次维护更新。'
]);
const currentIndex = ref(0); // 当前显示的消息索引
let intervalId: ReturnType<typeof setInterval> | null = null;
// 动画加载
onMounted(() => {
  lottie.loadAnimation({
    container: modelTrainContainer.value!,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: new URL('@/assets/model-train-card.json', import.meta.url).href,
  });

  lottie.loadAnimation({
    container: modelSquareContainer.value!,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: new URL('@/assets/model-square-card.json', import.meta.url).href,
  });
  startMessageRotation();
});


// 在组件卸载前清除定时器
onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});

// 启动消息定时轮换
const startMessageRotation = () => {
  intervalId = setInterval(() => {
    // 更新 currentIndex, 当到达消息数组末尾时回到第一条
    currentIndex.value = (currentIndex.value + 1) % messagesList.value.length;
  }, 3000); // 每3秒更新一次消息
};

const handleSendMessage = ()=>{
  ElMessage.info("正在开发中...")
}



// 消息处理
const handleMessageInput = () => {
  if (messageInput.value.trim()) {
    isMessageProcessed.value = true;
    setTimeout(() => {
      isMessageProcessed.value = false;
      messages.value.push(messageInput.value); // 处理完后，保存消息
      messageInput.value = ''; // 清空输入框
    }, 3000); // 模拟AI消息处理
  }
};
// 前往模型训练中心
const goToTraining = () => {
  router.push('/creditbusiness');
};
// 前往模型训练帮助文档
const goToModelDoc = () => {
  ElMessage.info("正在开发中...")
};
// 前往模型广场
const goToModelSquare = () => {
  ElMessage.info("正在开发中...")
};
// 模型广场帮助文档
const goToModelSquareDocument = () => {
  ElMessage.info("正在开发中...")
};
// 数据中心
const goToDataCenter=()=>{
  //router.push('/data')
  ElMessage.info("正在开发中...")
};
// 应用中心
const goToAppCenter=()=>{
  ElMessage.info("正在开发中...")
};
// 消息通知
const goToMessageCenter=()=>{
  ElMessage.info("正在开发中...")
};
// 特定消息通知
const goToMessageDetail=(id:number)=>{
  // router.push($`message/{id}`)
  ElMessage.info("正在开发中...")
};
//个人中心
const goToUserCenter=()=>{
  router.push('/personal')
}
// 回到首页
const GoHome = () => {
  router.push('/')
}
</script>

<style scoped>
.common-layout {
  display: flex;
  flex-direction: column;
  height: 800px;
  overflow-y: hidden;
  margin: -8px -8px auto;
}

.send-button-container .el-button {
  background-image: linear-gradient(to right, #6dd5ed, #2193b0);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
}
.send-button-container .el-button:hover {
  background-image: linear-gradient(to right, #6dd5ed, #2193b0);
  opacity: 0.8;
}


.header {
  height: 70px;
  background-color: #f5f5f5;
  border-radius: 8px;
}


.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 69px;
}

.logo {
  width: 50px;
  height: 50px;
  cursor: pointer;
}
.model-select {
  background-color: #f5f5f5;
  width: 150px;
}

.header-buttons {
  display: flex;
  justify-content: flex-end;
}

.message-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.input-wrapper {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 10px;
  width: 1000px;
}

.message-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.upload-button {
  display: flex;
  align-items: center;
}

.send-button-container {
  display: flex;
  justify-content: flex-end;
}
.message-input {
  width: 100%;
  margin-right: 10px;
  height: 90px;
  overflow-y: clip;
  background-color: #FFFFFF;
}
.message-input textarea {
  height: 180px;
}
.card-row {
  padding: 20px;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.card {
  text-align: center;
  padding: 20px;
  width: 440px;
  height: 272px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.card-icon {
  height: 120px;
  margin-bottom: 10px;
}
.lottie-container {
  width: 100px;
  height: 100px;
  margin: 0 auto;
}
.card-title {
  font-size: 20px;
  font-weight: bold;
}
.card-description {
  font-size: 14px;
  color: #606266;
}
.card-actions {
  display: flex;
  justify-content: space-around;
}
.carousel-text {
  margin-top: 20px;
  text-align: center;
  height: 50px;
  overflow: hidden;
}
.text-display {
  height: 100%;
  line-height: 50px;
  border: none;
}
.welcome-message {
  text-align: center;
}

.card.training {
  background: linear-gradient(to bottom, #E6D6F5, #FCFAFF);
}
.card.square {
  background: linear-gradient(to bottom, #BFE7FF, #FCFAFF);
}
.model-select-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
