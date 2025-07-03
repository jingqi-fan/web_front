<template>
  <div class="card-body">
    <el-card style="width: 320px;height: 360px">
      <template #header>
        <div class="card-header">
          <span>{{ data.name !== '' ? data.name : '未知' }}</span>
        </div>
      </template>
      <div style="height: 200px;align-items: center;text-align: start">
        <div class="avatar">
          <el-avatar :src="data.avatar" style="width: 40px;height: 40px" />
          <el-text style="margin-left: 40px;font-size: 24px;">{{ data.username }}</el-text>
        </div>
        <div class="type">
          <el-text>类型：{{ data.type !== '' ? data.type : '未知' }}</el-text>
        </div>
        <div class="money">
          <el-text>报酬：{{ data.money !== 0 ? data.money : 0 }}</el-text>
        </div>
        <div class="info">
          <el-text>简介：{{ data.info !== '' ? data.info : '无内容' }}</el-text>
        </div>
      </div>

      <template #footer>
        <el-tag>{{ data.people }}</el-tag>
        <el-button style="margin-left: 120px" @click="check" type="success" plain>查看</el-button>
        <el-button type="primary" @click="join" plain>竞标</el-button>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

// 接收父组件传入的 props
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      id:0,
      name: '',
      avatar: '',
      username: '',
      type: '',
      money: 0,
      info: '',
      people: 0,
    }),
  },
});
import useRequirementStore from "@/store/system/useRequirementStore.ts";
import {ElMessage} from "element-plus";
import router from "@/router";
const requirementStore=useRequirementStore();

const check = () => {
  requirementStore.setData(props.data)
  ElMessage.success("正在查看："+props.data.name)
  router.push('/creator/requirement/background/detail')
};

const join = () => {
  requirementStore.setData(props.data)
  ElMessage.success("参与竞标："+props.data.name)
  router.push('/creator/requirement/background/detail/join')
};
</script>

<style scoped>
.card-body {
  height: 400px;
  width: 340px;
}
.avatar {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
}
.type{
  height: 25px;
}
.money{
  height: 25px;
}
.info {
  height: 120px;
  overflow: auto;
  text-overflow: ellipsis;
}
</style>
