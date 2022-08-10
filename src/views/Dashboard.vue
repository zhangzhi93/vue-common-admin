<template>
  <div style="padding:15px">
    <a-row :gutter="20">
      <a-col :span="6">
        <a-card :body-style="{ padding: '0px' }" class="user-card">
          <img src="../assets/hamburger.png" class="image" />
          <div style="padding: 14px;">
            <span>好吃的汉堡</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <a-button type="link" class="button">操作按钮</a-button>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="18">
        <a-card :body-style="{ padding: '0px' }" class="user-card">
          <img src="../assets/hamburger.png" class="image" />
          <div style="padding: 14px;">
            <span>好吃的汉堡</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <a-button type="link" class="button">操作按钮</a-button>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row class="table-container">
      <a-table :columns="columns" :data-source="tableData" style="width: 100%" />
    </a-row>
    <div>
      <div>{{ beforeArray }}</div>
      <a-button type="primary" size="small" @click="move">移动</a-button>
      <div>{{ afterArray }}</div>
    </div>
    <div>
      <pagination v-model="page" :total="50" @change="onPageChange" @size-change="onShowSizeChange" />
    </div>
  </div>
</template>
<script>
import { arrayMoveImmutable } from 'array-move';
import Pagination from '@/components/Pagination';
export default {
  name: 'Dashboard',
  components: {
    Pagination
  },
  data() {
    return {
      page: 1,
      currentDate: new Date(),
      beforeArray: [0, 1, 2, 3, 4, 5, 6, 7],
      afterArray: [],
      columns: [{
        title: '日期',
        key: 'date',
        dataIndex: 'date',
        align: 'center',
      }, {
        title: '姓名',
        key: 'name',
        dataIndex: 'name',
        align: 'center',
      }, {
        title: '性别',
        key: 'sex',
        dataIndex: 'sex',
        align: 'center',
      }, {
        title: '地址',
        key: 'address',
        dataIndex: 'address',
        align: 'center',
      },],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-04',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-01',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-03',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1518 弄',
      }],
    };
  },
  methods: {
    move() {
      this.afterArray = arrayMoveImmutable(this.beforeArray, 4, 1)
    },
    onPageChange(page){
      console.log(page)
    },
    onShowSizeChange(pageSize){
      console.log(pageSize)
    }
  },
};
</script>
<style lang="less" scoped>
.time {
  font-size: 13px;
  color: #999;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}
.button {
  padding: 0;
  float: right;
}
.image {
  width: 100%;
  display: block;
  height: 150px;
}
.user-card {
  padding: 5px;
  min-height: 240px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.table-container {
  margin-top: 20px;
}
</style>
