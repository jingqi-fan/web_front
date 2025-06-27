<template>
  <div>
    <el-tabs v-model="activeTab" stretch style="width: 100%;">
      <el-tab-pane label="信用分变化折线图" name="credit" />
      <el-tab-pane label="消费折线图" name="consume" />
    </el-tabs>
    <div ref="chartRef" style="height: 400px; width: 100%; padding: 10px;" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const activeTab = ref('credit')
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const fetchData = async (): Promise<{ date: string; value: number }[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (activeTab.value === 'credit') {
        resolve([
          { date: '1月', value: 650 },
          { date: '2月', value: 670 },
          { date: '3月', value: 690 },
          { date: '4月', value: 710 },
          { date: '5月', value: 740 },
        ])
      } else {
        resolve([
          { date: '1月', value: 1200 },
          { date: '2月', value: 1800 },
          { date: '3月', value: 1400 },
          { date: '4月', value: 2000 },
          { date: '5月', value: 1700 },
        ])
      }
    }, 500)
  })
}

const renderChart = async () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.showLoading()

  const data = await fetchData()
  chartInstance.hideLoading()

  const option = {
    title: {
      text: activeTab.value === 'credit' ? '信用分变化' : '消费变化'
    },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.map(d => d.date) },
    yAxis: { type: 'value' },
    series: [
      {
        data: data.map(d => d.value),
        type: 'line',
        smooth: true,
        areaStyle: activeTab.value === 'consume' ? {} : undefined
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(() => nextTick(() => renderChart()))
watch(activeTab, () => nextTick(() => renderChart()))
</script>
