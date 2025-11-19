<template>
  <div class="common-layout">
    <el-container>
      <el-main class="main">
        <div class="message-container">
          <AiChat
              :messages="messages"
              @send="handleSendMessage"
              @clear="handleClearContext"
          />
        </div>

<!--        &lt;!&ndash; 🩺 推荐科室 & 医生选择面板 &ndash;&gt;-->
<!--        <div-->
<!--            v-if="showDoctorPanel && recommendDept && doctors.length"-->
<!--            class="doctor-panel"-->
<!--        >-->
<!--          <div class="doctor-panel-header">-->
<!--            <div class="doctor-panel-title">-->
<!--              推荐科室：<span class="dept-name">{{ recommendDept }}</span>-->
<!--            </div>-->
<!--            <div class="doctor-panel-subtitle">-->
<!--              已根据您的症状为您推荐以下出诊医生，请选择其一进行挂号：-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="doctor-list">-->
<!--            <el-card-->
<!--                v-for="doctor in doctors"-->
<!--                :key="doctor.id"-->
<!--                class="doctor-card"-->
<!--                shadow="hover"-->
<!--            >-->
<!--              <div class="doctor-main">-->
<!--                <div class="doctor-name-line">-->
<!--                  <span class="doctor-name">{{ doctor.name }}</span>-->
<!--                  <span class="doctor-title">{{ doctor.title }}</span>-->
<!--                </div>-->
<!--                <div class="doctor-goodat" v-if="doctor.goodAt">-->
<!--                  擅长：{{ doctor.goodAt }}-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="doctor-slots" v-if="doctor.timeSlots && doctor.timeSlots.length">-->
<!--                <div class="slots-label">可约时间：</div>-->
<!--                <div class="slots-buttons">-->
<!--                  <el-button-->
<!--                      v-for="slot in doctor.timeSlots"-->
<!--                      :key="slot"-->
<!--                      size="small"-->
<!--                      class="slot-button"-->
<!--                      @click="handleDoctorSelect(doctor, slot)"-->
<!--                  >-->
<!--                    {{ slot }}-->
<!--                  </el-button>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div v-else class="no-slot">当前暂无可预约时间</div>-->
<!--            </el-card>-->
<!--          </div>-->

<!--          <div class="doctor-panel-footer">-->
<!--            <el-button-->
<!--                size="small"-->
<!--                plain-->
<!--                @click="showDoctorPanel = false"-->
<!--            >-->
<!--              暂不选择，继续咨询-->
<!--            </el-button>-->
<!--          </div>-->
<!--        </div>-->
<!--        &lt;!&ndash; 🩺 推荐科室 & 医生选择面板 END &ndash;&gt;-->

      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue';
import router from "@/router/index.ts";
import { ElMessage } from "element-plus";
import AiChat from "@/views/welcome/components/AiChat.vue"; // 导入图标

const hover = ref(false);
const isActive = ref(false);

// 消息数组（顶部滚动公告）
const messagesList = ref([
  '系统更新已完成！',
  '一站式AI助手-MCP服务 预发布',
  '微信小程序已发布（只读版），快来体验吧！'
]);
const currentIndex = ref(0); // 当前显示的消息索引
let intervalId: ReturnType<typeof setInterval> | null = null;

const goToCreditMan = () => {
  router.push('/manageHouse');
};

const goToHospital = () => {
  router.push('/life/hospital');
};

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});

const startMessageRotation = () => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % messagesList.value.length;
  }, 3000);
};
startMessageRotation();

// ==== 聊天相关 ====
interface Message {
  role: string;
  content: string;
}

const messages = ref<Message[]>([]);

// 🩺 AI 推荐结果：科室 + 医生列表
interface Doctor {
  id: string;
  name: string;
  title: string;
  goodAt?: string;
  timeSlots: string[];
}

const recommendDept = ref<string | null>(null);
const doctors = ref<Doctor[]>([]);
const showDoctorPanel = ref(false);

onMounted(() => {
  if (messages.value.length === 0) {
    messages.value.push({
      role: 'assistant',
      content:
          '欢迎使用 **第21人民医院智能平台** 🎉\n\n' +
          '我是您的 AI 导诊助手，我会通过几个问题了解您的情况，帮您推荐科室和医生，并协助完成挂号。'
    });
  }
});

// 数据与状态
const selectedModel = ref('qwen-plus'); // 默认选择通义千问-plus

// // 处理发送消息
// const handleSendMessage = (content: string) => {
//   if (!content.trim()) return;
//
//   // 添加用户消息
//   messages.value.push({
//     role: 'user',
//     content: content.trim()
//   });
//
//   // 关闭医生推荐面板（防止用户已经选过一次，再继续聊）
//   showDoctorPanel.value = false;
//
//   messages.value.push({
//     role: 'assistant',
//     content: ''
//   });
//
//   const index = messages.value.length - 1;
//   getAIResponse(content, index);
// };
const handleSendMessage = (content: string) => {
  const text = content.trim();
  if (!text) return;

  // 1. 先往聊天里插入用户消息（无论走哪条路线，这一步都是需要的）
  messages.value.push({
    role: 'user',
    content: text
  });

  // 2. 用户一发新消息，就先把医生推荐面板关掉
  showDoctorPanel.value = false;

  // 3. 判断是不是“挂号意图”
  if (isRegisterIntent(text)) {
    // ✅ 走 ToolCalling 挂号接口，不再走 SSE 聊天
    callRegisterByTool(text);
    return;
  }

  // 4. 否则，走原来的 SSE 普通对话逻辑
  messages.value.push({
    role: 'assistant',
    content: ''
  });

  const index = messages.value.length - 1;
  getAIResponse(text, index);
};

// ✅ 调用 ToolCalling 挂号接口
// const callRegisterByTool = async (prompt: string) => {
//   if (!prompt.trim()) return;
//
//   // 1. 聊天里先插入一条“用户确认挂号”的消息
//   messages.value.push({
//     role: 'user',
//     content: prompt.trim()
//   });
//
//   // 2. 再插入一条占位的 assistant 消息：显示“正在为您挂号…”
//   messages.value.push({
//     role: 'assistant',
//     content: '已收到您的挂号请求，正在为您智能完成挂号，请稍候...'
//   });
//   const index = messages.value.length - 1;
//
//   try {
//     const res = await fetch(
//         `/api/chatOrder/tool/register?prompt=${encodeURIComponent(prompt)}`,
//         {
//           method: 'POST',
//           // 如果你的前后端是不同域名，还需要加上这一行，让 cookie / session 带上：
//           // credentials: 'include',
//         }
//     );
//
//     if (!res.ok) {
//       messages.value[index].content = `挂号失败：${res.status} ${res.statusText}`;
//       return;
//     }
//
//     const text = await res.text();
//     // 用后端返回的自然语言结果覆盖占位内容
//     messages.value[index].content = text || '挂号完成，但未收到详细说明。';
//   } catch (e) {
//     console.error('调用挂号接口异常', e);
//     messages.value[index].content = '挂号过程出现异常，请稍后重试或改为人工挂号。';
//   }
// };

// ✅ 调用 ToolCalling 挂号接口（纯对话版）
// 注意：用户消息已经在 handleSendMessage 里插入，这里不再 push 用户消息
const callRegisterByTool = async (prompt: string) => {
  const text = prompt.trim();
  if (!text) return;

  // 插入一条占位 assistant 消息
  messages.value.push({
    role: 'assistant',
    content: '已收到您的挂号请求，正在为您智能完成挂号，请稍候...'
  });
  const index = messages.value.length - 1;

  try {
    const res = await fetch(
        `/api/chatOrder/tool/register?prompt=${encodeURIComponent(text)}`,
        {
          method: 'POST',
          // 如果有跨域/session 的需求，这里可以加：
          // credentials: 'include',
        }
    );

    if (!res.ok) {
      messages.value[index].content = `挂号失败：${res.status} ${res.statusText}`;
      return;
    }

    const reply = await res.text();
    messages.value[index].content = reply || '挂号完成，但未收到详细说明。';
  } catch (e) {
    console.error('调用挂号接口异常', e);
    messages.value[index].content = '挂号过程出现异常，请稍后重试或改为人工挂号。';
  }
};

// // 🔍 简单的“挂号意图”识别：你可以按需要再优化
// const isRegisterIntent = (text: string): boolean => {
//   // 去掉空格
//   const t = text.replace(/\s+/g, '');
//
//   // 包含“挂号”两个字
//   if (t.includes('挂号')) return true;
//
//   // 例如“挂郑浩医生2025年11月19日09:30-10:00的号”
//   if (t.includes('挂') && t.includes('号') && t.includes('医生')) return true;
//
//   // 包含“预约 + 医生”
//   if (t.includes('预约') && t.includes('医生')) return true;
//
//   // 你可以再加其他规则...
//   return false;
// };
const isRegisterIntent = (text: string): boolean => {
  const t = text.replace(/\s+/g, '');

  // 1. 必须包含“挂”或“挂号”
  if (!t.includes('挂')) return false;

  // 2. 必须有“医生”两个字
  if (!t.includes('医生')) return false;

  // 3. 必须包含一个日期（简单用 yyyy-MM-dd 检测）
  const hasDate = /\d{4}-\d{2}-\d{2}/.test(text);
  if (!hasDate) return false;

  return true;
};


const getAIResponse = (prompt: string, index: number) => {
  const source = new EventSource(
      `/api/chatOrder/stream?prompt=${encodeURIComponent(prompt)}`
  );

  source.onmessage = (event) => {
    // 后端结束标记
    if (event.data === '[DONE]') {
      source.close();
      return;
    }

    // 错误信息
    if (event.data.startsWith('[ERROR]')) {
      messages.value[index].content = `\n[错误] ${event.data.substring(8)}`;
      source.close();
      return;
    }

    // 🩺 医生推荐的特殊标记：
    // 后端约定格式：
    // data: [DOCTOR_RECOMMEND]{"department":"呼吸内科","doctors":[{...}]}
    if (event.data.startsWith('[DOCTOR_RECOMMEND]')) {
      try {
        const jsonStr = event.data.substring('[DOCTOR_RECOMMEND]'.length);
        const payload = JSON.parse(jsonStr);
        recommendDept.value = payload.department || null;
        doctors.value = payload.doctors || [];
        if (recommendDept.value && doctors.value.length > 0) {
          showDoctorPanel.value = true;
        }
      } catch (e) {
        console.error('解析医生推荐数据失败：', e);
      }
      // 这一类消息不拼到对话文本里，直接 return
      return;
    }

    // 其余正常内容，拼接到当前 assistant 消息
    messages.value[index].content += event.data;
  };

  source.onerror = (e) => {
    console.error('SSE error:', e);
    messages.value[index].content += '\n[连接错误]';
    source.close();
  };
};

// 🩺 用户在面板中选择医生 + 时间段
const handleDoctorSelect = (doctor: Doctor, slot: string) => {
  if (!recommendDept.value) return;

  // 关闭面板
  showDoctorPanel.value = false;

  // 构造一条“选择意图”的自然语言消息，让后端大模型 & ToolCalling 去完成挂号
  const text = `我选择「${recommendDept.value}」的 ${doctor.name}（${doctor.title}），时间段：${slot}。请直接为我完成挂号。`;

  // 复用现有的聊天发送流程
  // handleSendMessage(text);
  // ✅ 改为调用 ToolCalling 挂号接口
  callRegisterByTool(text);
};

const handleClearContext = () => {
  fetch('/api/chatOrder/clear', { method: 'POST' })
      .then(() => {
        messages.value = [];
        recommendDept.value = null;
        doctors.value = [];
        showDoctorPanel.value = false;
      })
      .catch((e) => {
        console.error('清除上下文失败:', e);
        ElMessage.error('清除上下文失败');
      });
};

// 前往信用商业
const goToTraining = () => {
  router.push('/creditbusiness');
};
// 数据中心
const goToCreditLife = () => {
  router.push('/life');
};
// 应用中心
const goToAppCenter = () => {
  ElMessage.info("正在开发中...");
};
// 消息通知
const prosocialCenter = () => {
  router.push('/prosocial_user');
};
const goToMessageDetail = (id: number) => {
  // router.push($`message/{id}`)
  ElMessage.info("正在开发中...");
};
const goToUserCenter = () => {
  router.push('/personal');
};
const GoHome = () => {
  router.push('/');
};
</script>

<style scoped>
.common-layout {
  display: flex;
  flex-direction: column;
  padding-top: 40px;
  height: 700px;
  overflow-y: hidden;
}

.message-container {
  margin-top: -30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 🩺 医生推荐面板样式 */
.doctor-panel {
  margin: 20px auto 0;
  max-width: 900px;
  background: #f9fafb;
  border-radius: 16px;
  padding: 16px 20px 12px;
  box-shadow: 0 8px 20px rgba(16, 94, 63, 0.12);
  border: 1px solid rgba(16, 94, 63, 0.15);
}

.doctor-panel-header {
  margin-bottom: 8px;
}

.doctor-panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.dept-name {
  color: #059669;
}

.doctor-panel-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.doctor-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
  margin-top: 10px;
}

.doctor-card {
  border-radius: 12px;
}

.doctor-main {
  margin-bottom: 8px;
}

.doctor-name-line {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.doctor-name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.doctor-title {
  font-size: 13px;
  color: #059669;
}

.doctor-goodat {
  font-size: 12px;
  color: #4b5563;
  margin-top: 4px;
}

.doctor-slots {
  margin-top: 6px;
}

.slots-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.slots-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.slot-button {
  border-radius: 999px;
}

.no-slot {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 6px;
}

.doctor-panel-footer {
  margin-top: 10px;
  text-align: right;
}

/* 原有样式保持不动，下略，只保留你已有的 */

.custom-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 90px;
  z-index: 3000;
  background-color: #f7faf9;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(16, 94, 63, 0.25);
  border-radius: 8px;
}

.send-button-container .el-button {
  background-image: linear-gradient(to right, #2ecf91, #105e3f);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
}
.send-button-container .el-button:hover {
  background-image: linear-gradient(to right, #2ecf91, #105e3f);
  opacity: 0.85;
}

/* 其他样式和你之前的一样，这里不重复粘贴，可以保留原文件内容 */
</style>
