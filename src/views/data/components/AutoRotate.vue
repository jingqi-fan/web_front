<template>
  <div class="carousel">
    <div class="circle">
      <!-- 中心数字 -->
      <div class="center-number">{{ items[activeIndex].title }}</div>

      <!-- Lottie 动画 -->
      <div class="lottie-container" ref="AreaServerContainer"></div>

      <!-- 光效 -->
      <svg class="light-effect" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="light-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(0, 212, 255, 0.7)" />
            <stop offset="100%" stop-color="rgba(0, 212, 255, 0)" />
          </radialGradient>
        </defs>
        <!-- 扇形光：从下向上 -->
        <path
            d="M100,200 L20,100 A100,100 0 0,1 160,100 Z"
            fill="url(#light-gradient)"
        />
      </svg>

      <!-- 动态展示的数据项 -->
      <div
          v-for="(item, index) in items"
          :key="item.id"
          class="item"
          :class="{ active: index === activeIndex, side: isSide(index), back: isBack(index) }"
          :style="getItemStyle(index)"
      >
        <div class="content">
          <div class="label">{{ item.name }}</div>
          <div class="value">{{ item.value }}（{{item.nickname}}）</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import lottie from "lottie-web"; // 引入 lottie-web

// 模拟数据
const items = ref([
  { id: 1, name: "总信用分", value: 2301,title:"信用楷模",nickname:"Alice" },  //总信用分最高
  { id: 2, name: "信用商业", value: 1298,title:"诚信领袖",nickname:"Kyson" },  //信用商业部分得分最高
  { id: 3, name: "信用生活", value: 1324,title: "守信模范",nickname:"Zachary" }, //信用生活部分得分最高
  { id: 4, name: "亲社会行为", value: 793,title:"公益先锋",nickname:"God" },  //亲社会行为得分最高
  { id: 5, name: "基本信息", value: 692,title: "信用磐石",nickname:"Bolulu" }         //基本信息评估信用分得分最高
]);

const activeIndex = ref(0); // 当前激活的索引
const totalItems = computed(() => items.value.length);

// 切换到下一个索引
const nextIndex = () => {
  activeIndex.value = (activeIndex.value + 1) % totalItems.value;
};

// 判断数据项状态
const isSide = (index: number) => {
  const diff = (index - activeIndex.value + totalItems.value) % totalItems.value;
  return diff === 1 || diff === totalItems.value - 1; // 左右两侧
};

const isBack = (index: number) => {
  const diff = (index - activeIndex.value + totalItems.value) % totalItems.value;
  return diff >= Math.floor(totalItems.value / 2); // 后方镜像部分
};

// 动态计算样式
const getItemStyle = (index: number) => {
  const position = (index - activeIndex.value + totalItems.value) % totalItems.value;
  const angle = position * (360 / totalItems.value);

  // 这里增加 translateZ 的值让数据项离中心点更远
  return {
    transform: `rotateY(${angle}deg) translateZ(120px)`, // 原本为 80px，改为 120px
    zIndex: position === 0 ? 10 : position === 1 || position === totalItems.value - 1 ? 5 : 1, // 层级控制
    opacity:
        position === 0
            ? 1
            : position === 1 || position === totalItems.value - 1
                ? 0.7
                : 0.3, // 透明度规则
    transition: "transform 0.8s ease-in-out, opacity 0.8s ease-in-out",
  };
};
const AreaServerContainer = ref(null);
// 定时器实现轮播
onMounted(() => {
  setInterval(nextIndex, 2000);

  lottie.loadAnimation({
    container: AreaServerContainer.value!, // 绑定的 DOM 容器
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: new URL('@/assets/AreaServer1.json', import.meta.url).href, // 替换为你的 JSON 文件路径
  });
});
</script>

<style scoped>
.carousel {
  position: relative;
  width: 144px;
  height: 280px;
  perspective: 800px; /* 调整透视效果，适配新尺寸 */
}

.circle {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateX(-10deg); /* 调整视角到前上方，适配新容器比例 */
}

.center-number {
  position: absolute;
  top: 20%;
  left: 130%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  font-weight: bold;
  color: #00d4ff;
  z-index: 20;
}

.lottie-container {
  position: absolute;
  top: 30%; /* 调整动画在中心点偏下位置 */
  left: 130%;
  transform: translate(-50%, 0);
  width: 250px;
  height: 250px;
  z-index: 15;
}

/* 光效 */
.light-effect {
  position: absolute;
  top: 50%; /* 调整光效位置 */
  left: 130%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  z-index: 10;
  opacity: 0.8;
  animation: vertical-glow 2s infinite;
}

@keyframes vertical-glow {
  0% {
    transform: translate(-50%, -45%) scale(1); /* 向上轻微偏移 */
    opacity: 0.7;
  }
  50% {
    transform: translate(-50%, -55%) scale(1.1); /* 向下轻微偏移并放大 */
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -45%) scale(1);
    opacity: 0.7;
  }
}

.item {
  position: absolute;
  top: 30%;
  left: 90%;
  width: 100px;
  height: 60px;
  background: rgba(0, 212, 255, 0.2);
  border: 1px solid #00d4ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transform-style: preserve-3d;
}

.item.active {
  background: rgba(0, 212, 255, 0.5);
}

.content {
  text-align: center;
}

.label {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 2px;
}

.value {
  font-size: 10px;
}

.item.side {
  opacity: 0.7;
}

.item.back {
  opacity: 0.3;
  transform: scale(-1, 1); /* 镜像效果 */
}
</style>
