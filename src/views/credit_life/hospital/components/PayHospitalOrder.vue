<template>
  <el-card class="payment-card">
    <!-- 标题 -->
    <div class="card-title">确认支付</div>

    <!-- 金额总览 -->
    <div class="amount-section">
      <div class="total-amount">￥{{ priceTotal }}</div>
      <div class="amount-label">订单总金额</div>
    </div>

    <!-- 明细 -->
    <div class="detail-section">
      <div class="detail-item">
        <span>订单金额</span>
        <span>￥{{ priceTotal }}</span>
      </div>
      <div class="detail-item">
        <span>优惠</span>
        <span class="discount">-￥{{ discount.toFixed(2) }}</span>
      </div>
      <div class="detail-item">
        <span>信用分抵扣</span>
        <span class="discount">-￥{{ deduction.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="payment-methods">
      <div class="payment-title">选择支付方式</div>
      <div class="method-group">
        <div
            class="method-item"
            v-for="item in paymentOptions"
            :key="item.value"
            @click="selectedMethod = item.value"
        >
          <div class="method-left">
            <img :src="item.icon" alt="icon" class="method-icon" />
            <div class="method-info">
              <div class="method-name">{{ item.label }}</div>
              <div class="method-desc">{{ item.description }}</div>
            </div>
          </div>
          <el-radio
              :model-value="selectedMethod"
              :value="item.value"
              @change="selectedMethod = item.value"
              class="method-radio"
          />

        </div>
      </div>
    </div>

    <!-- 支付按钮 -->
    <el-button type="success" class="pay-button" size="large" @click="payForThis">
      立即支付 ￥{{ totalAmount.toFixed(2) }}
    </el-button>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {getPrePayFee, getResultDetail, payFee} from "@/api/life/hospital_api.ts";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import router from "@/router";
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";



// 支付方式
const selectedMethod = ref('wechat')
const paymentOptions = [
  {
    label: '微信支付',
    value: 'wechat',
    description: '推荐使用微信支付',
    icon: new URL('@/assets/wechat_pay.png', import.meta.url).href,
  },
  {
    label: '支付宝',
    value: 'alipay',
    description: '推荐使用支付宝支付',
    icon: new URL('@/assets/alipay.png', import.meta.url).href,
  },
  {
    label: '银行卡支付',
    value: 'bank',
    description: '支持储蓄卡、信用卡',
    icon: new URL('@/assets/bankpay.png', import.meta.url).href,
  },
]
const route = useRoute()
const appointmentId=route.params.id;
const userInfoStore=useUserInfoStore()
const userId=userInfoStore.user.id
// 金额数据
const discount = ref(0)
const deduction = ref(0)
const totalAmount = ref(0)
const feeId=ref(0)
const priceTotal=ref("")
const loadPaymentInfo=async ()=>{
  const res= await getResultDetail(appointmentId,userId)

  feeId.value=res.fees.id
  priceTotal.value=Number(res.fees.totalFee)
  discount.value=Number(res.fees.discount)
  deduction.value=0
  totalAmount.value=Number(res.fees.actualPayment)
}
loadPaymentInfo()

const payForThis=async ()=>{
  console.log(feeId.value)
  const res=await payFee(feeId.value)
  ElMessage.success(res?res:"支付成功")
  await router.push("/life/hospital_order_home/myorder")
}
</script>

<style scoped lang="scss">
.payment-card {
  max-width: 500px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 12px;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
}

.amount-section {
  text-align: center;
  margin-bottom: 20px;

  .total-amount {
    font-size: 36px;
    font-weight: bold;
  }

  .amount-label {
    font-size: 14px;
    color: #888;
    margin-top: 4px;
  }
}

.detail-section {
  margin-bottom: 24px;

  .detail-item {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    margin-bottom: 8px;

    span:last-child {
      font-weight: 500;
    }

    .discount {
      color: #67C23A;
    }
  }
}

.payment-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 12px;
}

.method-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.method-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #409eff;
  }
}

.method-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.method-icon {
  width: 40px;
  height: 40px;
  border-radius: 6px;
}

.method-info {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .method-name {
    font-size: 15px;
    font-weight: 500;
    color: #333;
  }

  .method-desc {
    font-size: 13px;
    color: #888;
    margin-top: 4px;
  }
  .method-radio {
    margin-left: auto;
    ::v-deep(.el-radio__label) {
      display: none;
    }
  }

}

.pay-button {
  width: 100%;
  font-size: 16px;
  margin-top: 20px;
}
</style>


