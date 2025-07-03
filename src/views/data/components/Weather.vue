<template>
  <div class="weather-widget">
    <div class="weather-info">
      <div class="temperature">
        <span>{{ temperature }}°C</span>
      </div>
      <div class="weather-details">
        <span>{{ weatherDescription }}</span>
        <span>{{ city }}</span>
      </div>
    </div>
    <div class="weather-icon">
      <img :src="Rain" alt="weather icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 模拟天气数据
const city = ref("杭州");
const temperature = ref(26);
const weatherDescription = ref("多云");
const iconUrl = ref(Rain); // 假设是一个天气图标链接
import Rain from "../weather_icon/晴.png"
onMounted(() => {
  // 模拟数据获取，3秒后更新数据
  setTimeout(() => {
    temperature.value = 28; // 模拟温度
    weatherDescription.value = "晴 ";

    city.value = "杭州市";
  }, 200);
});
</script>

<style scoped>
.weather-widget {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  width: 100%;
  margin-left: 50px;
  max-width: 600px;
  height: 67px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.weather-info {
  flex: 1;
  padding-left: 10px;
}

.temperature {
  font-size: 24px;
  font-weight: bold;
  color: #1a56db;
}

.weather-details {
  font-size: 14px;
  color: #64748b;
}

.weather-icon {
  margin-left: 20px;
}

.weather-icon img {
  width: 40px;
  height: 40px;
}
</style>
