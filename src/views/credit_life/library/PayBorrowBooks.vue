<template>
  <div class="checkout-page">
    <div class="header">
      <h1 class="main-title">图书借阅结算</h1>
      <div class="sub-title">请确认你的借阅信息并完成支付</div>
    </div>
    <div class="borrow-summary card-box">
      <div class="section-title">借阅清单：{{borrowBooks.length}}本</div>
      <div class="book-list">
        <div v-for="book in borrowBooks" :key="book.id" class="book-item">
          <div class="book-left">
            <img class="book-image" :src="book.image" alt="封面" />
            <div class="book-info">
              <div class="book-title">{{ book.bookName }}</div>
              <div class="book-author">作者：{{ book.author }}</div>
            </div>
          </div>
          <div class="book-right">
            <div class="fee-label">图书费用</div>
            <div class="fee-amount">¥{{ book.price.toFixed(2) }}</div>
          </div>
        </div>
      </div>
      <div class="cost-summary">
        <div class="summary-row">
          <span>费用总计</span>
          <span>¥{{ totalCost.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>信用分 ({{ creditScore }}/600)</span>
          <span :style="{ color: creditScore >= 600 ? 'green' : 'red' }">
              {{ creditScore >= 600 ? '符合条件' : '不符合条件' }}
          </span>
        </div>
        <div class="summary-row">
          <span>信用折扣</span>
          <span style="color: green">- ¥{{ discount.toFixed(2) }}</span>
        </div>
        <el-divider />
        <div class="summary-row final-row">
          <span>应付总额</span>
          <span class="final-amount">¥{{ finalAmount.toFixed(2) }}</span>
        </div>
      </div>
    </div>
    <div class="payment-method card-box">
      <div class="section-title">选择支付方式</div>
      <el-radio-group v-model="selectedPay">
        <div class="pay-option" v-for="method in paymentMethods" :key="method.value">
          <el-radio :label="method.value" border>
            <img :src="method.icon" class="pay-icon"  alt=""/>
            <div class="pay-label">{{ method.label }}</div>
          </el-radio>
        </div>
      </el-radio-group>
    </div>
    <div class="bottom-bar">
      <el-button type="primary" size="large" class="pay-btn" @click="confirmPay">
        确认支付 ¥{{ finalAmount.toFixed(2) }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {type Book, payOrder, preOrderBooks} from "@/api/life/book_api.ts";
import {useRoute} from "vue-router";
import {useUserCreditScoreStore} from "@/stores/useUserCreditScore.ts";
import {ElMessage, ElMessageBox} from "element-plus";
import router from "@/router";

const borrowBooks = ref<Book[]>([])

const route = useRoute()
const userId = route.params.id
const id=ref(0)

const loadPayInfo=async ()=>{
  const res=await preOrderBooks(userId)
  borrowBooks.value=res.booksList
  id.value=res.bookReturnFeesId
}
loadPayInfo()

const userCreditScoreStore=useUserCreditScoreStore()
const ucs=userCreditScoreStore.score
const creditScore = ucs.creditScore

const discount = computed(() => {
  console.log("用户信用分：",creditScore)
  return creditScore >= 600 ? ((creditScore - 600) / 250) : 0
})

const totalCost = computed(() => {
  return borrowBooks.value.reduce((sum, book) => sum + book.price, 0)
})



const finalAmount = computed(() => {
  return totalCost.value - discount.value
})

const selectedPay = ref('wechat')

const confirmPay =async () => {
  const res= await payOrder(id.value)
  await ElMessageBox.confirm(
      '支付成功',
      '你已经成功完成支付！',
      {
        confirmButtonText: '我的借阅',
        cancelButtonText: '返回主页',
        type: 'success',
      }
  ).then(() => {
    ElMessage.info('暂未完成！');
    router.push("/book/my_order")
  }).catch(() => {
    router.push("/life/library")
  })
}

const paymentMethods = [
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
]
</script>

<style scoped lang="scss">
.checkout-page {
  height: 92vh;
  max-width: 800px;
  margin: 4px auto;
  padding: 20px;
}

.header {
  margin-bottom: 5px;
  .main-title {
    font-size: 24px;
    font-weight: bold;
  }
  .sub-title {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
  }
}

.section-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
}

.card-box {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.book-list {
  max-height: 270px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.book-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-left {
  display: flex;
  gap: 12px;

  .book-image {
    width: 70px;
    height: 80px;
    border-radius: 4px;
    object-fit: cover;
  }

  .book-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .book-title {
      font-weight: bold;
      font-size: 15px;
    }
    .book-author {
      font-size: 13px;
      color: #666;
      margin-top: 4px;
    }
  }
}

.book-right {
  text-align: right;
  .fee-label {
    font-size: 13px;
    margin-right: 40px;
    color: #999;
  }
  .fee-amount {
    font-weight: bold;
    font-size: 16px;
    margin-top: 4px;
    margin-right: 40px;
  }
}

.cost-summary {
  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 12px;
    color: #333;
  }

  .final-row {
    font-size: 16px;
    font-weight: bold;

    .final-amount {
      color: #409eff;
    }
  }
}

.payment-method {
  .pay-option {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 10px;
    .pay-icon {
      width: 32px;
      height: 32px;
      margin-right: 8px;
      vertical-align: middle;
    }
    .pay-label {
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
    }
  }
}

.bottom-bar {
  text-align: center;
  .pay-btn {
    width: 100%;
    font-size: 16px;
  }
}
</style>
