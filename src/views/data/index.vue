<template>
  <el-container style="height: 100vh; width: 100vw;margin: -8px -8px -8px -8px">
    <el-header
        style="height: 65px;
        background-color: #f5f5f5;
        color: white;
        padding: 0 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 139, 0.5);
        margin: 5px 5px 0 5px;
        display: flex;
        justify-content: space-between;">
      <div class="title-left">
<!--        <data-center-logo class="logo" @click="goToHome"/>-->
        <h2>AutoMonitor · 数据监控中心</h2>
      </div>
      <div class="title-right">
        <el-button class="custom-button">创作中心</el-button>
        <el-button class="custom-button">应用中心</el-button>
        <el-button class="custom-button" :icon="User" plain round></el-button>
        <el-button class="custom-button" :icon="Back" plain>返回</el-button>
      </div>
    </el-header>

    <el-main style="padding: 0; height: calc(100vh - 65px);margin-top: 9px;box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);">
      <div class="layout-container">
        <!-- 柱形图区域 -->
        <div class="BarChart">
          <div class="card">
            <p>API测试状态</p>
          </div>
          <div class="card">
            <div class="title">
              <h3>API调用天梯图</h3>
            </div>
            <div>
              <div v-for="i in rankingData" class="apiNum">
                <div>
                  <el-avatar></el-avatar>
                </div>
                <div>
                  <el-progress :percentage="i.apiNumber"></el-progress>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧区域 -->
        <div class="right">
          <!--地图、按钮、折线图、实时消息-->
          <div class="MapCardButtonMessage">
            <!--Map、Button-->
            <div class="MapButton">
              <!--单选按钮组-->
              <div class="RadioButton">
                <el-radio-group v-model="transaction" style="margin-left: 40px">
                  <el-radio :value="1">AI训练</el-radio>
                  <el-radio :value="2">办公异常</el-radio>
                  <el-radio :value="3">流量分析</el-radio>
                </el-radio-group>
              </div>
              <!--地图-->
              <div class="Map">
<!--                <mapComponent :ServerAdderList="GetServerList()" ref="myMap"/>-->
                <!-- 计数器区域，位于Map区域的左下角 -->
                <div class="Counter">
                  <div class="CounterTitle">AutoMonitor服务器</div>
                  <div class="CounterValue">
                    <div class="number">2</div>
                    <div class="number">1</div>
                    <div class="number">3</div>
                    <div class="number">1</div>
                    <div class="number">8</div>
                  </div>
                  <div class="CounterProgress">
                    <el-progress
                        :percentage="100"
                        status="success"
                        :duration="5"
                        style="margin-right: -30px"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!--折线图、实时消息-->
            <div class="LineChartMessage">
              <!--折线图-->
              <div class="LineChart">
                <area-info />
              </div>
              <div class="Message">
                <div class="title">
                  <h3>API调用日志</h3>
                </div>
                <div class="log">
                  <!--API调用日志-->
                  <el-table :data="tableData" height="230px" style="width: 100%">
                    <el-table-column prop="date" label="日期" />
                    <el-table-column prop="time" label="时间" />
                    <el-table-column prop="name" label="API名称" />
                    <el-table-column prop="user" label="用户" />
                    <el-table-column prop="area" label="地区" />
                  </el-table>
                </div>
              </div>
            </div>
          </div>
          <!--进度数据卡片-->
          <div class="DataCard">
            <div class="progress-card1">
              <p>异常日志</p>
            </div>
            <div class="progress-card2">
              <p>Api管理</p>
            </div>
            <div class="progress-card3">
              <p>异常处理</p>
            </div>
            <div class="progress-card4" style="margin-right: 10px">
              <p>
                API总量
              </p>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import MapComponent from './components/Map.vue'

import router from "../../router/index.ts";
import {Back, User} from "@element-plus/icons-vue";
import AreaInfo from "./components/AutoRotate.vue"
import {ref, watch} from "vue";
const goToHome=()=> {
  router.push("/home");
}
const transaction = ref(0)

const myMap = ref(null);

watch(transaction, () => {
  if (myMap.value) {
    myMap.value.initializeMap();
  }
});
const GetServerList = () => {
  switch (transaction.value) {
    case 1:
      return serverListOfAi.value;
    case 2:
      return serverListOfOffice.value;
    case 3:
      return serverListOfAnalysis.value;
    default:
      return serverList.value;
  }
};
const AvatarUrl="https://img2.baidu.com/it/u=2886770170,3832974539&fm=253&fmt=auto&app=138&f=JPEG?w=377&h=377";
//const standard=rankingData.value[0]
const rankingData=ref([
  {id:1,url:AvatarUrl,apiNumber:89543},
  {id:2,url:AvatarUrl,apiNumber: 48712},
  {id:3,url:AvatarUrl,apiNumber:8943},
  {id:4,url:AvatarUrl,apiNumber:8343},
])

const serverListOfAi = ref([
  { longitude: 126.635906, latitude: 45.55897, label: '中国电信云计算基地', value: '中国电信云公司' },
]);
const serverListOfOffice = ref([

  { longitude: 106.686053, latitude: 26.758679, label: '贵阳云计算中心', value: '贵阳云计算中心' },
]);

const serverListOfAnalysis = ref([
  { longitude: 106.644281, latitude: 26.618753, label: '国家大数据', value: '国家大数据(贵州综合试验区展示中心)' },
  { longitude: 126.635906, latitude: 45.55897, label: '中国电信云计算基地', value: '中国电信云公司' },
]);
const serverList = ref([
  { longitude: 106.644281, latitude: 26.618753, label: '国家大数据', value: '国家大数据(贵州综合试验区展示中心)' },
  { longitude: 106.686053, latitude: 26.758679, label: '贵阳云计算中心', value: '贵阳云计算中心' },
  { longitude: 84.819924, latitude: 45.532951, label: '中国信通院云计算和大数据研究所', value: '中国信通院云计算和大数据研究所' },
  { longitude: 113.239221, latitude: 40.995777, label: '乌兰察布华为云数据中心', value: '乌兰察布华为云数据中心' },
  { longitude: 126.635906, latitude: 45.55897, label: '中国电信云计算基地', value: '中国电信云公司' },
]);

const tableData = [
  {
    date: '05-03',
    time: '19:00',
    name: 'AI训练',
    user: '用户1',
    area: '山东'
  },
  {
    date: '09-13',
    time: '18:47',
    name: '办公异常',
    user: '用户2',
    area: '贵州'
  },
  {
    date: '12-03',
    time: '10:00',
    name: '流量分析',
    user: '用户3',
    area: '北京'
  },
  {
    date: '05-23',
    time: '11:20',
    name: 'AI训练',
    user: '用户11',
    area: '广东'
  },
  {
    date: '05-23',
    time: '11:20',
    name: 'AI训练',
    user: '用户11',
    area: '广东'
  },
  {
    date: '05-23',
    time: '11:20',
    name: 'AI训练',
    user: '用户11',
    area: '广东'
  },
  {
    date: '05-23',
    time: '11:20',
    name: 'AI训练',
    user: '用户11',
    area: '广东'
  },
  {
    date: '05-23',
    time: '11:20',
    name: 'AI训练',
    user: '用户11',
    area: '广东'
  },
  {
    date: '05-23',
    time: '11:20',
    name: 'AI训练',
    user: '用户11',
    area: '广东'
  },
]
</script>

<style scoped>
.layout-container {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-areas:
    "left right";
  gap: 20px;
  height: 100%;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.Map .Counter {
  position: absolute;
  bottom: 20px;
  left: 10px;
  width: 180px;
  height: 90px;
  border-radius: 8px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 5px;

}

.CounterTitle{
  height: 20px;
  font-weight: bold;
  font-style: italic;
  background: linear-gradient(to right,#2193b0,#6a5acd,#ff6347);
  -webkit-background-clip: text;
  color: transparent;

  backdrop-filter: blur(10px);
  border-radius: 4px;
}
.CounterValue{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap:3px;
}
.number {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 25px;
  height: 40px;
  font-size: 20px;
  border-radius: 4px;
  font-weight: bold;
  color: #2193b0;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
.CounterProgress{
  height: 15px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 4px;
}
.el-radio-button {
  border: none !important; /* 使用important确保覆盖原有样式 */
}

.custom-button {
  background-image: linear-gradient(to right, #6dd5ed, #2193b0);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 添加轻微阴影效果 */
  font-size: 14px;
}

.custom-button:hover {
  background-image: linear-gradient(to right, #6dd5ed, #2193b0);
  opacity: 0.8;
}

.custom-button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(33, 147, 176, 0.8); /* 聚焦时的光晕效果 */
}

.title-left {
  display: flex;
  align-items: center;
}
.logo {
  width: 64px;
  height: 64px;
  margin-left: -5px;
  cursor: pointer;
}
h2 {
  color: black;
  font-size: 36px;
}
.title-right {
  display: flex;
  align-items: center;
}
.BarChart {
  grid-area: left;
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 7px;
}

.BarChart .card {
  background-color: #FFFFFF;
  height: 359px;
  margin-left: 10px;
  text-align: center;
  margin-top: 5px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* 添加外部阴影 */
}

.right {
  grid-area: right;
  display: grid;
  grid-template-rows: 4fr 1fr;
  gap: 3px;
}

.DataCard {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
}

.progress-card1 {
  background-color: #FFFFFF;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* 添加外部阴影 */
}

.progress-card2 {
  background-color: #FFFFFF;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* 添加外部阴影 */
}

.progress-card3 {
  background-color: #FFFFFF;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* 添加外部阴影 */
}

.progress-card4 {
  background-color: #FFFFFF;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* 添加外部阴影 */
}


.MapCardButtonMessage {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 10px;
}

.MapCardButtonMessage .LineChart {
  background-color: #FFFFFF;
  height: 282px;
  margin-top: 5px;
  text-align: center;
  border-radius: 8px;
  margin-right: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* 添加外部阴影 */
}

.MapCardButtonMessage .Message {
  background-color: #FFFFFF;
  height: 281px;
  margin-top: 12px;
  text-align: center;
  border-radius: 8px;
  margin-right: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* 添加外部阴影 */
}
.log{
  overflow-y: auto;
  overflow-x: hidden;
}
.title{
  margin-top: 5px;
}
.RadioButton {
  background-color: #FFFFFF;
  height: 49px;
  margin-top: 5px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* 添加外部阴影 */
  display: flex;
  align-items: center;
}

.Map {
  background-color: #FFFFFF;
  border-radius: 8px;
  border-width: 2px;
  border-color: black;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* 添加外部阴影 */
  height: 512px;
  margin-top: 12px;
  text-align: center;
  position: relative; /* 让计数器在Map区域内定位 */
}
.apiNum{
  display: grid;
  grid-template-rows: auto auto;
}
</style>
