<template>
  <el-container style="height: 100vh; width: 100vw;margin: -8px -8px -8px -8px">
    <el-header
        style="position: fixed;
         top: 0;
         left: 0;
         right: 0;
         height: 90px;
         z-index: 1000;
         background-color: #f5f5f5;
         color: white;
         padding: 0 20px;
         border-radius: 8px;
         box-shadow: 0 4px 20px rgba(0, 0, 139, 0.5);
         display: flex;
         justify-content: space-between;">
      <div class="title-left">
        <logo style="margin-left: 20px; cursor: pointer;" @click="goToHome" />

        <div class="credit-life-title">
          <div class="main-title">数据监控中心<div class="title-decoration"></div></div>
          <div class="subtitle">信用城市可视化大屏</div>
        </div>
      </div>
      <weather/>
      <div class="title-right">
        <el-button @click="goToExamineAndApprove" class="custom-button">审批中心</el-button>
        <el-button @click="goToRelease" class="custom-button">发布中心</el-button>
        <el-button @click="personalCenter" class="custom-button" :icon="User" plain round></el-button>
        <el-button @click="backUp" class="custom-button" :icon="Back" plain>返回</el-button>
      </div>
    </el-header>

    <el-main style="padding-top: 95px; height: calc(100vh - 95px); position: relative;">
      <!-- 地图背景组件，放最底层 -->
<!--      <mapComponent-->
<!--          :ServerAdderList="GetServerList()"-->
<!--          ref="myMap"-->
<!--          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;"-->
<!--      />-->
      <!-- 内容层 -->
      <div class="layout-container" style="position: relative; z-index: 1;">
        <!-- 柱形图区域 -->
        <div class="BarChart">
          <div class="card">
            <p>各项服务授信额度</p>
            <v-chart :option="creditOption" autoresize style="height: 260px;margin-top: -50px" />
          </div>
          <div class="card">
            <div class="title">
              <p>周服务开通及使用人数</p>
              <v-chart :option="openUserOption" autoresize style="height: 250px;margin-top: -50px" />
            </div>
          </div>

          <div class="card">
            <p>各地信用分分布</p>
            <v-chart :option="scoreOption" autoresize style="height: 250px;margin-top: -50px" />
          </div>
        </div>

        <!-- 右侧区域 -->
        <div class="right">
          <div class="MapCardButtonMessage">
            <div class="MapButton">
              <!-- 按钮 -->
              <div class="RadioButton">
                <el-select
                    v-model="value"
                    placeholder="选择辖区"
                    size=""
                    style="width: 240px"
                >
                  <el-option
                      v-for="item in main_city"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>

              </div>

              <!-- 地图相关展示 -->
              <div class="Map" style="background-color: transparent !important;">
                <!-- 背景透明，显示地图 -->
                <div class="Counter">
                  <div class="CounterTitle">西湖分 Credit 用户量</div>
                  <div class="CounterValue">
                    <div class="number">2</div>
                    <div class="number">1</div>
                    <div class="number">3</div>
                    <div class="number">1</div>
                    <div class="number">8</div>
                  </div>
                  <div class="CounterProgress">
                    <el-progress
                        :percentage="76"
                        status="success"
                        :duration="5"
                        style="margin-right: -30px"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 折线图、实时消息 -->
            <div class="LineChartMessage">
              <div class="LineChart">
                <area-info />
              </div>
              <div class="Message">
                <h3>API调用日志</h3>
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

          <div class="DataCard">
            <div class="progress-card1"></div>
            <div class="progress-card2">
              <p>各项服务授信额度</p>
            </div>
            <div class="progress-card3"></div>
            <div class="progress-card4">
              <p>各地区收入情况</p>
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
import {ElMessage} from "element-plus";
import Logo from "@/views/personal/component/Logo.vue";
import Weather from "@/views/data/components/Weather.vue";
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

const goToExamineAndApprove=()=>{
  ElMessage.info("审批中心 正在开发中")

}
const goToRelease=()=>{
  router.push("/manager/manager");
}


const AvatarUrl="https://img2.baidu.com/it/u=2886770170,3832974539&fm=253&fmt=auto&app=138&f=JPEG?w=377&h=377";
//const standard=rankingData.value[0]
const rankingData=ref([
  {id:1,url:AvatarUrl,apiNumber:89543},
  {id:2,url:AvatarUrl,apiNumber: 48712},
  {id:3,url:AvatarUrl,apiNumber:8943},
  {id:4,url:AvatarUrl,apiNumber:8343},
])

const value = ref('请选择地区')
const main_city = [
  {
    value: '全部',
    label: '全部',
  },
  {
    value: '上城区',
    label: '上城区',
  },
  {
    value: '拱墅区',
    label: '拱墅区',
  },
  {
    value: '西湖区',
    label: '西湖区',
  },
  {
    value: '滨江区',
    label: '滨江区',
  },
  {
    value: '萧山区',
    label: '萧山区',
  },
  {
    value: '钱塘区',
    label: '钱塘区',
  },
  {
    value: '临平区',
    label: '临平区',
  },
  {
    value: '余杭区',
    label: '余杭区',
  },
  {
    value: '富阳区',
    label: '富阳区',
  },
  {
    value: '临安区',
    label: '临安区',
  }
]


const serverList = ref([
  { longitude: 120.20, latitude: 30.23, label: '上城区', value: '杭州市·上城区' },
    //,
  { longitude: 120.14, latitude: 30.32, label: '拱墅区', value: '杭州市·拱墅区' },
    //,
  { longitude: 120.13, latitude: 30.26, label: '西湖区', value: '杭州市·西湖区' },
    //,
  { longitude: 120.21, latitude: 30.21, label: '滨江区', value: '杭州市·滨江区' },
    //,
  { longitude: 120.26, latitude: 30.18, label: '萧山区', value: '杭州市·萧山区' },
    //,
  { longitude: 119.98, latitude: 30.27, label: '余杭区', value: '杭州市·余杭区' },
    //,,,
  { longitude: 119.96, latitude: 30.05, label: '富阳区', value: '杭州市·富阳区' },
    //,
  { longitude: 120.30, latitude: 30.42, label: '临平区', value: '杭州市·临平区' },
    //,,
  { longitude: 120.49, latitude: 30.32, label: '钱塘区', value: '杭州市·钱塘区' },
    //,,
  { longitude: 119.72, latitude: 30.23, label: '临安区', value: '杭州市·临安区' },
]);

const tableData = [
]
import VChart from 'vue-echarts'

/**
 *
 */
// 服务开通人数 - 折线图
const openUserOption = ref({
  grid: {
    left: '2%',   // 增加左侧边距，避免纵坐标文字被遮挡
    containLabel: true // 确保标签也在grid区域内（可选）
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月'],
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 3000,
    interval: 500,
  },
  series: [
    {
      data: [1200, 1600, 2100, 1800, 2600, 2800],
      type: 'line',
      areaStyle: {},
      smooth: true,
    },
  ],
})

// 各项服务授信额度 - 横向柱状图
const creditOption = ref({
  grid: {
    left: '2%',   // 增加左侧边距，避免纵坐标文字被遮挡
    containLabel: true // 确保标签也在grid区域内（可选）
  },
  tooltip: {},
  xAxis: {
    type: 'value',
    max: 80000,
  },
  yAxis: {
    type: 'category',
    data: ['信用租赁', '便捷租房', '酒店预定', '便捷泊车', '舒心就医'],
    // 可考虑增加y轴标签的样式，如字体大小、边距等，确保完整显示
    axisLabel: {
      margin: 2 // 增加标签与坐标轴的距离，可选
    }
  },
  series: [
    {
      type: 'bar',
      data: [50000, 75000, 62000, 38000, 46000],
      label: {
        show: true,
        position: 'right'
      },
      itemStyle: {
        color: '#3b82f6' // 原图为多种颜色，但代码中统一为蓝色。如需按区间区分颜色，需修改此处。
      }
    },
  ],
})

// 各地信用分分布图 - 箱线图
const scoreOption = ref({
  title: {},
  tooltip: {},
  xAxis: {
    type: 'category',
    data: ['核心服务区', '拥江发展区', '城西科创区', '城北智造区', '西南生态区']
  },
  yAxis: {
    type: 'value',
    min: 300,
    max: 850
  },
  series: [
    {
      type: 'boxplot',
      data: [
        [480, 520, 620, 700, 720],
        [460, 500, 600, 660, 700],
        [500, 560, 610, 690, 740],
        [520, 580, 640, 710, 780],
        [450, 490, 550, 620, 670],
      ]
    }
  ]
})

watch(value, (newVal) => {
  if (newVal === '全部' && myMap.value?.initializeMap) {
    myMap.value.initializeMap();
    fetchTargetData('全部')
  } else {
    const target = serverList.value.find(item => item.label === newVal);
    if (target && myMap.value?.focusOnLocation) {
      myMap.value.focusOnLocation(target);
      fetchTargetData(target.value)
    }
  }
});

const fetchTargetData=async (target:string)=>{

}
// 各地区收入情况 - 柱状图
const incomeOption = ref({
  xAxis: {
    type: 'category',
    data: ['上城', '下城', '拱墅', '西湖', '滨江', '钱塘', '萧山', '余杭', '富阳', '临安'],
  },
  yAxis: {
    type: 'value',
    max: 100000,
  },
  series: [
    {
      data: [65000, 70000, 78000, 83000, 72000, 68000, 60000, 75000, 67000, 62000],
      type: 'bar',
      itemStyle: {
        color: '#67c23a'
      }
    },
  ],
})
const backUp=()=>{
  router.push('/manager')
}
const personalCenter=()=>{
  ElMessage.warning('管理员个人中心正在开发中')
}
</script>

<style scoped>
.layout-container {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-areas:
    "left right";
  gap: 10px;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
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
  display: flex;
  justify-content: space-around;
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
  font-size: 14px;
}

.custom-button:hover {
  background-image: linear-gradient(to right, #6dd5ed, #2193b0);
  opacity: 0.8;
}

.custom-button:focus {
  outline: none;
}

.title-left {
  display: flex;
  align-items: center;
}
.subtitle {
  font-size: 16px;
}
.subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
  letter-spacing: 2px;
  font-weight: 500;
  opacity: 0.9;
}
/* 响应式调整 */
@media (max-width: 768px) {
  .main-title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 11px;
  }
}
/* 悬停动画效果 */
.main-title {
  transition: all 0.3s ease;
}
.main-title {
  font-size: 44px;
  font-weight: 500;
  color: #1a56db;
  position: relative;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(26, 86, 219, 0.15);
}
.main-title:hover {
  transform: scale(1.03);
  text-shadow: 0 4px 8px rgba(26, 86, 219, 0.2);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 11px;
  }
}
.credit-life-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}
.title-decoration {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
  border-radius: 2px;
  opacity: 0.7;
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #1a56db;
  flex-grow: 1;
  text-align: center;
  margin-left: -40px; /* 平衡左右图标宽度 */
  letter-spacing: 1px;
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
  grid-template-rows: 1fr 1fr 1fr;
}

.BarChart .card {
  background-color: #FFFFFF;
  height: 220px;
  margin-top: 4px;
  margin-left: 4px;
  text-align: center;
  border-radius: 8px;
}

.right {
  grid-area: right;
  display: grid;
  grid-template-rows: 4fr 1fr;
}


.DataCard {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin-top: 2px;
  gap: 16px;
}
.progress-card1 {
  background-color: #FFFFFF;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 8px;
}

.progress-card2 {
  background-color: #FFFFFF;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 8px;
}

.progress-card3 {
  background-color: #FFFFFF;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 8px;
}

.progress-card4 {
  background-color: #FFFFFF;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 8px;
}


.MapCardButtonMessage {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 8px;
}

.MapCardButtonMessage .LineChart {
  background-color: #FFFFFF;
  height: 266px;
  margin-top: 5px;
  text-align: center;
  border-radius: 8px;
  margin-right: 10px;
}

.MapCardButtonMessage .Message {
  background-color: #FFFFFF;
  height: 282px;
  margin-top: 12px;
  text-align: center;
  border-radius: 8px;
  margin-right: 10px;
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
  display: flex;
  align-items: center;
}

.Map {
  background-color: #FFFFFF;
  border-radius: 8px;
  border-width: 2px;
  border-color: black;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* 添加外部阴影 */
  height: 510px;
  margin-top: 8px;
  text-align: center;
  position: relative;
  pointer-events: none;
}
.apiNum{
  display: grid;
  grid-template-rows: auto auto;
}
</style>
