<template>
  <div ref="gaugeChart" class="gauge-container" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{ creditScore: number }>()

const gaugeChart = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const getColor = (score: number): string => {
  if (score < 500) return '#F56C6C'
  if (score < 550) return '#E6A23C'
  if (score < 650) return '#409EFF'
  return '#67C23A'
}

const renderGauge = () => {
  if (!gaugeChart.value) return
  if (!chartInstance) {
    chartInstance = echarts.init(gaugeChart.value)
  } else {
    chartInstance.clear()
  }

  const valueRatio = props.creditScore / 1000
  const color = getColor(props.creditScore)

  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 225,
        endAngle: -45,
        min: 0,
        max: 1000,
        radius: '100%',
        progress: {
          show: true,
          width: 10,
          roundCap: true,
          itemStyle: {
            color
          }
        },
        axisLine: {
          lineStyle: {
            width: 10,
            color: [[valueRatio, color], [1, '#e0e0e0']]
          }
        },
        pointer: {
          itemStyle: {
            color: '#606266'
          },
          width: 4,
          length: '70%'
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 10,
          lineStyle: {
            width: 1,
            color: '#999'
          }
        },
        axisLabel: {
          distance: 10,
          color: '#666',
          fontSize: 10
        },
        detail: {
          valueAnimation: true,
          formatter: `{value}`,
          color,
          fontSize: 18,
          offsetCenter: [0, '55%']
        },
        data: [{ value: props.creditScore }]
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(() => renderGauge())
watch(() => props.creditScore, () => renderGauge())
onBeforeUnmount(() => chartInstance?.dispose())
</script>

<style scoped>
.gauge-container {
  width: 90%;
  height: 210px;
}
</style>
