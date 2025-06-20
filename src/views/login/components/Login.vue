<template>
  <t-form
      ref="form"
      :class="['item-container', `login-${type}`]"
      :data="UserNameForm"
      :rules="FORM_RULES"
      label-width="0"
  >
    <template v-if="type == 'password'">
      <t-form-item name="account">
        <t-input v-model="UserNameForm.name" size="large" placeholder="请输入账号：admin">
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>
      <t-form-item name="password">
        <t-input
            v-model="UserNameForm.password"
            size="large"
            :type="showPsw ? 'text' : 'password'"
            clearable
            placeholder="请输入登录密码：admin"
        >
          <template #prefix-icon>
            <t-icon name="lock-on" />
          </template>
          <template #suffix-icon>
            <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
          </template>
        </t-input>
      </t-form-item>

      <div class="check-container remember-pwd">
        <t-checkbox>记住账号</t-checkbox>
        <span class="tip">忘记账号？</span>
      </div>
    </template>

    <!-- 扫码登陆 -->
    <template v-else-if="type == 'qrcode'">
      <div class="tip-container">
        <span class="tip">请使用微信扫一扫登录</span>
        <span class="refresh">刷新 <t-icon name="refresh" /> </span>
      </div>
      <qrcode-vue value="" :size="192" level="H" />
    </template>

    <!-- 手机号登陆 -->
    <template v-else>
      <t-form-item name="phone">
        <t-input v-model="PhoneForm.phone" size="large" placeholder="请输入手机号码">
          <template #prefix-icon>
            <t-icon name="mobile" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item class="verification-code" name="verifyCode">
        <t-input v-model="PhoneForm.code" size="large" placeholder="请输入验证码" />
        <t-button variant="outline" :disabled="counter.countdown  > 0" @click="sendCode">
          {{counter.countdown == 0 ? '发送验证码' : `${counter.countdown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template>
    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button block size="large" type="submit" @click="onSubmit"> 登录 </t-button>
    </t-form-item>

    <div class="switch-container">
      <span v-if="type !== 'password'" class="tip" @click="switchType('password')">使用账号密码登录</span>
      <span v-if="type !== 'qrcode'" class="tip" @click="switchType('qrcode')">使用微信扫码登录</span>
      <span v-if="type !== 'phone'" class="tip" @click="switchType('phone')">使用手机号登录</span>
    </div>
  </t-form>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import type {FormInstanceFunctions, FormRule} from 'tdesign-vue-next';
import {MessagePlugin} from 'tdesign-vue-next';
import useRouterStore from "../../../stores/useSystemStore.ts";
import {useTokenStore} from "@/stores";
import {getUserInfo, login} from "@/api/user.ts";
import router from "@/router";
import {ElMessage} from "element-plus";

const routerStore = useRouterStore();
const tokenStore = useTokenStore();
// const counter=useTimerStore();

const UserNameForm=ref({
  name:'zachary',
  password:'123456',
})
const PhoneForm=ref({
  phone:'',
  code:'',
})



const FORM_RULES: Record<string, FormRule[]> = {
  name: [{ required: true, message: '账号必填', type: 'error' }],
  password: [{ required: true, message: '密码必填', type: 'error' }],
};

const type = ref('password');

const form = ref<FormInstanceFunctions>();

const showPsw = ref(false);


const switchType = (val: string) => {
  type.value = val;
};


/**
 * 发送验证码
 */
const isPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};
const sendCode =async () => {
  counter.startTimer()
  if(isPhone(PhoneForm.value.phone)){
    try{
      await sendSms(PhoneForm.value.phone);
    }catch (e){
      console.log(e);
      MessagePlugin.error("验证码发送失败")
    }
  }else{
    MessagePlugin.error("请输入正确的电话号码")
  }
};
const deviceId="21376"
const token=ref('')
const onSubmit = async () => {
  await LoginTo()
};
const LoginTo=async ()=>{
  const res=await login({
    username: UserNameForm.value.name,
    password: UserNameForm.value.password,
    device: deviceId
  })
  await getText()
  if(res.status==="SUCCESS"){
    await MessagePlugin.success("登录成功!")
    if(routerStore.selectedRouter===''){
      await router.push('/welcome')
    }else {
      let page = routerStore.selectedRouter
      routerStore.removeRouter()
      await router.push(page)
    }
  }else{
    await MessagePlugin.error(res.message)
  }
}
const getText = async () => {
  try {
    const tokenStore = useTokenStore();
    await getUserInfo(tokenStore.token.userId);
    console.log("获取用户信息 id=",tokenStore.token.id)
    ElMessage.success('用户信息加载成功');
  } catch (error) {
    console.error('用户信息加载失败', error);
    ElMessage.error('用户信息加载失败');
  }
}
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
