<template>
  <div>
    <el-row>
      <el-col :span="24">
        <h1>任务列表</h1>
      </el-col>
    </el-row>

    <el-row :gutter="22" class="search-bar">
      <el-col :span="8" class="search-input-container">
        <el-input
            v-model="searchKeyword"
            placeholder="输入关键字搜索任务"
            @input="filterTasks"
        />
        <el-button
            :icon="Search"
            @click="filterTasks"
            class="search-button"
        ></el-button>
      </el-col>
      <el-col :span="12">
        <el-checkbox-group v-model="selectedGroups" @change="filterTasks">
          <el-checkbox
              v-for="(group, index) in taskGroups"
              :key="index"
              :label="group"
          >
            {{ group }}
          </el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="task-controls">
      <el-col :span="12">
        <el-radio-group v-model="selectedCategory" @change="filterTasks">
          <el-radio-button
              v-for="(category, index) in taskCategories"
              :key="index"
              :label="category"
          >
            {{ category }}
          </el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="task-cards">
      <el-col :span="8" v-for="task in filteredTasks" :key="task.id">
        <task-card :task="task" @view="viewTask" @details="showDetails" />
      </el-col>
    </el-row>
    <!--弹出框-->
    <el-drawer v-model="drawer" :title="`${selectedTask.id} - ${selectedTask.name}`" :size="'50%'">
      <div class="drawer-content">
        <!-- 搜索方法 -->
        <el-row align="middle" class="drawer-row">
          <el-col :span="3" class="label">搜索方法：</el-col>
          <el-col :span="18">
            <el-select v-model="searchMethod" placeholder="选择搜索方法" style="width: 30%;">
              <el-option label="方法A" value="A"></el-option>
              <el-option label="方法B" value="B"></el-option>
            </el-select>
          </el-col>
        </el-row>

        <!-- 随机种子 -->
        <el-row align="middle" class="drawer-row" style="margin-top: 8px">
          <el-col :span="3" class="label">随机种子：</el-col>
          <el-col :span="18">
            <el-input-number v-model="randomSeed" :min="0" :max="9999" placeholder="输入随机种子" style="width: 30%;" />
          </el-col>
        </el-row>

        <!-- 数据集 -->
        <el-row align="middle" class="drawer-row" style="margin-top: 8px">
          <el-col :span="3" class="label">数据集：</el-col>
          <el-col :span="4" style="margin-right: 5px">
            <el-select v-model="isPublic" placeholder="状态" style="width: 100%;">
              <el-option label="私有" value="private"></el-option>
              <el-option label="公开" value="public"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" style="margin-right: 5px">
            <el-select v-model="fileClass" placeholder="文件类型" style="width: 100%;">
              <el-option label="CSV" value="csv"></el-option>
              <el-option label="XLSX" value="xlsx"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select v-model="dataset" placeholder="数据集名" style="width: 100%;">
              <el-option label="数据集E" value="E"></el-option>
              <el-option label="数据集F" value="F"></el-option>
            </el-select>
          </el-col>
        </el-row>

        <!-- 搜索空间 -->
        <el-row align="middle" class="drawer-row" style="margin-top: 8px">
          <el-col :span="3" class="label">搜索空间：</el-col>
          <el-col :span="6" style="margin-right: 5px">
            <el-select v-model="isPublicSearch" placeholder="状态" style="width: 100%;">
              <el-option label="私有" value="private"></el-option>
              <el-option label="公开" value="public"></el-option>
            </el-select>
          </el-col>
          <el-col :span="9">
            <el-select v-model="searchSpace2" placeholder="搜索空间2" style="width: 100%;">
              <el-option label="空间Z" value="Z"></el-option>
              <el-option label="空间W" value="W"></el-option>
            </el-select>
          </el-col>
        </el-row>

        <!-- 列表 -->
        <el-row v-infinite-scroll="load" class="infinite-list" style="margin-top: 8px">
          <el-col :span="24">
            <el-table :data="operationData" border style="width: 100%" max-height="300">
              <el-table-column fixed prop="id" label="任务ID" width="100" />
              <el-table-column prop="name" label="操作名称"/>
              <el-table-column prop="description" label="操作描述"/>
            </el-table>
          </el-col>
        </el-row>

        <!-- 按钮 -->
        <el-row style="margin-top: 100px;" :gutter="10" justify="end">
          <el-col :span="5">
            <el-button @click="drawer = false" type="text" style="width: 100%;">取消</el-button>
          </el-col>
          <el-col :span="5">
            <el-button type="success" style="width: 100%;">保存</el-button>
          </el-col>
          <el-col :span="10">
            <el-button type="success" style="width: 100%;">开始搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import TaskCard from './TaskCard.vue';
import {
  ElRow,
  ElCol,
  ElInput,
  ElCheckboxGroup,
  ElCheckbox,
  ElRadioGroup,
  ElRadioButton,
  ElButton,
  ElDrawer,
  ElSelect,
  ElOption,
  ElInputNumber,
  ElTable,
  ElTableColumn,
} from 'element-plus';
import { Search } from '@element-plus/icons-vue';


// 任务卡片数据
const tasks = ref([
  { id: 1, name: '任务A', status: '进行中', description: '描述A', group: '组1' },
  { id: 2, name: '任务B', status: '未开始', description: '描述B', group: '组2' },
  { id: 3, name: '任务C', status: '已完成', description: '描述C', group: '组1' },
  { id: 4, name: '任务D', status: '已完成', description: '描述D', group: '组1' },
  { id: 5, name: '任务E', status: '已完成', description: '描述E', group: '组1' },
]);

// 筛选按钮
const taskCategories = ref(['所有', '进行中', '未开始', '已完成']);
//复选框
const taskGroups = ref(['组1', '组2']);

const searchKeyword = ref('');
const selectedCategory = ref('所有');
const selectedGroups = ref([...taskGroups.value]);

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const matchesKeyword = task.name.includes(searchKeyword.value);
    const matchesCategory =
        selectedCategory.value === '所有' || task.status === selectedCategory.value;
    const matchesGroup = selectedGroups.value.includes(task.group);
    return matchesKeyword && matchesCategory && matchesGroup;
  });
});

const drawer = ref(false);


const viewTask = (task: { id: string; name: string }) => {
  selectedTask.value = task;
  drawer.value = true;
};
const selectedTask = ref({ id: '', name: '' });

// 搜索方法
const searchMethod = ref('');
// 随机种子
const randomSeed = ref(0);

// 是否私有
const isPublic = ref('');
const fileClass = ref('');
const dataset = ref('');
const isPublicSearch = ref('');
const searchSpace2 = ref('');
const count = ref(0)
const load = () => {
  count.value += 2
}

// 模拟抽屉数据（列表）
const operationData = ref([
  { id: 1, name: '操作A', description: '描述A' },
  { id: 2, name: '操作B', description: '描述B' },
  { id: 3, name: '操作C', description: '描述C' },
  { id: 4, name: '操作D', description: '描述D' },
  { id: 5, name: '操作E', description: '描述E' },
  { id: 1, name: '操作A', description: '描述A' },
  { id: 2, name: '操作B', description: '描述B' },
  { id: 3, name: '操作C', description: '描述C' },
  { id: 4, name: '操作D', description: '描述D' },
  { id: 5, name: '操作E', description: '描述E' },
  { id: 1, name: '操作A', description: '描述A' },
  { id: 2, name: '操作B', description: '描述B' },
  { id: 3, name: '操作C', description: '描述C' },
  { id: 4, name: '操作D', description: '描述D' },
  { id: 5, name: '操作E', description: '描述E' },
]);

const filterTasks = () => {};
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}
.search-input-container {
  display: flex;
  align-items: center;
}
.search-button {
  margin-left: 2px;
}
.task-controls {
  margin-bottom: 16px;
}

.task-cards {
  display: flex;
  flex-wrap: wrap;
  overflow-x: hidden;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 2px;
  margin-top: 5px;
  padding: 2px;
}
.drawer-row {
  margin-bottom: 16px;
}

.label {
  text-align: left;
  padding: 1px;
  font-weight: bold;
}
.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>
