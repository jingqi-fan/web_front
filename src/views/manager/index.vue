<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <h2 class="login-title">管理员登录</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item label="验证码" prop="captchaInput">
          <div class="captcha-row">
            <el-input
                v-model="form.captchaInput"
                placeholder="请输入验证码"
                style="flex: 1; margin-right: 10px"
                maxlength="4"
            />
            <canvas
                ref="canvasRef"
                width="100"
                height="40"
                class="captcha-canvas"
                @click="generateCaptcha"
                title="点击刷新验证码"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="info" @click="back">返回</el-button>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import router from '@/router'
import {AdminLogin, getUserInfo, login} from "@/api/user.ts";
import {MessagePlugin} from "tdesign-vue-next";
import {useDeviceStore} from "@/stores/useDeviceStore.ts";
import {useTokenStore} from "@/stores";

const formRef = ref<FormInstance>()
const form = ref({
  username: '',
  password: '',
  captchaInput: ''
})

// 当前验证码值
const captchaText = ref('')
const canvasRef = ref<HTMLCanvasElement | null>(null)

const back = () => {
  router.push('/')
}

const generateCaptcha = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 生成验证码文本
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  captchaText.value = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')

  // 背景
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 添加干扰线
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgb(${rand(100, 255)},${rand(100, 255)},${rand(100, 255)})`
    ctx.beginPath()
    ctx.moveTo(rand(0, canvas.width), rand(0, canvas.height))
    ctx.lineTo(rand(0, canvas.width), rand(0, canvas.height))
    ctx.stroke()
  }

  // 绘制验证码字符
  for (let i = 0; i < 4; i++) {
    ctx.font = `${rand(20, 28)}px Arial`
    ctx.fillStyle = `rgb(${rand(0, 100)},${rand(0, 100)},${rand(0, 100)})`
    ctx.fillText(captchaText.value[i], 20 * i + 5, rand(25, 35))
  }
}

const rand = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)

onMounted(() => {
  generateCaptcha()
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captchaInput: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}
const deviceStore=useDeviceStore()
const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    if (form.value.captchaInput.toUpperCase() !== captchaText.value.toUpperCase()) {
      ElMessage.error('验证码不正确')
      generateCaptcha()
      form.value.captchaInput = ''
      return
    }

    try {
      const res = await AdminLogin({
        username: form.value.username,
        password: form.value.password,
        device: deviceStore.device === '' ? deviceId.value : deviceStore.device
      })

      if (res.status === "SUCCESS") {
        await MessagePlugin.success("登录成功!");
        await getText()
        await router.push('/manager/dataCenter')
      } else {
        await MessagePlugin.error(res.message)
        generateCaptcha()  // 登录失败也刷新验证码
        form.value.captchaInput = ''
      }
    } catch (error) {
      console.error("登录过程中发生错误:", error)
      await MessagePlugin.error("登录失败，请重试")
      generateCaptcha()
    }
  })
}

const getText = async () => {
  try {
    const tokenStore = useTokenStore();
    await getUserInfo(tokenStore.token.userId);
  } catch (error) {
    console.error('获取用户信息失败', error);
    ElMessage.error('用户信息加载失败');
  }
};
</script>

<style scoped lang="scss">
.login-container {
  position: fixed;
  inset: 0;
  background: linear-gradient(to right, #74ebd5, #acb6e5);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-card {
  width: 400px;
  padding: 30px;
  border-radius: 12px;
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.captcha-row {
  display: flex;
  align-items: center;
}

.captcha-canvas {
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
