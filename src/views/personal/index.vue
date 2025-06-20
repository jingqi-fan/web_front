<template>
  <div class="profile-container">
    <div class="profile-header">
      <h2>个人中心</h2>
      <p class="subtitle">查看并管理您的个人信用信息</p>
    </div>

    <div class="profile-card">
      <div class="info-left">
        <img class="avatar" src="https://i.pravatar.cc/100" alt="用户头像" />
        <div class="basic-info">
          <h3>{{ user.name }}</h3>
          <p>信用评分：<span class="score">{{ user.creditScore }}</span></p>
        </div>
      </div>

      <div class="info-right">
        <ul class="detail-list">
          <li><span>身份证号：</span>{{ user.idNumber }}</li>
          <li><span>电话：</span>{{ user.phone }}</li>
          <li><span>邮箱：</span>{{ user.email }}</li>
        </ul>
        <button class="edit-btn" @click="editing = true">编辑信息</button>
      </div>
    </div>

    <UserInfoEdit
        v-if="editing"
        :user="user"
        @save="handleSave"
        @cancel="editing = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UserInfoEdit from './component/UserInfoEdit.vue'

interface User {
  name: string
  idNumber: string
  creditScore: number
  phone: string
  email: string
}

const user = ref<User>({
  name: '张三',
  idNumber: '123456199001010000',
  creditScore: 750,
  phone: '13800000000',
  email: 'zhangsan@example.com'
})

const editing = ref(false)

const handleSave = (updatedUser: User) => {
  user.value = { ...updatedUser }
  editing.value = false
}
</script>

<style scoped lang="scss">
.profile-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  font-family: "Helvetica Neue", sans-serif;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;

  h2 {
    font-size: 28px;
    margin-bottom: 6px;
  }

  .subtitle {
    color: #888;
    font-size: 14px;
  }
}

.profile-card {
  display: flex;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
}

.info-left {
  display: flex;
  align-items: center;

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 20px;
  }

  .basic-info h3 {
    margin: 0;
    font-size: 20px;
  }

  .score {
    color: #67c23a;
    font-weight: bold;
  }
}

.info-right {
  .detail-list {
    list-style: none;
    padding: 0;
    margin-bottom: 10px;

    li {
      margin-bottom: 6px;

      span {
        color: #888;
        margin-right: 6px;
      }
    }
  }

  .edit-btn {
    background-color: #409eff;
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #66b1ff;
    }
  }
}
</style>
