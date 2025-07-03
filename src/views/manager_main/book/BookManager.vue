<template>
  <div class="book">
    <div class="page-header">
      <el-icon class="book-icon"><Reading /></el-icon>
      <span class="title">图书管理</span>
    </div>

    <el-button type="primary" @click="openAddDialog">添加图书</el-button>
    <el-input
        v-model="queryParams.title"
        placeholder="搜索书名"
        style="width: 180px; margin-right: 10px;margin-left: 10px"
        clearable
    />

    <el-select
        v-model="queryParams.categoryId"
        placeholder="分类"
        style="width: 160px; margin-right: 10px;"
    >
      <el-option label="全部" :value= "0" />
      <el-option
          v-for="(cat, index) in categoryOptions"
          :key="cat"
          :label="cat"
          :value="index + 1"
      />
    </el-select>
    <el-button type="primary" @click="resetFilters">重置</el-button>

    <el-table v-loading="loading" :data="books" height="500" style="margin-top: 20px;max-height:500px;overflow-y: auto" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="bookName" width="220" label="书名" />
      <el-table-column prop="author" width="180" label="作者" />
      <el-table-column prop="publicationYear" label="出版日期" />
      <el-table-column prop="categoryName" label="分类" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="stock" label="库存" />
      <el-table-column prop="overdueFee" label="逾期费用" />
      <el-table-column label="操作" width="280">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="openEditDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteThisBook(row.id,row.bookName)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        layout="total, prev, pager, next, sizes"
        :page-sizes="[5, 10, 20, 50]"
        style="margin-top: 20px; text-align: right;"
    />
  </div>
  <el-dialog :title="isEditing ? '编辑图书' : '添加图书'" v-model="dialogVisible" width="600px">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <!-- 修正prop字段名 -->
      <el-form-item label="书名" prop="bookName">
        <el-input v-model="form.bookName" />
      </el-form-item>

      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author" />
      </el-form-item>

      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择分类">
          <el-option
              v-for="(cat, index) in categoryOptions"
              :key="index"
              :label="cat"
              :value="index + 1" />
        </el-select>
      </el-form-item>

      <el-form-item label="出版社" prop="publisher">
        <el-input v-model="form.publisher" />
      </el-form-item>

      <!-- 修正字段名大小写 -->
      <el-form-item label="出版年份" prop="publicationYear">
        <el-input-number v-model="form.publicationYear" :min="1900" :max="2100" />
      </el-form-item>

      <el-form-item label="库存数量" prop="stock">
        <el-input-number v-model="form.stock" :min="0" />
      </el-form-item>

      <el-form-item label="定价(元)" prop="price">
        <el-input-number v-model="form.price" :min="0" :step="0.1" :precision="2" />
      </el-form-item>
      <el-form-item label="逾期费用" prop="overdueFee">
        <el-input-number v-model="form.overdueFee" :min="0" :step="0.1" :precision="2" />
      </el-form-item>

      <!-- 修正字段名 -->
      <el-form-item label="图书简介" prop="bookIntroduction">
        <el-input type="textarea" v-model="form.bookIntroduction"
                  :autosize="{ minRows: 2, maxRows: 4 }" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import {ElMessage, ElMessageBox, type FormInstance} from 'element-plus'
import { Reading } from "@element-plus/icons-vue";
import {addBook, type BookRes, deleteBook, getBookDetail, getBooksPage, updateBook} from "@/api/life/book.ts";

// 数据定义
const books = ref<BookRes[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const isEditing = ref(false);
const currentId = ref<number | null>(null);
const formRef = ref<FormInstance>();
const categoryOptions = ['文学', '历史', '科技', '哲学', '艺术', '地理', '其他'];
const loading = ref(false)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  author: '',
  categoryId: 0,
});

// 表单数据
const form = ref({
  id: 0,
  bookName: '',
  categoryId: 0,     // 数字类型
  author: '',
  publisher: '',
  publicationYear: new Date().getFullYear(),
  stock: 0,
  price: 0,
  bookIntroduction: '',
  overdueFee: 0,
  borrowedNumber: 0,
  image: '',
  createdAt: Date.now(),
  updatedAt:Date.now()
});



// 获取图书数据
const fetchBooks = async () => {
  loading.value = true;
  try {
    const res = await getBooksPage({
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize,
      title: queryParams.title,
      author: queryParams.author,
      categoryId: queryParams.categoryId,
      minStock: queryParams.minStock
    });

    if (res.data?.booksList) {
      // 添加分类名称映射
      books.value = res.data.booksList.map(book => ({
        ...book,categoryName: categoryOptions[book.categoryId - 1] || '其他'}
      ));
      total.value = res.data.total;
    }
  } catch (e) {
    ElMessage.error('获取图书失败');
  }
  loading.value = false;
};

// 初始加载
fetchBooks();

import { debounce } from 'lodash-es';

// 在fetchBooks定义后添加
const debouncedFetchBooks = debounce(fetchBooks, 1000);

// 修改监听器
watch(
    () => ({ ...queryParams }),
    () => debouncedFetchBooks(),
    { deep: true }
);

// 表单验证规则
const rules = ref({
  bookName: [
    { required: true, message: '书名不能为空', trigger: 'blur' }
  ],
  author: [
    { required: true, message: '作者不能为空', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  publisher: [
    { required: true, message: '出版社不能为空', trigger: 'blur' }
  ],
  publicationYear: [
    { required: true, message: '出版年份不能为空', trigger: 'blur' },
    {
      validator: (_, value) => value >= 1900 && value <= 2100,
      message: '年份应在1900-2100之间',
      trigger: 'blur'
    }
  ],
  stock: [
    { required: true, message: '库存不能为空', trigger: 'blur' },
    {
      type: 'number',
      min: 0,
      message: '库存不能小于0',
      trigger: 'blur'
    }
  ],
  price: [
    { required: true, message: '价格不能为空', trigger: 'blur' },
    {
      type: 'number',
      min: 0,
      message: '价格不能小于0',
      trigger: 'blur'
    }
  ],
  bookIntroduction: [
    { required: true, message: '简介不能为空', trigger: 'blur' }
  ]
});
// 打开添加对话框
const openAddDialog = () => {
  isEditing.value = false;
  form.value = {
    id: 0,
    bookName: '',
    categoryId: 0, // 默认第一个分类
    author: '',
    publisher: '',
    publicationYear: '',
    stock: 0,
    price: 0,
    bookIntroduction: '',
    overdueFee: 0,
    borrowedNumber: 0,
    image: ''
  };
  dialogVisible.value = true;
};

// 打开编辑对话框
const openEditDialog = (book: BookRes) => {
  isEditing.value = true;
  currentId.value = book.id;
  form.value = { ...book };
  dialogVisible.value = true;
};

// 提交表单
const submitForm = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        // 这里调用添加/更新API
        if (isEditing.value) {
          await updateBook(form.value)
          ElMessage.success('编辑成功');
        } else {
          await addBook(form.value)
          ElMessage.success('添加成功');
        }
        await fetchBooks(); // 刷新列表
        dialogVisible.value = false;
      } catch (e) {
        ElMessage.error('操作失败');
      }
    }
  });
};

// 重置筛选
const resetFilters = () => {
  queryParams.title = '';
  queryParams.author = '';
  queryParams.categoryId = 0;
  queryParams.pageNum = 1;
};

// 删除图书
const deleteThisBook = async (id: number,title:string) => {
  ElMessageBox.confirm(
      `是否确认删除图书-《${title}》?`,
      'Warning',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        try {
          deleteBook(id)
          books.value = books.value.filter(book => book.id !== id);
          ElMessage.success('删除成功');
        } catch (e) {
          ElMessage.error('删除失败');
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消',
        })
      })

};

</script>

<style scoped lang="scss">

.page-header {
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 10px;

  .book-icon {
    font-size: 26px;
    color: #409EFF;
    margin-right: 10px;
  }

  .title {
    color: #303133;
  }
}

</style>
