<template>
  <t-form
    ref="form"
    :class="['item-container', `register-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <template v-if="type == 'phone'">
      <t-form-item name="phone">
        <t-input v-model="PhoneForm.phone" :maxlength="11" size="large" placeholder="请输入您的手机号">
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>
    </template>

    <template v-if="type == 'email'">
      <t-form-item name="email">
        <t-input v-model="EmailForm.email" type="text" size="large" placeholder="请输入您的邮箱">
          <template #prefix-icon>
            <t-icon name="mail" />
          </template>
        </t-input>
      </t-form-item>
    </template>

    <t-form-item name="password">
      <t-input
        v-model="EmailForm.password"
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

    <template v-if="type == 'phone'">
      <t-form-item class="verification-code" name="verifyCode">
        <t-input v-model="PhoneForm.code" size="large" placeholder="请输入验证码" />
        <t-button variant="outline" :disabled="counter.countdown > 0" @click="sendSmsVerifyCode">
          {{ counter.countdown == 0 ? '发送验证码' : `${counter.countdown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template>

    <t-form-item class="check-container" name="checked">
      <t-checkbox v-model="formData.checked">我已阅读并同意 </t-checkbox> <span>Auto Monitor服务协议</span> 和
      <span>隐私声明</span>
    </t-form-item>

    <t-form-item>
      <t-button block size="large" type="submit"> 注册 </t-button>
    </t-form-item>

    <div class="switch-container">
      <span class="tip" @click="switchType(type == 'phone' ? 'email' : 'phone')">{{
        type == 'phone' ? '使用邮箱注册' : '使用手机号注册'
      }}</span>
    </div>
  </t-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MessagePlugin, FormRule } from 'tdesign-vue-next';






const INITIAL_DATA = {
  phone: '',
  email: '',
  password: '',
  verifyCode: '',
  checked: false,
};

const FORM_RULES: Record<string, FormRule[]> = {

};

const type = ref('phone');

const form = ref();
const formData = ref({ ...INITIAL_DATA });

const showPsw = ref(false);

//
const PhoneForm=ref({
  phone: '',
  password:'',
  code:''
})
const isPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};
const sendSmsVerifyCode = async () => {
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
}

const registerByPhoneAsync = async () => {
  if(PhoneForm.value.phone=='' || PhoneForm.value.password=='' || PhoneForm.value.code==''){
    MessagePlugin.error("验证信息为空")
    return;
  }
  const res=ref()
  try{
    res.value=await registerByPhone(PhoneForm.value.phone,PhoneForm.value.code,PhoneForm.value.password);
  }catch (e){
    MessagePlugin.error("系统出现错误,请反馈给开发人员");
    console.log("registerByPhone错误:"+e);
    return;
  }
  if(res.value!=null){
    emit('registerSuccess');
  }
}

//
const EmailForm=ref({
  email: '',
  password: '',
})
const registerByEmailAsync = async () => {
  try{
    // await registerByEmail(EmailForm.value.email,EmailForm.value.password)
  }catch (e){
    MessagePlugin.error("系统出现错误,请反馈给开发人员");
    console.log("registerByPhone错误:"+e);
    return;
  }
  emit('registerSuccess');
}

const emit = defineEmits(['registerSuccess']);

const onSubmit = ({ validateResult }) => {
  if (validateResult === true) {
    if (!formData.value.checked) {
      MessagePlugin.error('请同意Auto Monitor服务协议和Auto Monitor隐私声明');
      return;
    }
    if(type.value == 'phone'){
      registerByPhoneAsync()
    }else if(type.value == 'email'){
      registerByEmailAsync()
    }
  }
};

const switchType = (val) => {
  form.value.reset();
  type.value = val;
};
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
