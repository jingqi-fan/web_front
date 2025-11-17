<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="system-title">医院统一检查系统</div>

      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px" status-icon>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="loginForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
              clearable
          />
        </el-form-item>

        <div class="login-actions">
          <el-button @click="goBack">返回</el-button>
          <el-button type="success" @click="submitLogin">登录</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import {doctorLogin} from "@/api/life/hospital_api.ts";
import router from "@/router";
import {useDoctorIdStore} from "@/stores/useDoctorIdStore.ts";


const loginForm = ref({
  phone: '',
  password: '',
})

const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const loginFormRef = ref<FormInstance>()

const submitLogin =async  () => {
  if (!loginFormRef.value) return
  const res=await doctorLogin(loginForm.value.phone, loginForm.value.password)
  const doctorIdStore=useDoctorIdStore()
  doctorIdStore.setDoctor(res.doctorId)
  ElMessage.success(res?res:'登录成功')
  await router.push('/doctor/check')
}

const goBack = () => {
  router.push('/home')
}
</script>

<style scoped lang="scss">
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e0f7fa, #f1f8e9);
  animation: fadeIn 0.6s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.login-card {
  width: 420px;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  background: #ffffff;

  .system-title {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 30px;
    color: #409EFF;
    letter-spacing: 1px;
  }

  .login-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }
}
</style>