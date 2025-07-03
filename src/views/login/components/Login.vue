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
import { onMounted, ref } from 'vue';
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import useRouterStore from "../../../stores/useSystemStore.ts";
import { useTokenStore } from "@/stores";
import { getUserCreditScoreInfo, getUserInfo, login, userLogout } from "@/api/user.ts";
import router from "@/router";
import { ElMessage } from "element-plus";
import { useUserInfoStore } from "@/stores/useUserInfoStore.ts";
import { useDeviceStore } from "@/stores/useDeviceStore.ts";
import { useUserCreditScoreStore } from "@/stores/useUserCreditScore.ts";

const routerStore = useRouterStore();
const userInfoStore = useUserInfoStore(); // 提前初始化用户信息store
const userCreditScoreStore = useUserCreditScoreStore(); // 提前初始化信用分store

const UserNameForm = ref({
  name: 'zachary',
  password: '123456',
});
const PhoneForm = ref({
  phone: '',
  code: '',
});

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

const clearBeforeUser = () => {
  const userTokenStore = useTokenStore();
  const deviceStore = useDeviceStore();

  // 清除用户信息
  userInfoStore.removeUserInfo();
  userCreditScoreStore.removeUserCredit();
  userTokenStore.removeToken();
  deviceStore.removeDevice();
};
clearBeforeUser();


const isPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

const sendCode = async () => {
  counter.startTimer();
  if (isPhone(PhoneForm.value.phone)) {
    try {
      await sendSms(PhoneForm.value.phone);
    } catch (e) {
      console.log(e);
      await MessagePlugin.error("验证码发送失败");
    }
  } else {
    await MessagePlugin.error("请输入正确的电话号码");
  }
};

// 设备ID
const deviceStore = useDeviceStore();
const deviceId = ref(deviceStore.device);

function getDeviceId(): string {
  if (deviceStore.device !== '') {
    return deviceStore.device;
  }
  const fingerprint = [
    navigator.userAgent,
    screen.width + "x" + screen.height,
    navigator.language,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || "unknown"
  ].join("|");

  const encoded = btoa(fingerprint).slice(0, 15);
  deviceId.value = encoded.toString();
  deviceStore.setDevice(deviceId.value);
  return encoded;
}

onMounted(() => {
  getDeviceId();
});

const token = ref('');
const onSubmit = async () => {
  await LoginTo();
};

// ================== 核心修改：用户信息检查逻辑 ==================
const checkUserInfoComplete = (): boolean => {

  // 检查昵称是否完善
  const isNicknameComplete = userInfoStore.user!==null && userInfoStore.user.updated;

  // 检查信用分账户类型是否完善
  const isCreditInfoComplete = userCreditScoreStore.score!=null && userCreditScoreStore.score.updated;

  // 返回综合检查结果
  return isNicknameComplete && isCreditInfoComplete;
};

const redirectBasedOnInfoComplete = async () => {
  if (!checkUserInfoComplete()) {
    // 信息不完善，跳转到个人信息完善页
    await router.push('/personal');
    await MessagePlugin.warning('请先完善个人信息和信用信息');
  } else {
    // 信息完善，跳转到目标页面
    if (routerStore.selectedRouter === '') {
      await router.push('/welcome');
    } else {
      const page = routerStore.selectedRouter;
      await router.push(page);
    }
  }
};
// ================== 核心修改结束 ==================

const LoginTo = async () => {
  try {
    const res = await login({
      username: UserNameForm.value.name,
      password: UserNameForm.value.password,
      device: deviceStore.device === '' ? deviceId.value : deviceStore.device
    });

    if (res.status === "SUCCESS") {
      await MessagePlugin.success("登录成功!");

      // 获取用户信息和信用分信息
      await getText();
      await getUserScore();

      // ================== 核心修改：添加信息检查 ==================
      // 根据用户信息是否完善决定跳转目标
      await redirectBasedOnInfoComplete();
      // ================== 核心修改结束 ==================
    } else {
      await MessagePlugin.error(res.message);
    }
  } catch (error) {
    console.error("登录过程中发生错误:", error);
    await MessagePlugin.error("登录失败，请重试");
  }
};

const getText = async () => {
  try {
    const tokenStore = useTokenStore();
    await getUserInfo(tokenStore.token.userId);
  } catch (error) {
    console.error('获取用户信息失败', error);
    ElMessage.error('用户信息加载失败');
  }
};

const getUserScore = async () => {
  try {
    const id = userInfoStore.user.id;
    await getUserCreditScoreInfo(id);
  } catch (e) {
    console.error('用户信用分加载失败', e);
    MessagePlugin.error('用户信用分加载失败');
  }
};
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
