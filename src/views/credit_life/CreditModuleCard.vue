<template>
  <el-card
      shadow="hover"
      class="module-card"
      :class="cardClass"
      @click="goTo"
  >
    <div class="card-body">
      <div class="icon-wrapper">
        <!-- 使用 Emoji 图标 -->
        <span class="emoji-icon">{{ emojiIcon }}</span>
      </div>
      <div class="module-content">
        <h3 class="module-title">{{ title }}</h3>
        <p class="module-description">{{ description }}</p>
        <div class="module-hint">{{ hint }}</div>
      </div>
      <div class="card-corner">
        <el-icon><ArrowRight /></el-icon>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';
import { computed } from 'vue';
import router from "@/router";

const props = defineProps({
  icon: {
    type: String,
    default: "parking"
  },
  title: String,
  description: String,
  hint: String,
  to: String,
  cardClass: String
});

// 创建计算属性将图标名称映射为 Emoji
const emojiIcon = computed(() => {
  const iconMap = {
    parking: "🚗",      // 停车服务图标
    medical: "🏥",      // 医疗服务图标
    library: "📚",      // 图书服务图标
    orders: "📋",       // 预约服务图标
    score: "⭐"        // 积分服务图标
  };

  return iconMap[props.icon] || "✅"; // 默认图标
});


const goTo = () => {
  router.push(props.to);
};
</script>

<style scoped lang="scss">
.module-card {
  border-left: 4px solid #1a56db;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(26, 86, 219, 0.15);
  }
}

.card-body {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  position: relative;
  padding: 16px;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(26, 86, 219, 0.08);
  border-radius: 12px;
}

.emoji-icon {
  font-size: 32px; // 设置适当的 Emoji 大小
  line-height: 1;
}

.module-content {
  flex: 1;
  min-width: 0; // 防止文本溢出

  .module-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 6px;
    color: #222;
  }

  .module-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .module-hint {
    font-size: 13px;
    color: #1a56db;
    background: #f0f7ff;
    padding: 4px 10px;
    border-radius: 10px;
    display: inline-block;
  }
}

.card-corner {
  position: absolute;
  right: 12px;
  bottom: 12px;
  color: #1a56db;

  .el-icon {
    transition: transform 0.3s ease;
  }
}

// 卡片悬停效果增强
.module-card:hover .card-corner .el-icon {
  transform: translateX(3px);
}

// 为不同卡片添加个性化主题
.parking-card {
  border-left: 4px solid #3b82f6;

  .emoji-icon {
    color: #3b82f6;
  }

  .module-hint {
    background: rgba(59, 130, 246, 0.1);
  }
}

.medical-card {
  border-left: 4px solid #ef4444;

  .emoji-icon {
    color: #ef4444;
  }

  .module-hint {
    background: rgba(239, 68, 68, 0.1);
  }
}

.library-card {
  border-left: 4px solid #10b981;

  .emoji-icon {
    color: #10b981;
  }

  .module-hint {
    background: rgba(16, 185, 129, 0.1);
  }
}
</style>