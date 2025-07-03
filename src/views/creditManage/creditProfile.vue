<template>
  <el-card class="box-card">
    <div class="flex items-center mb-4">
      <el-avatar :size="80" src="https://i.pravatar.cc/100"></el-avatar>
      <div class="ml-4">
        <h2 class="text-xl font-bold">{{ userInfo.name }}</h2>
        <p class="text-sm text-gray-500">
          信用分：<strong class="text-blue-500 text-2xl">{{ userInfo.creditScore }}</strong>
        </p>
        <el-tag type="success">{{ userInfo.creditLevel }}</el-tag>
        <p class="text-xs text-gray-400">更新时间：{{ userInfo.updateTime }}</p>
      </div>
    </div>

    <el-row :gutter="20" class="mb-4">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <div class="text-lg text-orange-500 font-bold">{{ behaviorCount.totalDays }} 天</div>
            <p class="text-sm text-gray-500">累计天数</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <div class="text-lg text-orange-500 font-bold">{{ behaviorCount.totalAmount }} 元</div>
            <p class="text-sm text-gray-500">累计金额</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <div class="text-lg text-orange-500 font-bold">{{ behaviorCount.creditLifeCount }} 次</div>
            <p class="text-sm text-gray-500">信用生活使用次数</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <div class="text-lg text-orange-500 font-bold">{{  behaviorCount.creditBusinessCount }} 次</div>
            <p class="text-sm text-gray-500">信用商业使用次数</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <h3 class="text-lg font-semibold mb-2">守约记录</h3>
    <el-table :data="userInfo.records" border style="width: 100%">
      <el-table-column prop="type" label="类型" width="120"></el-table-column>
      <el-table-column prop="desc" label="描述"></el-table-column>
      <el-table-column prop="amount" label="金额" width="100"></el-table-column>
      <el-table-column prop="time" label="完成时间" width="180"></el-table-column>
      <el-table-column prop="status" label="完成状态" width="120"></el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import axios from 'axios';

const userInfo = reactive({
  name: '张三',
  creditScore: 800,
  creditLevel: '信用极好',
  updateTime: '2023-12-12',
  records: [
    { type: '便捷泊车', desc: '东江滨公园东北停车场', amount: 20, time: '2023-12-30 12:58:50', status: '已完成' },
    { type: '舒心就医', desc: '北京协和医院', amount: 888, time: '2023-12-30 12:58:50', status: '已完成' },
    { type: '信用租赁', desc: '高新区 厚度站 房东还你一个家', amount: 8888, time: '-', status: '已逾期' },
    { type: '酒店预定', desc: '上海国际旅游度假区酷侃酒店', amount: 454, time: '2023-12-30 12:58:50', status: '逾期365天' },
    { type: '二手市场', desc: '三星S20Ultra 5G完美屏原装正品', amount: 1300, time: '2023-12-30 12:58:50', status: '已完成' },
  ]
});
const behaviorCount = reactive({
    totalDays: 0,
    totalAmount: 0,
    creditLifeCount: 0,
    creditBusinessCount: 0,
})

onMounted(() => {
  // TODO: 发请求到后端获取数据
  //获取用户行为统计相关信息
  axios.get('http://localhost:8086/credit/count/101').then((res) => {
      const result = res.data;
      if(result.code === 1 && result.data){
        const data = result.data;
        //赋值
        behaviorCount.totalDays = data.totalDays;
        behaviorCount.totalAmount = data.totalAmount;
        behaviorCount.creditLifeCount = data.creditLifeCount;
        behaviorCount.creditBusinessCount = data.creditBusinessCount;
      }else{
        console.error('获取用户行为统计相关信息失败:',result.msg);
      }
  }).catch((err) => {
      console.error('请求失败',err);
  });
});
</script>

<style scoped>
.text-orange-500 {
  color: #f59e0b;
}
.text-blue-500 {
  color: #3b82f6;
}
.text-gray-500 {
  color: #6b7280;
}
.text-gray-400 {
  color: #9ca3af;
}
.text-xl {
  font-size: 1.25rem;
}
.text-2xl {
  font-size: 1.5rem;
}
.font-bold {
  font-weight: bold;
}
.ml-4 {
  margin-left: 1rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.text-center {
  text-align: center;
}
</style>
