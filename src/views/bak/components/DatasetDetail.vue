<template>
  <div>
    <div class="title">
      <el-text style="font-size: 30px;font-family: SimSun-ExtB,serif;color: black;">数据集名称</el-text>
      <el-button type="info" :icon="Back" style="margin-left: 1000px" @click="goBack" plain>返回</el-button>
      <br/>
      <el-tag type="primary" style="margin-left: 10px;margin-top: 15px">AI训练</el-tag>
      <el-tag type="success" style="margin-left: 20px;margin-top: 15px">CSV</el-tag>
    </div>
    <div class="content">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane style="height: 100%;width: 90%;margin-left: 30px;" label="数据集描述" name="first">
          <Editor/>
        </el-tab-pane>
        <el-tab-pane label="数据集概览" name="second">
          <div class="dataset-view">
            <!--数据字典-->
            <div class="dictionary">
              <el-text type="info" style="font-family: SimSun-ExtB,serif;font-size: 26px;color: black">数据字典</el-text>
              <br/>
              <el-table :data="tableData" style="width: 50%;height: 90%;margin-left: 20px">
                <el-table-column prop="name" label="名称" width="180" />
                <el-table-column prop="type" label="类型" width="180" />
                <el-table-column prop="example" label="示例" />
              </el-table>
            </div>
            <!--数据分布-->
            <div class="distribution">
              <el-text type="info" style="font-family: SimSun-ExtB,serif;font-size: 26px;color: black">数据分布</el-text>
              <br/>
              <div class="histograms">
                <FrequencyHistogram
                    v-for="(histogram, index) in histograms"
                    :key="index"
                    :title="histogram.title"
                    :xAxisData="histogram.xAxisData"
                    :yAxisData="histogram.yAxisData"
                />
              </div>
            </div>
          </div>

        </el-tab-pane>
        <el-tab-pane label="文件上传" name="third">
          <div class="download">
            <div class="dataset-icon">
              <csv-icon v-if="isCsv"/>
              <parquet-icon v-if="!isCsv"/>
              <el-text style="font-size: 36px;margin-left: 40px;margin-top: 20px">{{file}}</el-text>
            </div>
            <div class="dataset-description">
              <el-text>主要包含：</el-text>
              <br/>
              <el-text style="margin-left: 40px">1. 数据集csv文件</el-text>
              <br/>
              <el-text style="margin-left: 40px">2. 数据集描述文件.pdf</el-text>
            </div>
            <div class="dataset-button">
              <el-button :icon="Download" type="primary" plain>下载数据集</el-button>
              <el-button :icon="Upload" type="success" plain>重新上传</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import useDatasetStore from "@/store/system/useDatasetStore.ts";
import Editor from '@/utils/Editor.vue'
import type { TabsPaneContext } from 'element-plus'
import {Back, Download, Upload} from "@element-plus/icons-vue";
import router from "@/router";
import {onMounted, ref} from "vue";
import FrequencyHistogram from './Histogram.vue'
import CsvIcon from '@/pages/creator/Icon/CsvIcon.svg'
import ParquetIcon from '@/pages/creator/Icon/ParquetIcon.svg'
const activeName = ref('first')

const isCsv=ref(false)

const file="数据集1.csv"
function getFileExtension(fileName: string): string | undefined {
  // 使用正则表达式匹配文件名中的最后一个点（.）之后的字符串
  const match = fileName.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
  // 如果匹配成功，返回匹配到的后缀，否则返回 undefined
  return match ? match[1] : undefined;
}
onMounted(()=>{
  if(getFileExtension(file)=="csv"){
    isCsv.value = true;
  }
})

const tableData = [
  {
    name: '特征一',
    type: 'float64',
    example: '上海',
  },
  {
    name: '特征二',
    type: 'float64',
    example: '北京',
  },
  {
    name: '特征三',
    type: 'int32',
    example: '深圳',
  },
  {
    name: '特征四',
    type: 'int64',
    example: '杭州',
  },
]
// 虚拟多个直方图的数据
const histograms = [
  {
    title: "直方图1",
    xAxisData: ["区间1", "区间2", "区间3", "区间4", "区间5"],
    yAxisData: [5, 10, 15, 30, 25],
  },
  {
    title: "直方图2",
    xAxisData: ["区间1", "区间2", "区间3", "区间4", "区间5"],
    yAxisData: [10, 20, 15, 25, 30],
  },
  {
    title: "直方图3",
    xAxisData: ["区间1", "区间2", "区间3", "区间4", "区间5"],
    yAxisData: [15, 10, 25, 20, 30],
  },
  {
    title: "直方图4",
    xAxisData: ["区间1", "区间2", "区间3", "区间4", "区间5"],
    yAxisData: [10, 15, 30, 25, 20],
  },
  {
    title: "直方图5",
    xAxisData: ["区间1", "区间2", "区间3", "区间4", "区间5"],
    yAxisData: [5, 10, 15, 30, 25],
  },
  {
    title: "直方图6",
    xAxisData: ["区间1", "区间2", "区间3", "区间4", "区间5"],
    yAxisData: [10, 20, 15, 25, 30,],
  },
  {
    title: "直方图7",
    xAxisData: ["区间1", "区间2", "区间3", "区间4", "区间5"],
    yAxisData: [15, 10, 25, 20, 30],
  },
  {
    title: "直方图8",
    xAxisData: ["区间1", "区间2", "区间3", "区间4", "区间5"],
    yAxisData: [10, 15, 30, 25, 20],
  },
];

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const goBack = () => {
  router.push('/creator/task/dataset')
}
</script>

<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.title{
  height: 100px;
}
.content{
  height: 600px;
}
.dataset-view{
  display: grid;
  grid-template-rows: 300px 230px;
  gap:10px;
}
.dictionary{

}
.distribution{
  height: 220px;
  width: 1250px;
}

.histograms{
  display: flex;
  flex-direction: row;
  overflow-x: auto;
}
.dataset-icon{
  height: 120px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
}
.dataset-description{
  height: 200px;
  overflow: hidden;
  margin-left: 50px;

}
.dataset-button{
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 40px;
}
</style>