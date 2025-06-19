<!-- src/components/Sidebar.vue -->
<template>
  <nav class="sidebar">
    <ul>
      <li
        v-for="item in items"
        :key="item.route"
        :class="{ active: item.route === currentRoute }"
        @click="navigate(item.route)"
      >
        {{ item.label }}
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'Sidebar',
  props: {
    items: {
      type: Array as () => Array<{ label: string; route: string }>,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()

    // 当前激活的路由 name
    const currentRoute = computed(() => route.name as string)

    function navigate(name: string) {
      if (name !== currentRoute.value) {
        router.push({ name })
      }
    }

    return {
      currentRoute,
      navigate
    }
  }
})
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  padding: 24px 16px;
  box-sizing: border-box;
}

.sidebar ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar li {
  font-size: 16px;
  color: #333;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.sidebar li:hover {
  background-color: #f5f5f5;
}

.sidebar li.active {
  background-color: #409eff;
  color: #fff;
  font-weight: 500;
}
</style>