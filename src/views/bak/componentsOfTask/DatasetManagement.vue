<template>
  <div class="background">
    <div>
      <h1 style="text-align: center;
                font-weight: bold;
                font-style: italic;
                font-size: 36px"
      >
        AutoMonitor——异常检测数据集中心
      </h1>
    </div>
    <div class="mt-4" style="text-align: center">
      <el-input
          v-model="searchKeyword"
          style="width: 70%;"
          placeholder="请输入关键词搜索"
          class="input-with-select"
      >
        <template #append>
          <el-button @click="onSearch" :icon="Search" />
        </template>
      </el-input>
      <!--结果之后-->
      <el-button style="margin-left: 5px" :icon="Back" type="info" v-if="isSearch" @click="resetSearch" plain>返回</el-button>

      <el-select v-if="!isSearch" v-model="selectClass" placeholder="类别" style="width: 115px">
        <el-option label="全部" value="1" />
        <el-option label="AI训练" value="2" />
        <el-option label="办公行为" value="3" />
        <el-option label="流量分析" value="4" />
        <el-option label="攻击预防" value="5" />
      </el-select>
      <el-select v-if="!isSearch" v-model="selectFormat" placeholder="格式" style="width: 115px">
        <el-option label="全部" value="1" />
        <el-option label="CSV" value="2" />
        <el-option label="Parquet" value="3" />
      </el-select>
    </div>
    <div v-if="!isSearch" class="card">
      <!--数据集数量-->
      <div class="dataset-number">
        <div class="number-icon">
          <number-icon/>
        </div>
        <div class="number-content">
          <el-text type="info" style="font-size: 26px;font-family: 'SimSun', serif;">公开数据集数量：</el-text>
          <el-text type="primary" style="font-size: 38px;font-weight: bold;font-family: 'SimSun', serif;">11302</el-text>
          <el-text type="success" style="font-size:28px;font-family: 'SimSun', serif;">+113（new publish）</el-text>
        </div>
      </div>
      <!--数据集类别-->
      <div class="dataset-class">
        <div class="class-icon">
          <el-text type="info" style="font-size: 22px; color: black; font-weight: bold; font-family: 'SimSun', serif;">
            类别数: {{ progressData.length }}
          </el-text>
          <class-icon style="margin-top: 20px"/>
        </div>
        <div class="class-content" @click="onViewAll">
          <div
              v-for="(progress, index) in progressData"
              :key="index"
              class="progress-item"
              style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
          >
            <span style="font-size: 20px; color: black; font-weight: bold; font-family: 'SimSun', serif;">{{ progress.name }}：</span>
            <el-progress
                :percentage="progress.percentage"
                :format="format"
                :color="progress.color"
                style="width: 80%; "
                :text-inside="true"
                :stroke-width="15"
            >
            </el-progress>
          </div>
        </div>

      </div>
      <!--贡献者-->
      <div class="contributor">
        <div class="contributor-icon">
          <el-text type="info" style="font-size: 22px; color: black; font-weight: bold; font-family: 'SimSun', serif;">
            贡献者: {{ progressData.length }}
          </el-text>
          <contributor-icon style="margin-top: 20px"/>
        </div>
        <div class="contributor-content">
          <div class="avatar-container">
            <div
                v-for="(contributor, index) in contributors"
                :key="index"
                class="avatar-item"
            >
              <el-avatar style="" :size="50" :src="contributor.avatarUrl" @click="visitContributor(contributor.avatarUrl)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--按钮-->
    <div v-if="!isSearch" class="button">
      <el-button style="margin-right: 30px" type="success" plain>查看所有数据集</el-button>
      <el-button type="primary" plain>查看我的数据集</el-button>
    </div>
    <!--搜索结果-->
    <div v-if="isSearch" class="search-result">
      <div class="result-button">
        <el-text style="font-size: 16px;color: black;">类别</el-text>
        <el-radio-group style="margin-left: 20px" v-model="radio">
          <el-radio size="small" :value="0">全部</el-radio>
          <el-radio size="small" :value="1">AI训练</el-radio>
          <el-radio size="small" :value="2">流量分析</el-radio>
          <el-radio size="small" :value="3">办公助手</el-radio>
        </el-radio-group>

      </div>
      <div class="result-button">
        <el-text style="font-size: 16px;color: black;">格式</el-text>
        <el-radio-group style="margin-left: 20px" v-model="radio1">
          <el-radio size="small" :value="0">全部</el-radio>
          <el-radio size="small" :value="1">CSV</el-radio>
          <el-radio size="small" :value="2">Parquet</el-radio>
        </el-radio-group>
      </div>
      <div class="result-list">
        <el-card

            style="width: 280px;height: 180px;"
            v-for="(item, index) in progressData"
        >
          <template #header>
            <div class="card-header">
              <span>{{item.name}}</span>
            </div>
          </template>
          <el-avatar :size="30" :src="url">
          </el-avatar>
          <template #footer>
            <el-button style="margin-bottom: 15px;margin-left: 40px" size="small" type="success" @click="checkResult(index)" plain>查看</el-button>
            <el-button style="margin-bottom: 15px;margin-left: 30px" size="small" type="danger" @click="deleteResult(index)" plain>删除</el-button>
          </template>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {Back, Search} from "@element-plus/icons-vue";
import {ref} from "vue";
import NumberIcon from "@/pages/creator/Icon/NumberIcon.svg"
import ClassIcon from "@/pages/creator/Icon/ClassIcon.svg"
import ContributorIcon from "@/pages/creator/Icon/ContributorIcon.svg"
import {ElMessage, ElMessageBox} from "element-plus";
import router from "@/router";
const searchKeyword = ref('')

const selectClass = ref('')
const selectFormat = ref('')

const progressData = ref([
  { id:1, percentage: 10.2, name: "训练", color: "#409EFF" },
  { id:2, percentage: 30.4, name: "行为", color: "#67C23A" },
  { id:3, percentage: 21.9, name: "分析", color: "#E6A23C" },
  { id:4, percentage: 27.8, name: "预防", color: "#F56C6C" },
  { id:5, percentage: 9.7, name: "其他", color: "#909399" },
]);
const url="https://img0.baidu.com/it/u=4250781143,740449692&fm=253&fmt=auto&app=138&f=JPEG?w=792&h=500"
const contributors = ref([
  { id: 1, avatarUrl: url },
  { id: 2, avatarUrl: url },
  { id: 3, avatarUrl: url },
  { id: 4, avatarUrl: url },
  { id: 5, avatarUrl: url },
  { id: 6, avatarUrl: url },
  { id: 7, avatarUrl: url },
  { id: 8, avatarUrl: url },
  { id: 9, avatarUrl: url },
  { id: 10, avatarUrl: url },
  { id: 11, avatarUrl: url },
  { id: 12, avatarUrl: url },
  { id: 13, avatarUrl: url },
  { id: 14, avatarUrl: url },
  { id: 15, avatarUrl: url },
  { id: 16, avatarUrl: url },
  { id: 17, avatarUrl: url },
  { id: 18, avatarUrl: url },
  { id: 19, avatarUrl: url },
  { id: 20, avatarUrl: url },
  { id: 21, avatarUrl: url },
  { id: 22, avatarUrl: url },
  { id: 23, avatarUrl: url },
  { id: 24, avatarUrl: url },
  { id: 25, avatarUrl: url },
  { id: 26, avatarUrl: url },
  { id: 27, avatarUrl: url },
  { id: 28, avatarUrl: url },
  { id: 29, avatarUrl: url },
  { id: 30, avatarUrl: url },
]);
const format = (percentage) => `${percentage}%`;

const onViewAll = () => {
  alert("点击查看所有进度条内容！");
};
const visitContributor=(url:string)=>{
  window.open(url)
}
const isSearch=ref(false)
const resetSearch=()=>{
  isSearch.value=!isSearch.value;
}
const onSearch = () => {
  isSearch.value=true
  // 搜索数据: （类别:1全部,2AI训练,3办公行为,4流量分析,5攻击预防）(格式: 1全部,2CSV,3Parquet)
  // 若 selectClass.value='' or selectFormat.value='' , 则设置为全部进行搜索
};

import useDatasetStore from "@/store/system/useDatasetStore.ts";
const datasetStore=useDatasetStore()
const checkResult=(index:number)=>{
  datasetStore.setData(progressData.value[index])
  router.push(`/creator/task/dataset/${index}`)
}
const deleteResult=(index:number)=>{
  ElMessageBox.confirm(
      '是否确认删除：'+progressData.value[index].name,
      '删除',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        // TODO 删除逻辑
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消',
        })
      })
}

const radio=ref(0)
const radio1=ref(0)
</script>

<style scoped>
.background{

}
.card{
  margin-top: 80px;
  height: 240px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}
.dataset-number{
  display:grid;
  grid-template-columns: 110px 1fr;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid #f0f0f0;
  align-items: center;
  text-align: center;
}
.number-icon{
  margin-left: 10px;
}
.number-content{
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 30px;
}
.dataset-class{
  display:grid;
  grid-template-columns: 110px 1fr;
  border-radius: 8px;
  gap:20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid #f0f0f0;
  align-items: center;
  text-align: center;
}
.class-content {
  max-height: 220px;
  overflow-y: auto;
  cursor: pointer;
}

.progress-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.class-content:hover {
  background-color: #fffff9;
}
.class-content .el-progress--line {
  margin-top: 20px;
  margin-bottom: 15px;
  max-width: 400px;
}

.contributor{
  display:grid;
  grid-template-columns: 110px 1fr;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid #f0f0f0;
  align-items: center;
  text-align: center;
}
.contributor-content{
  height: 220px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  flex-wrap: wrap;
  overflow-y: auto;
  overflow-x: hidden;
}
.avatar-container{
  display: flex;
  flex-wrap: wrap;
  gap:5px;
  height: 80%;
  width: 80%;
  margin-left: 25px;
}
.avatar-item{
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.button{
  margin-top: 60px;
  align-items: center;
  text-align: center;
}

.search-result{
  display: grid;
  grid-template-rows: 20px 20px 1fr;
  gap:20px;
}
.result-button{
  margin-top: 20px;
  margin-left: 150px;
}
.result-list {
  width: 1160px;
  height: 480px;
  margin-top: 10px;
  border-radius: 8px;
  margin-left: 60px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 10px;
  padding: 0;
}
</style>
