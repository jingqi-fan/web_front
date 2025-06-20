<template>
  <div class="edit-form">
    <label>姓名：<input v-model="localUser.name" /></label>
    <label>身份证号：<input v-model="localUser.idNumber" /></label>
    <label>信用评分：<input type="number" v-model.number="localUser.creditScore" /></label>
    <label>电话：<input v-model="localUser.phone" /></label>
    <label>邮箱：<input v-model="localUser.email" /></label>

    <div class="buttons">
      <button @click="$emit('save', localUser)">保存</button>
      <button @click="$emit('cancel')">取消</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  user: {
    name: string
    idNumber: string
    creditScore: number
    phone: string
    email: string
  }
}>()

const emit = defineEmits(['save', 'cancel'])

const localUser = ref({ ...props.user })

watch(
    () => props.user,
    (newVal) => {
      localUser.value = { ...newVal }
    }
)
</script>

<style scoped lang="scss">
.edit-form {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    display: flex;
    flex-direction: column;
    font-weight: bold;

    input {
      margin-top: 5px;
      padding: 6px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }

  .buttons {
    margin-top: 10px;
    display: flex;
    gap: 10px;

    button {
      padding: 6px 12px;
      border-radius: 5px;
      border: none;
      cursor: pointer;

      &:first-child {
        background-color: #67c23a;
        color: white;
      }

      &:last-child {
        background-color: #f56c6c;
        color: white;
      }
    }
  }
}
</style>
