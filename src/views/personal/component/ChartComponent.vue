<template>
  <div class="chart-wrapper">
    <ReLineChart
        :width="600"
        :height="280"
        :data="chartData"
        :margin="{ top: 5, right: 30, left: 20, bottom: 5 }"
    >
      <ReXAxis dataKey="name" />
      <ReYAxis />
      <ReTooltip />
      <ReLegend />
      <ReLine type="monotone" dataKey="裤子" stroke="#8884d8" />
      <ReLine type="monotone" dataKey="羽绒" stroke="#82ca9d" />
      <ReLine type="monotone" dataKey="健身" stroke="#ffc658" />
      <ReLine type="monotone" dataKey="图书" stroke="#ff7300" />
    </ReLineChart>
  </div>
</template>

<script setup lang="ts">
import {
  LineChart as ReLineChart,
  Line as ReLine,
  XAxis as ReXAxis,
  YAxis as ReYAxis,
  Tooltip as ReTooltip,
  Legend as ReLegend
} from 'recharts/lib'

const chartData = [
  { name: '周一', 裤子: 120, 羽绒: 200, 健身: 100, 图书: 300 },
  { name: '周二', 裤子: 90, 羽绒: 140, 健身: 80, 图书: 150 },
  { name: '周三', 裤子: 150, 羽绒: 160, 健身: 110, 图书: 220 },
  { name: '周四', 裤子: 110, 羽绒: 180, 健身: 90, 图书: 240 },
  { name: '周五', 裤子: 130, 羽绒: 170, 健身: 95, 图书: 260 },
  { name: '周六', 裤子: 95, 羽绒: 150, 健身: 75, 图书: 180 },
  { name: '周日', 裤子: 105, 羽绒: 160, 健身: 85, 图书: 210 }
]
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  overflow-x: auto;
}
</style>