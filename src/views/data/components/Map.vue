<template>
  <div class="mt-4" style="height: 10px">
    <el-input
        v-model="searchKeyword"
        style="width: 100%"
        placeholder="请输入关键字"
        class="input-with-select"
    >
      <template #prepend>
        <el-select v-model="server" placeholder="服务器位置" style="width: 115px">
          <el-option
              v-for="item in ServerAdderList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </template>
      <template #append>
        <el-button
            :icon="Search"
            @click="onSearch"
            style="margin-right: 20px; background-color: #87CEFA; color: black; border-color: #87CEFA;" />
        <el-button
            :icon="Close"
            @click="clearSearch"
            style="background-color: #D8B7DD; color: black; border-color: #D8B7DD;" />
      </template>
    </el-input>
  </div>

  <div id="container">
    <div id="panel" class="search-panel"></div>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, onUnmounted, ref, watch, defineExpose } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { Close, Search } from "@element-plus/icons-vue";
import { GaoDeConfig } from "../../../mock/apiKey.ts";
import { ElMessage } from "element-plus";

let map = null;
let placeSearch = null;
const searchKeyword = ref('');
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
    plugins: ["AMap.Scale", "AMap.PlaceSearch"],
  })
      .then((AMap) => {
        map = new AMap.Map("container", {
          resizeEnable: true,
          viewModel: '3D',
          mapStyle: "amap://styles/macaron",
          center: [103.847, 36.042], // 中国大致的中心点坐标
          zoom: 3, // 一个合适的缩放级别以显示整个国家
        });

        placeSearch = new AMap.PlaceSearch({
          pageSize: 5,
          pageIndex: 1,
          citylimit: false,
          map: map,
          panel: "panel", // 结果面板容器
          autoFitView: true,
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

onMounted(() => {
  initializeMap();
});
const onSearch = () => {
  if (placeSearch && searchKeyword.value) {
    placeSearch.search(searchKeyword.value, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        const filter = result.poiList.pois;
        for (let i = 0; i < filter.length; i++) {
          let flag = false;
          for (let j = 0; j < ServerAdderList.value.length; j++) {
            if (filter[i].name == ServerAdderList.value[j].value) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            result.poiList.pois = result.poiList.pois.filter((poi) => poi !== filter[i]);
          }
        }
        if (result.poiList.pois.length == 0) {
          ElMessage.warning("不存在该服务器中心");
          return;
        }
        document.getElementById('panel')!.style.display = 'block';
      }
    });
  }
};

const clearSearch = () => {
  if (placeSearch) {
    placeSearch.clear();  // 清除搜索结果
  }
  if (map) {
    map.setZoom(3);  // 重置缩放级别
    map.setCenter([103.847, 36.042]);  // 重置中心
  }
  searchKeyword.value = '';
  server.value = '';
  document.getElementById('panel')!.style.display = 'none'; // 清除后隐藏面板
};

watch(server, (newServer) => {
  searchKeyword.value = newServer;
  onSearch();
});

onUnmounted(() => {
  if (map) {
    map.destroy();
  }
});
// 提供给外部调用的初始化方法
defineExpose({
  initializeMap,
  onSearch,
  clearSearch,
  searchKeyword,
  server
});
</script>



<style scoped>
#container {
  width: 100%;
  margin-top: 22px;
  height: 480px;
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
  z-index: 1000;  /* 添加 z-index 确保面板层级高于地图 */
}

</style>

