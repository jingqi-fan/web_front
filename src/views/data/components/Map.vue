<template>
  <div id="container">
    <div id="panel" class="search-panel"></div>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, onUnmounted, ref, watch, defineExpose } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { Close, Search } from "@element-plus/icons-vue";
import { GaoDeConfig } from "@/mock/apiKey.ts";
import { ElMessage } from "element-plus";

let map = null;
const server = ref('');
const markers = ref<AMap.Marker[]>([]);
// 接收父组件传递的数据
const props = defineProps<{
  ServerAdderList: Array<{ longitude: number, latitude: number, label: string, value: string }>;
}>();
// 提取初始化逻辑为一个方法
const initializeMap = () => {
  if (map!=null) {
    map.destroy();
    markers.value.forEach(marker => marker.setMap(null));
    markers.value = [];
  }
  window._AMapSecurityConfig = {
    securityJsCode: GaoDeConfig.securityJsCode,
  };

  AMapLoader.load({
    key: GaoDeConfig.key,
    version: "2.0",
    plugins: ["AMap.Scale", "AMap.DistrictSearch"],
  })
      .then((AMap) => {
        map = new AMap.Map("container", {
          resizeEnable: true,
          viewModel: '3D',
          mapStyle: "amap://styles/darkblue",
          center: [120.15507, 30.27415], // 杭州中心
          zoom: 10, // 推荐 zoom 级别 11~13 显示市区
        });

        props.ServerAdderList.forEach((location) => {
          const marker = new AMap.Marker({
            position: new AMap.LngLat(location.longitude, location.latitude),
            title: location.title,
            map: map,
            label: {
              content: location.label, // 显示序号
              offset: new AMap.Pixel(20, 20), // 调整标记的偏移量
              style: {
                color: '#ffffff',
                backgroundColor: '#ff5722',
                borderRadius: '50%',
                padding: '3px 6px',
                fontSize: '14px',
              },
            },
          });

          marker.on('click', () => {
            map.setCenter([location.longitude, location.latitude]);
          });

          markers.value.push(marker);
        });
      })
      .catch((e) => {
        console.log(e);
      });
};
// 子组件 mapComponent.vue 中添加：
const focusOnLocation = (location: { longitude: number, latitude: number, label: string }) => {
  // 清除所有已有 marker
  markers.value.forEach(marker => marker.setMap(null));
  markers.value = [];

  const marker = new AMap.Marker({
    position: new AMap.LngLat(location.longitude, location.latitude),
    title: location.label,
    map: map,
    label: {
      content: location.label,
      offset: new AMap.Pixel(20, 20),
      style: {
        color: '#fff',
        backgroundColor: '#007BFF',
        borderRadius: '4px',
        padding: '2px 6px',
        fontSize: '13px',
      },
    },
  });

  markers.value.push(marker);
  map.setZoom(13); // 适当放大视图
  map.setCenter([location.longitude, location.latitude]);
};
onMounted(() => {
  initializeMap();
});

watch(server, (newServer) => {
  searchKeyword.value = newServer;
  onSearch();
});

onUnmounted(() => {
  if (map) {
    map.destroy();
  }
});
// 向外暴露
defineExpose({
  initializeMap,
  focusOnLocation,
});
</script>


<style scoped>
#container {
  width: 100%;
  height: 720px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  position: relative; /* 使地图容器相对定位 */
}

.search-panel {
  position: absolute;
  background-color: white;
  max-height: 70%;
  overflow-y: auto;
  top: 50px;
  right: 10px;
  width: 200px;
  transform: translateY(0%);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
  padding: 10px;
  display: none;
  z-index: 1000; /* 添加 z-index 确保面板层级高于地图 */
}

</style>

