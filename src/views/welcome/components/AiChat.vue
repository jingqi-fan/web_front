<template>
  <div class="chat-wrapper">
    <!-- 消息滚动容器 -->
    <div class="chat-content" ref="chatRef">
      <div v-for="(msg, i) in messages" :key="i" :class="['chat-item', msg.role]">
        <div class="chat-bubble" v-if="msg.role === 'user'">
          🧑‍：{{ msg.content }}
        </div>
        <div class="chat-bubble assistant" v-else v-html="renderMarkdown(msg.content)"></div>
      </div>
    </div>

    <!-- 固定输入框区域 -->
    <div class="chat-input">
      <el-input
          type="textarea"
          :rows="2"
          v-model="input"
          placeholder="有什么问题都可以问我！"
          @keydown.enter.exact.prevent="emitSend"
          @keydown.enter.shift.stop
          clearable
      />

      <el-button type="primary" @click="emitSend">发送</el-button>
      <el-button type="danger" @click="$emit('clear')">清除上下文</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

interface Message {
  role: string
  content: string
}

const props = defineProps<{
  messages: Message[]
}>()

const emit = defineEmits<{
  (e: 'send', content: string): void
  (e: 'clear'): void
}>()

const input = ref('')
const chatRef = ref<HTMLElement | null>(null)

const emitSend = () => {
  if (!input.value.trim()) return
  emit('send', input.value.trim())
  input.value = ''
}

const renderMarkdown = (content: string) => {
  const rawHtml = marked.parse(content)
  return DOMPurify.sanitize(rawHtml)
}

watch(
    () => props.messages,
    async () => {
      await nextTick()
      if (!chatRef.value) return
      chatRef.value.scrollTop = chatRef.value.scrollHeight
    },
    { deep: true }
)

</script>


<style scoped>
.chat-wrapper {
  width: 1200px;
  height: 600px;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
  border-radius: 12px;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.05);
  padding: 20px;
  box-sizing: border-box;
}
.chat-input .el-button {
  border-radius: 20px;
  padding: 8px 20px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.chat-input .el-button.el-button--primary {
  background-image: linear-gradient(to right, #6dd5ed, #2193b0);
  color: white;
  border: none;
}

.chat-input .el-button.el-button--primary:hover {
  opacity: 0.9;
}

.chat-input .el-button.el-button--danger {
  background-color: #f56c6c;
  color: white;
  border: none;
}

.chat-input .el-button.el-button--danger:hover {
  background-color: #dd6161;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  padding-right: 4px;
}

/* 聊天条目样式 */
.chat-item {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.chat-item.user {
  align-items: flex-end;
}

.chat-item.assistant {
  align-items: flex-start;
}

.chat-bubble {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #d1ecf1;
  word-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: 15px;
}

.chat-bubble.assistant {
  background-color: #f4f6f9;
  color: #222;
}


.chat-bubble :deep(pre) {
  background: #272822;
  color: #f8f8f2;
  padding: 10px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
}

.chat-bubble :deep(code) {
  background-color: #eef;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Courier New', monospace;
}

.chat-bubble :deep(a) {
  color: #409eff;
  text-decoration: underline;
}

.chat-input {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>

