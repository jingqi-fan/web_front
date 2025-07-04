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
        <p class="text-xs text-gray-400">
            更新时间：{{ formatTime(userInfo.updateTime) }}
        </p>
      </div>
    </div>
    <!--  跳转按钮到信用分详情 -->
    <el-button type="primary" @click="goToCreditDimension">查看分数构成</el-button>

    <!-- 行为累计 -->
    <h3 class="text-lg font-semibold mb-2">行为累计</h3>
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

    <!-- 守约记录 -->
    <h3 class="text-lg font-semibold mb-2">守约记录</h3>
    <el-table :data="userInfo.records" border style="width: 100%">
      <el-table-column prop="recordType" label="类型" width="120"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="amount" label="金额" width="100"></el-table-column>
      <el-table-column prop="finishTime" label="完成时间" width="180"></el-table-column>
      <el-table-column prop="status" label="完成状态" width="120"></el-table-column>
    </el-table>
    
    <!-- 分页控件 -->
    <el-pagination
      class="mt-4 mb-2"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :current-page="pagination.pageNum"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'
import axiosInstance from '@/plugins/axios';
import { useUserInfoStore } from '../../stores/useUserInfoStore';
import { useUserCreditScoreStore } from '../../stores/useUserCreditScore';
// import {User } from '@/entity/user.ts';

const router = useRouter()
const goToCreditDimension = () => {
  router.push({ path: '/creditDimension' })
}

const userInfoStore=useUserInfoStore()
const userCreditScoreStore=useUserCreditScoreStore()

const userBasicInfo=userInfoStore.user  //User
const creditScoreInfo=userCreditScoreStore.score  //UserCreditScore

const userId = userBasicInfo.id;
const userInfo = reactive({
  name: userBasicInfo.nickName,
  avatar: userBasicInfo.profilePicture,
  creditScore: creditScoreInfo.creditScore,
  creditLevel: '信用极好',
  updateTime: creditScoreInfo.updateTime,
  records: []
});
const behaviorCount = reactive({
    totalDays: 0,
    totalAmount: 0,
    creditLifeCount: 0,
    creditBusinessCount: 0,
})

//格式化时间
function formatTime(raw) {
  return new Date(raw).toLocaleString('zh-CN', {
    hour12: false
  });
}

//分页
// 分页数据
const pagination = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10
});

// 获取分页守约记录数据
const fetchRecords = () => {
  userInfo.records = [];  // 清空旧数据，避免切页时闪烁或旧数据残留
  axiosInstance.get('/record', {
    params: {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      userId: userId,
      recordType: '',  
      status: ''
    }
  }).then(res => {
    const result = res.data;
    if (result.code === 1 && result.data) {
      userInfo.records = result.data.records;
      pagination.total = result.data.total;
    } else {
      console.error('获取守约记录失败:', result.msg);
    }
  }).catch(err => {
    console.error('请求守约记录失败', err);
  });
};

// 页码变化
const handlePageChange = (newPage) => {
  pagination.pageNum = newPage;
  fetchRecords();
};

// 每页大小变化
const handleSizeChange = (newSize) => {
  pagination.pageSize = newSize;
  pagination.pageNum = 1; // 重置页码
  fetchRecords();
};

onMounted(() => {
  //获取用户行为统计相关信息
  axiosInstance.get(`/credit/count/${userId}`).then((res) => {
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

  // 调用分页记录查询
  fetchRecords();

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
.mt-4 {
  margin-top: 1rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
</style>
