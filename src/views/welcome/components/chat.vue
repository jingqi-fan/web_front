<template>
  <div class="chat-box">
    <el-input v-model="input" placeholder="请输入你的问题..." @keyup.enter="sendMessage" />
    <el-button @click="sendMessage" type="primary">发送</el-button>
    <el-button @click="clearContext" type="danger">清除上下文</el-button>

    <div class="chat-result">
      <div v-for="(msg, i) in messages" :key="i" class="message">
        <div v-if="msg.role === 'user'" class="user-message">
          🧑‍💬 {{ msg.content }}
        </div>
        <div v-else class="assistant-message">
          🤖 {{ msg.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  role: string;
  content: string;
}

const input = ref('');
const messages = ref<Message[]>([]);

const sendMessage = async () => {
  if (!input.value) return;

  const userMessage: Message = {
    role: 'user',
    content: input.value
  };

  // 添加用户消息到展示列表
  messages.value.push(userMessage);

  // 初始化AI消息占位符
  const assistantMessage: Message = {
    role: 'assistant',
    content: ''
  };
  messages.value.push(assistantMessage);

  const currentIndex = messages.value.length - 1;

  try {
    const source = new EventSource(
        `/api/chat/stream?prompt=${encodeURIComponent(input.value)}`
    );

    source.onmessage = (event) => {
      if (event.data === '[DONE]') {
        source.close();
      } else if (event.data.startsWith('[ERROR]')) {
        messages.value[currentIndex].content += `\n[错误] ${event.data.substring(8)}`;
        source.close();
      } else {
        // 实时更新AI回复
        messages.value[currentIndex].content += event.data;
      }
    };

    source.onerror = (e) => {
      console.error('SSE error:', e);
      messages.value[currentIndex].content += '\n[连接错误]';
      source.close();
    };

  } catch (e) {
    messages.value[currentIndex].content = `[系统错误]: ${e.message}`;
  }

  input.value = '';
};

const clearContext = async () => {
  try {
    // 调用后端清除上下文接口
    await fetch('/api/chat/clear', { method: 'POST' });

    // 清除前端消息历史
    messages.value = [];

    console.log('上下文已清除');
  } catch (e) {
    console.error('清除上下文失败:', e);
  }
};
</script>

<style scoped>
.chat-box {
  padding: 20px;
}
.chat-result {
  margin-top: 15px;
  background: #f7f7f7;
  padding: 10px;
  border-radius: 5px;
  max-height: 500px;
  overflow-y: auto;
}
.message {
  margin-bottom: 10px;
}
.user-message {
  color: #2c3e50;
  padding: 8px;
  border-left: 3px solid #4ab7bd;
}
.assistant-message {
  color: #42b983;
  padding: 8px;
  border-left: 3px solid #42b983;
}
</style>