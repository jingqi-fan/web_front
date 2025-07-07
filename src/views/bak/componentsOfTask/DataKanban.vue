<template>
  <div class="common-layout">
    <el-row gutter={20}>
      <el-col :span="6">
        <el-card class="box-card">
          <div class="progress-info">
            <div class="progress-percentage">{{ taskCounts.completed }}%</div>
            <div class="progress-label">已完成任务数({{taskCounts.completed}}项)</div>
          </div>
          <el-progress :percentage="taskProgress.completed" :stroke-width="15" :text-inside="true" class="this_progress" ></el-progress>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div class="progress-info">
            <div class="progress-percentage">{{ taskCounts.failed }}%</div>
            <div class="progress-label">故障任务数({{taskCounts.failed}}个)</div>
          </div>
          <el-progress :percentage="taskProgress.failed" :stroke-width="15" class="progress" ><span/></el-progress>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <el-progress type="dashboard" :percentage="taskCounts.pending" :status="progressStatus">
            <template #default="{ percentage }">
              <span class="circular_progress_value">{{ taskCounts.pending }}%</span>
              <span class="circular_progress_label">未完成任务</span>
            </template>
          </el-progress>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div class="progress-info">
            <div class="progress-percentage">剩余{{ taskCounts.pending }}天</div>
            <div class="progress-label">交期({{taskCounts.pending}})</div>
            <span>交付预警({{taskCounts.pending}})</span>
          </div>

        </el-card>
      </el-col>
    </el-row>
    <el-divider/>
    <el-container>
      <el-header>
        <div class="x-axis-select">
          <el-radio-group v-model="selectedTask" >
            <el-radio-button label="completed">已完成任务</el-radio-button>
            <el-radio-button label="failed">故障任务</el-radio-button>
            <el-radio-button label="pending">未完成任务</el-radio-button>
          </el-radio-group>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <div class="y-axis-select">
            <el-radio-group v-model="selectedTimeUnit">
              <el-radio label="year">年</el-radio>
              <el-radio label="month">月</el-radio>
              <el-radio label="day">日</el-radio>
              <el-radio label="hour">时</el-radio>
            </el-radio-group>
          </div>
        </el-aside>
        <el-main>
          <div class="line-chart">
            <Line :data="chartData" :options="chartOptions" />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const taskCounts = ref({
  completed: 45,  // 已完成任务
  failed: 10,     // 故障任务
  pending: 25     // 未完成任务
});
const taskProgress = ref({
  completed: 80,  // 已完成任务进度
  failed: 30,     // 故障任务进度
  pending: 60     // 未完成任务进度
});



const selectedTask = ref('completed');
const selectedTimeUnit = ref('year');

const taskData = {
  completed: [0.5, 0.6, 0.7, 0.8, 0.9, 0.7, 0.6],
  failed: [0.1, 0.2, 0.1, 0.3, 0.4, 0.3, 0.2],
  pending: [0.4, 0.2, 0.2, 0.1, 0.1, 0.1, 0.2],
};
const timeLabels = {
  year: ['2023', '2022', '2021', '2020', '2019', '2018', '2017'],
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  day: ['1', '2', '3', '4', '5', '6', '7'],
  hour: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'],
};



const chartData = ref({
  labels: timeLabels[selectedTimeUnit.value], // 根据时间单位更新标签
  datasets: [
    {
      label: `${selectedTask.value}任务`,
      data: taskData[selectedTask.value], // 根据任务类型更新数据
      borderColor: 'green',
      fill: false,
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  scales: {
    y: {
      min: 0,
      max: 1,
      ticks: {
        callback: (value: number) => `${value * 100}%`,
      },
    },
  },
});

watch([selectedTask, selectedTimeUnit], () => {
  chartData.value = {
    labels: timeLabels[selectedTimeUnit.value],
    datasets: [
      {
        label: `${selectedTask.value}任务`,
        data: taskData[selectedTask.value],
        borderColor: 'green',
        fill: false,
      },
    ],
  };
});
</script>

<style scoped>
.common-layout {
  margin: 20px;
  height: 600px;
}

.card-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.box-card {
  height: 142px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.x-axis-select {
  padding-top: 10px;
  text-align: start;
  margin-left: 40px;
}

.y-axis-select {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  width: 10px;
}

.y-axis-select .el-radio-group {
  width: 10px;
  margin-left: 10px;
}

.y-axis-select .el-radio {
  margin: 5px 0;
}

.line-chart {
  height: 360px;
  width: 540px;
}

.el-container {
  margin-top: 10px;
  height: 500px;
}

.el-header {
  background-color: #FFFFFF;
  padding: 10px;
  margin-left: 50px;
}

.el-aside {
  background-color: #FFFFFF;
  width: 80px;
  height: 700px;
}

.el-main {
  background-color: #fff;
  height: 700px;
}

.progress-percentage {
  font-size: 2.3em;
  font-family: '华文楷体', '楷体', '隶书', 'FZKaTong-M19', 'FZShuTi', sans-serif; /* 使用正楷字体 */
  text-align: center;
}

.progress-label {
  font-size: 1.3em;
  font-family: '华文楷体', sans-serif;
  color: #666;
  text-align: center;
}

.circular_progress_value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
  text-align: center;
}

.circular_progress_label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
  text-align: center;
}

.el-row {
  margin-bottom: 20px;
}

.progress-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.progress {
  width: 125%;
  margin: 0 auto;
  position: relative;
}

.this_progress {
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.el-col {
  padding: 10px 10px;
}

</style>
