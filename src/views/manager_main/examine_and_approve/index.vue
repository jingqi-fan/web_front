<template>
  <div class="approval-center">
    <el-header class="custom-header">
      <div class="title-left">
        <logo style="margin-left: 20px; cursor: pointer;" @click="goToHome" />
        <div class="credit-life-title">
          <div class="main-title">审批中心<div class="title-decoration"></div></div>
          <div class="subtitle">信用信息流程化管理平台</div>
        </div>
      </div>
      <div class="title-right">
        <el-button @click="goToPublish" class="custom-button">发布中心</el-button>
        <el-button @click="goToData" class="custom-button">数据中心</el-button>
        <el-button @click="goBack" class="custom-button">返回</el-button>
      </div>
    </el-header>

    <el-main class="custom-main">
      <el-tabs v-model="activeTab" type="card" class="approval-tabs">
        <el-tab-pane name="credit">
          <template #label>
            <span class="custom-tab-label">用户信用信息审批</span>
          </template>
          <el-card shadow="hover" class="tab-card">
            <el-table :data="ucsList" height="470" style="width: 100%" border>
              <el-table-column type="index" label="序号" width="80" />
              <el-table-column prop="name" label="用户" />
              <el-table-column prop="accountType" label="账号" />
              <el-table-column prop="idNumber" label="证件号" />
              <el-table-column prop="jobType" label="工作类型" />
              <el-table-column prop="qualification" label="学历" />
              <el-table-column prop="income" label="收入" />
              <el-table-column label="状态" prop="status">
                <template #default="{ row }">
                  <el-tag :type="formatStatus(row.status).type">
                    {{ formatStatus(row.status).text }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" align="right">
                <template #default="{ row }">
                  <el-button
                      size="small"
                      :type="formatStatus(row.status).type"
                      plain
                      :disabled="formatStatus(row.status).disabled"
                      @click="startApproval(row)"
                  >
                    {{ formatStatus(row.status).text }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="ucsList.length === 0" class="empty-tip">暂无待审批数据</div>
          </el-card>
        </el-tab-pane>

        <el-tab-pane name="appeal">
          <template #label>
            <span class="custom-tab-label">申述审批</span>
          </template>
          <el-card shadow="hover" class="tab-card">
            <el-table :data="appealList" style="width: 100%" border>
              <el-table-column prop="id" label="编号" width="80" />
              <el-table-column prop="user" label="用户" />
              <el-table-column prop="reason" label="申述理由" />
              <el-table-column label="操作" width="180" align="right">
                <template #default="scope">
                  <el-button size="small" type="primary" plain>开始审批</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="appealList.length === 0" class="empty-tip">暂无申述数据</div>
          </el-card>
        </el-tab-pane>

        <el-tab-pane name="other">
          <template #label>
            <span class="custom-tab-label">其他审批</span>
          </template>
          <el-card shadow="hover" class="tab-card">
            <el-table :data="otherList" style="width: 100%" border>
              <el-table-column prop="id" label="编号" width="80" />
              <el-table-column prop="user" label="用户" />
              <el-table-column prop="description" label="说明" />
              <el-table-column label="操作" width="180" align="right">
                <template #default="scope">
                  <el-button size="small" type="primary" plain>开始审批</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="otherList.length === 0" class="empty-tip">暂无其他审批数据</div>
          </el-card>
        </el-tab-pane>
      </el-tabs>


      <!-- 审批弹窗 -->
      <el-dialog v-model="approvalDialogVisible" title="用户信用信息审批流程" width="600">
        <el-steps :active="currentStep" finish-status="success">
          <el-step title="证件审批" />
          <el-step title="工作审批" />
          <el-step title="学历审批" />
          <el-step title="收入审批" />
          <el-step title="结果填写" />
        </el-steps>

        <div class="step-content" v-if="currentStep <= 3">
          <template v-if="currentStep === 0">
            <div>姓名：{{ selectedRow?.name }}</div>
            <div>身份证号：{{ selectedRow?.idNumber }}</div>
            <div class="image-group">
              <el-image :src="selectedRow?.idCardFront" style="width: 120px" />
              <el-image :src="selectedRow?.idCardBack" style="width: 120px" />
            </div>
          </template>
          <template v-else-if="currentStep === 1">
            <div>工作类型：{{ selectedRow?.jobType }}</div>
            <el-image :src="selectedRow?.workProof" style="width: 200px" />
          </template>
          <template v-else-if="currentStep === 2">
            <div>学历：{{ selectedRow?.qualification }}</div>
            <el-image :src="selectedRow?.educationProof" style="width: 200px" />
          </template>
          <template v-else-if="currentStep === 3">
            <div>收入：{{ selectedRow?.income }}</div>
            <el-image :src="selectedRow?.incomeProof" style="width: 200px" />
          </template>

          <div class="approval-actions">
            <el-button type="success" @click="handleStepApprove(true)">通过</el-button>
            <el-button type="danger" @click="handleStepApprove(false)">不通过</el-button>
          </div>
        </div>

        <!-- 审批完成页 -->
        <div v-else>
          <el-result
              :icon="approvalResult ? 'success' : 'error'"
              :title="approvalResult ? '审批通过' : '审批未通过'"
              sub-title="请填写审批反馈信息"
          />
          <el-input
              type="textarea"
              v-model="finishMessage"
              :placeholder="approvalResult ? '例如：您的信用审批已通过' : '请填写未通过原因...'"
              rows="4"
          />
        </div>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="approvalDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="nextStep">提交</el-button>
          </div>
        </template>
      </el-dialog>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import router from '@/router'
import Logo from "@/views/personal/component/Logo.vue";
import {getUcsList, ucsCheckFinish} from "@/api/user.ts";
import type {CheckUcsListEntity} from "@/entity/checkUcsListEntity.ts";
import {useUserInfoStore} from "@/stores/useUserInfoStore.ts";

const activeTab = ref('credit')
const approvalDialogVisible = ref(false)
const currentStep = ref(0)
const approvalResult = ref<null | boolean>(null)
const finishMessage = ref('')
const selectedRow = ref<CheckUcsListEntity | null>(null)
const ucsList=ref([]<CheckUcsListEntity>)

const stepResults = ref<boolean[]>([true, true, true, true]) // 初始默认都通过
const stepLabels = ['证件信息', '工作信息', '学历信息', '收入信息']
const generateFailedMessage = () => {
  const failedSteps = stepResults.value
      .map((approved, index) => (!approved ? stepLabels[index] : null))
      .filter(Boolean)

  return failedSteps.length > 0 ? `${failedSteps.join('、')}不合格` : '您的信用审批已通过'
}


const loadUcsList=async ()=>{
  const res=await  getUcsList()
  console.log("数据加载。",res)
  ucsList.value=res
}
loadUcsList()
const formatStatus = (status: number) => {
  switch (status) {
    case 1:
      return { text: '待审核', type: 'primary', disabled: false }
    case 2:
      return { text: '未通过', type: 'warning', disabled: true }
    case 3:
      return { text: '已通过', type: 'success', disabled: true }
    default:
      return { text: '未知', type: 'info', disabled: true }
  }
}


const appealList = ref([
  { id: 3, user: '王五', reason: '分数被错误扣除' },
  { id: 4, user: '赵六', reason: '系统误判' }
])
const otherList = ref([
  { id: 5, user: '测试用户', description: '其他审批申请内容' }
])

const handleStepApprove = (approved: boolean) => {
  stepResults.value[currentStep.value] = approved
  if (currentStep.value < 3) {
    currentStep.value += 1
  } else {
    // 所有步骤完成，进入结果页
    approvalResult.value = stepResults.value.every(val => val === true)
    currentStep.value = 4
  }
}
const userInfoStore=useUserInfoStore()

const nextStep = async () => {
  if (currentStep.value !== 4 || !selectedRow.value || approvalResult.value === null) return
  const autoMessage = generateFailedMessage()
  const command = {
    checkerId: userInfoStore.user.id,
    userId: selectedRow.value.id,
    status: approvalResult.value ? 3 : 2,
    message: finishMessage.value,
    stepResults: autoMessage,
  }

  try {
    await ucsCheckFinish(command)
    ElMessage.success('审批已提交')
    approvalDialogVisible.value = false
    await loadUcsList()
  } catch (error) {
    ElMessage.error('提交失败')
  }
}


const startApproval = (row: CheckUcsListEntity) => {
  selectedRow.value = row
  currentStep.value = 0
  approvalResult.value = null
  finishMessage.value = ''
  approvalDialogVisible.value = true
}

const goToPublish = () => router.push('/publish/manager/overview')
const goToData = () => router.push('/manager/dataCenter')
const goBack = () => router.back()
const goToHome = () => router.push('/')
</script>

<style scoped lang="scss">
.custom-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 90px;
  z-index: 1000;
  background-color: #f5f5f5;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 139, 0.5);
  border-radius: 8px;
}

.custom-main {
  margin-top: 90px;
  box-shadow: 0 4px 20px rgba(0, 0, 139, 0.5);
  border-radius: 8px;
}

.tab-card {
  border-radius: 12px;
  padding: 20px;
  margin-top: 10px;
}

.approval-tabs {
  background: #f9fafb;
  border-radius: 8px;
  padding: 10px;
}

.empty-tip {
  padding: 30px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.credit-life-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}

.main-title {
  font-size: 44px;
  font-weight: 500;
  color: #1a56db;
  position: relative;
}

.title-decoration {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
  border-radius: 2px;
}

.subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
  font-weight: 500;
}

.title-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.custom-button {
  background-image: linear-gradient(to right, #6dd5ed, #2193b0);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
}

.approval-actions {
  margin-top: 20px;
  display: flex;
  gap: 20px;
}

.image-group {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}
.custom-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 90px;
  z-index: 1000;
  background-color: #f5f5f5;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 139, 0.5);
  border-radius: 8px;
}
.custom-tab-label {
  font-size: 19px;
  font-weight: 600;
  color: #00d4ff;
}
.custom-main{
  margin-top: 90px;
  box-shadow: 0 4px 20px rgba(0, 0, 139, 0.5);
  border-radius: 8px;
}
.title-left {
  display: flex;
  align-items: center;
}
.tab-card {
  border-radius: 12px;
  padding: 20px;
  margin-top: 10px;
}

.approval-tabs {
  background: #f9fafb;
  border-radius: 8px;
  padding: 10px;
}

.empty-tip {
  padding: 30px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.credit-life-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}

.main-title {
  font-size: 44px;
  font-weight: 500;
  color: #1a56db;
  letter-spacing: 1px;
  position: relative;
  text-shadow: 0 2px 4px rgba(26, 86, 219, 0.15);
  transition: all 0.3s ease;
}

.main-title:hover {
  transform: scale(1.03);
  text-shadow: 0 4px 8px rgba(26, 86, 219, 0.2);
}

.subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
  letter-spacing: 2px;
  font-weight: 500;
  opacity: 0.9;
}

.title-decoration {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
  border-radius: 2px;
  opacity: 0.7;
}

.title-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.custom-button {
  background-image: linear-gradient(to right, #6dd5ed, #2193b0);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
}

.custom-button:hover {
  opacity: 0.8;
}

.approval-center {
  padding: 20px;
  .approval-tabs {
    background-color: #fff;
    padding: 10px;
    border-radius: 8px;
  }
  .step-content {
    margin: 30px 0;
    font-size: 16px;
    min-height: 60px;
  }
}
</style>
