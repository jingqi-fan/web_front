<template>
  <div class="common-layout">
    <el-container>
      <el-header class="custom-header">
        <div class="title-left">
          <logo style="margin-left: 20px; cursor: pointer;" @click=" GoHome" />
        </div>

        <div class="credit-life-title">
          <div class="main-title">西湖分个人信用评分系统<div class="title-decoration"></div></div>
          <div class="subtitle">个人信用智能服务平台</div>
        </div>

        <div class="title-right">
          <el-button @click="goToTraining" class="custom-button">信用商业</el-button>
          <el-button @click="goToCreditLife" class="custom-button">信用生活</el-button>
          <el-button
              class="ai-button custom-button"
              :class="{ 'pulse': hasNewMessage, 'active': isActive }"
              @click="prosocialCenter"
              plain
              round
          >
            <span style="font-weight: bold; color: #409EFF;">亲社会活动</span>
          </el-button>
          <el-button class="custom-button" :icon="User" @click="goToUserCenter" plain round></el-button>
        </div>
      </el-header>

      <el-main class="main">

        <div class="message-container">
          <AiChat
              :messages="messages"
              @send="handleSendMessage"
              @clear="handleClearContext"
          />
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
import {ref, onBeforeUnmount, onMounted} from 'vue';
import { TopRight, User} from "@element-plus/icons-vue";
import router from "@/router/index.ts";
import {ElMessage} from "element-plus";
import AiChat from "@/views/welcome/components/AiChat.vue"; // 导入图标
import Logo from "@/views/personal/component/Logo.vue";
const hover = ref(false);
const isActive = ref(false);

// 消息数组
const messagesList = ref([
  '系统更新已完成！',
  '一站式AI助手-MCP服务 预发布',
  '微信小程序已发布（只读版），快来体验吧！'
]);
const currentIndex = ref(0); // 当前显示的消息索引
let intervalId: ReturnType<typeof setInterval> | null = null;


onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});

const startMessageRotation = () => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % messagesList.value.length;
  }, 3000);
};
startMessageRotation()
interface Message {
  role: string;
  content: string;
}
onMounted(() => {
  if (messages.value.length === 0) {
    messages.value.push({
      role: 'assistant',
      content: '欢迎使用 **西湖分信用平台** 🎉\n\n我是您的 AI 助手，有什么可以帮您？'
    });
  }
});
// 数据与状态
const selectedModel = ref('qwen-plus'); // 默认选择通义千问-plus
// 消息列表
const messages = ref<Message[]>([]);

// 处理发送消息
const handleSendMessage = (content: string) => {
  if (!content.trim()) return;

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: content.trim()
  });

  messages.value.push({
    role: 'assistant',
    content: ''
  });

  const index = messages.value.length - 1;
  getAIResponse(content, index);
};

const getAIResponse = (prompt: string, index: number) => {
  const source = new EventSource(`/api/chat/stream?prompt=${encodeURIComponent(prompt)}`);

  source.onmessage = (event) => {
    if (event.data === '[DONE]') {
      source.close();
    } else if (event.data.startsWith('[ERROR]')) {
      messages.value[index].content = `\n[错误] ${event.data.substring(8)}`;
      source.close();
    } else {
      messages.value[index].content += event.data;
    }
  };

  source.onerror = (e) => {
    console.error('SSE error:', e);
    messages.value[index].content += '\n[连接错误]';
    source.close();
  };
};

const handleClearContext = () => {
  fetch('/api/chat/clear', { method: 'POST' })
      .then(() => {
        messages.value = [];
      })
      .catch(e => {
        console.error('清除上下文失败:', e);
        ElMessage.error('清除上下文失败');
      });
};
// 前往信用商业
const goToTraining = () => {
  router.push('/creditbusiness');
};
// 数据中心
const goToCreditLife=()=>{
  router.push('/life')
};
// 应用中心
const goToAppCenter=()=>{
  ElMessage.info("正在开发中...")
};
// 消息通知
const prosocialCenter = () => {
  router.push('/prosocial_user')
};
const goToMessageDetail=(id:number)=>{
  // router.push($`message/{id}`)
  ElMessage.info("正在开发中...")
};
const goToUserCenter=()=>{
  router.push('/personal')
}
const GoHome = () => {
  router.push('/')
}
</script>

<style scoped>
.common-layout {
  display: flex;
  flex-direction: column;
  padding-top: 90px;
  height: 700px;
  overflow-y: hidden;
}

.custom-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 90px;
  z-index: 3000; /* 提高层级避免遮挡 */
  background-color: #f5f5f5;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 139, 0.5);
  border-radius: 8px;
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
.ai-button {
  position: relative;
  transition: all 0.3s ease;
  padding: 12px;
}
.ai-button svg {
  display: block;
}

.pulse::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  background-color: rgba(64, 158, 255, 0.3);
  animation: pulse 1.5s infinite;
  z-index: -1;
}

.active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background-color: rgba(64, 158, 255, 0.2);
  animation: ripple 0.6s ease-out;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
.logo {
  width: 50px;
  height: 50px;
  cursor: pointer;
}
.message-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.message-input textarea {
  height: 180px;
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
.custom-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 90px;
  z-index: 1000;
  background-color: #f5f5f5;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 139, 0.5);
  border-radius: 8px;
}

.title-left {
  display: flex;
  align-items: center;
  min-width: 300px;
}

.logo {
  width: 50px;
  height: 50px;
  cursor: pointer;
  margin-right: 20px;
}


.title-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.custom-button {
  background-image: linear-gradient(to right, #6dd5ed, #2193b0);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.custom-button:hover {
  background-image: linear-gradient(to right, #6dd5ed, #2193b0);
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.custom-button:active {
  transform: translateY(0);
}

.ai-button.custom-button {
  background-color: transparent;
  background-image: none;
  border: 1px solid #409EFF;
}

.ai-button.custom-button:hover {
  background-color: rgba(64, 158, 255, 0.1);
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes pulseGlow {
  0% {
    text-shadow: 0 0 6px rgba(26, 86, 219, 0.5);
  }
  50% {
    text-shadow: 0 0 12px rgba(26, 86, 219, 0.9);
  }
  100% {
    text-shadow: 0 0 6px rgba(26, 86, 219, 0.5);
  }
}
.credit-life-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeInDown 0.8s ease;
}

.main-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a56db;
  position: relative;
  letter-spacing: 1px;
  text-shadow: 0 4px 10px rgba(26, 86, 219, 0);
}

.title-decoration {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 3px;
  background: linear-gradient(90deg, #93c5fd, #3b82f6);
  border-radius: 2px;
  opacity: 0.9;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-top: 8px;
  font-weight: 500;
  letter-spacing: 1.2px;
  opacity: 0.85;
}

</style>
