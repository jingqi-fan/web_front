<template>
  <div class="recent-services">
    <h3 style="text-align: center; margin: 16px 0">最近使用服务</h3>
    <div class="service-list">
      <div
          v-for="(service, index) in services"
          :key="index"
          class="service-card"
      >
        <div class="service-icon">{{ service.icon }}</div>
        <div class="service-name">{{ service.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  services: { name: string; icon: string }[]
}>()
</script>

<style scoped lang="scss">
.recent-services {
  padding: 8px;
  color: #fff;

  .service-list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }

  .service-card {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 8px;
    width: 80px;
    text-align: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

    .service-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }

    .service-name {
      font-size: 14px;
      font-weight: 500;
    }
  }
}
</style>
