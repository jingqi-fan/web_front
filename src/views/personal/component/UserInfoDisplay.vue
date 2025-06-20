<template>
  <div class="user-info">
    <p><strong>姓名：</strong>{{ user.name }}</p>
    <p><strong>身份证号：</strong>{{ user.idNumber }}</p>
    <p><strong>信用评分：</strong>{{ user.creditScore }}</p>
    <p><strong>电话：</strong>{{ user.phone }}</p>
    <p><strong>邮箱：</strong>{{ user.email }}</p>
    <button @click="$emit('edit')">编辑信息</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  user: {
    name: string
    idNumber: string
    creditScore: number
    phone: string
    email: string
  }
}>()

defineEmits(['edit'])
</script>

<style scoped lang="scss">
.user-info {
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 10px;

  p {
    margin: 5px 0;
  }

  button {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>
