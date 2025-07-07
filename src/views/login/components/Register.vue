<template>
  <t-form
      ref="form"
      class="item-container"
      :data="formData"
      :rules="FORM_RULES"
      label-width="0"
      @submit="onSubmit"
  >
    <t-form-item name="phone">
      <t-input
          v-model="formData.username"
          :maxlength="11"
          size="large"
          placeholder="请输入您的用户名（不能重名）"
      >
        <template #prefix-icon>
          <t-icon name="user" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item name="password">
      <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          placeholder="请输入登录密码"
      >
        <template #prefix-icon>
          <t-icon name="lock-on" />
        </template>
        <template #suffix-icon>
          <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>


    <t-form-item class="check-container" name="checked">
      <t-checkbox v-model="formData.checked">我已阅读并同意 </t-checkbox>
      <span> 西湖分 服务协议</span> 和
      <span>隐私声明</span>
    </t-form-item>

    <t-form-item>
      <t-button block size="large" type="submit"> 注册 </t-button>
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MessagePlugin, FormRule } from 'tdesign-vue-next';
import { useTimerStore } from "@/stores/useTimerStore.ts";
import {register} from "@/api/user.ts";

const INITIAL_DATA = {
  username: '',
  password: '',
  checked: false
};

const FORM_RULES: Record<string, FormRule[]> = {
  username: [
    { required: true, message: '请输入手机号', type: 'error' },
    { min: 2, message: '用户名长度至少2位', type: 'error' }
  ],
  password: [
    { required: true, message: '请输入密码', type: 'error' },
    { min: 6, message: '密码长度至少6位', type: 'error' }
  ],
  checked: [
    { validator: (value) => value, message: '请同意服务协议和隐私声明', type: 'error' }
  ]
};

const form = ref();
const formData = ref({ ...INITIAL_DATA });
const showPsw = ref(false);
const counter = useTimerStore();

function isPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

const sendSmsVerifyCode = async () => {
  if (!formData.value.phone) {
    await MessagePlugin.error('请输入手机号');
    return;
  }

  if (!isPhone(formData.value.phone)) {
    await MessagePlugin.error('请输入正确的手机号');
    return;
  }

  counter.startTimer();
  try {
    await sendSms(formData.value.phone);
    await MessagePlugin.success('验证码已发送');
  } catch (e) {
    console.log(e);
    await MessagePlugin.error("验证码发送失败");
  }
};

const registerByPhoneAsync = async () => {
  try {
    const res=await register({
      username: formData.value.username,
      password: formData.value.password
    })
    if(res.status==='SUCCESS'){
      emit('registerSuccess');
    }
  } catch (e) {
    console.error("注册失败:", e);
  }
};

const emit = defineEmits(['registerSuccess']);

const onSubmit = ({ validateResult }) => {
  if (validateResult === true) {
    if (!formData.value.checked) {
      MessagePlugin.error("请同意 <西湖分> 服务协议和隐私声明");
      return;
    }
    registerByPhoneAsync();
  }
};
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>