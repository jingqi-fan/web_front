<template>
  <div class="input-wrapper">
    <div
        class="chat-result"
        ref="messageContainer"
        :style="{ maxHeight: maxMessageHeight }"
    >
      <div v-for="(msg, i) in messages" :key="i" class="message">
        <div v-if="msg.role === 'user'" class="user-message">
          🧑‍： {{ msg.content }}
        </div>
        <div v-else class="assistant-message">
          🤖： {{ msg.content }}
        </div>
      </div>
    </div>

    <el-input
        v-model="input"
        placeholder="有什么问题都可以问我！🤔"
        clearable
        class="message-input"
        type="textarea"
        :rows="3"
        show-word-limit
        :maxlength="6000"
        @keyup.enter="sendMessage"
        :style="{ border: 'none', backgroundColor: 'transparent', resize: 'none' }"
    />

    <el-row class="message-actions" type="flex" align="middle" justify="end">
      <el-button :icon="Delete" @click="clearContext" plain class="action-button"></el-button>
      <el-button
          type="primary"
          :icon="Promotion"
          @click="sendMessage"
          plain
          :disabled="!input.trim()"
          class="send-button"
      ></el-button>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Promotion, Delete } from "@element-plus/icons-vue";
import { ref, onMounted, watch, nextTick } from "vue";

const props = defineProps({
  messages: {
    type: Array,
    required: true
  },

  maxHeight: {
    type: String,
    default: "400px"
  }
});

const emit = defineEmits(['send', 'clear']);
const input = ref('');
const messageContainer = ref<HTMLElement | null>(null);
const maxMessageHeight = ref(props.maxHeight);

// 发送消息
const sendMessage = () => {
  if (!input.value.trim()) return;
  emit('send', input.value);
  input.value = '';
};

// 清除上下文
const clearContext = () => {
  emit('clear');
};


const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

watch(() => props.messages, () => {
  scrollToBottom();
}, { deep: true });

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 10px;
  width: 1000px;
}

.chat-result {
  order: 1;
  background: #f7f7f7;
  height: 375px;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  overflow-y: auto;
  max-height: v-bind(maxMessageHeight);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  margin-bottom: 0;
}

.user-message {
  color: #2c3e50;
  padding: 8px 12px;
  border-left: 3px solid #4ab7bd;
  background-color: #f0f9ff;
  border-radius: 0 8px 8px 8px;
  align-self: flex-end;
  max-width: 85%;
}

.assistant-message {
  color: #42b983;
  padding: 8px 12px;
  border-left: 3px solid #42b983;
  background-color: #f0fff7;
  border-radius: 8px 0 8px 8px;
  align-self: flex-start;
  max-width: 85%;
}

.message-input {
  order: 2;
}

.message-actions {
  order: 3;
  display: flex;
  justify-content: flex-end; /* 主要修改：右侧对齐 */
  align-items: center;
  margin-top: 10px;
  gap: 10px; /* 按钮间距 */
}

.action-button {
  background-color: #f5f5f5;
  border: 1px solid #dcdfe6;
}

.send-button {
  background-image: linear-gradient(to right, #6dd5ed, #2193b0);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
}

.send-button:hover {
  background-image: linear-gradient(to right, #6dd5ed, #2193b0);
  opacity: 0.8;
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
</style>