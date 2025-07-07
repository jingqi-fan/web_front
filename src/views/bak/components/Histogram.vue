<template>
  <div ref="chartContainer" style="width: 320px; height: 180px;"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, defineProps } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册 ECharts 必须组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, BarChart, LineChart, CanvasRenderer]);

// 接收父组件传递的 props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  xAxisData: {
    type: Array,
    required: true
  },
  yAxisData: {
    type: Array,
    required: true
  }
});

const chartContainer = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 渲染图表
const renderChart = () => {
  if (!chartContainer.value) return;

  if (!chartInstance) {
    chartInstance = echarts.init(chartContainer.value);
  }

  const option = {
    title: {
      text: props.title,
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      top: '20%',
      left: '10%',
      right: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: props.xAxisData,
      axisLabel: {
        interval: Math.ceil(props.xAxisData.length / 6), // 自动隔几个显示一个
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '频率'
    },
    series: [
      {
        name: '频率',
        type: 'bar',
        data: props.yAxisData,
        barWidth: '50%',
        itemStyle: { color: '#5470C6' }
      },
      {
        name: '平滑曲线',
        type: 'line',
        data: props.yAxisData, // 使用相同的 y 数据
        smooth: true, // 平滑连接
        lineStyle: { color: '#FF5733', width: 2 }
      }
    ]
  };

  chartInstance.setOption(option);
};

// 销毁图表实例
const destroyChart = () => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
};

// 初始化和销毁图表
onMounted(renderChart);
onUnmounted(destroyChart);
</script>

<style scoped>
</style>
