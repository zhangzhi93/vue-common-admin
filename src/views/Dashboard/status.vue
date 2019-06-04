<template>
  <div>
    <el-row gutter="20">
      <el-col :span="6">
        <el-card :body-style="{ padding: '0px' }"
          class="user-card">
          <img src="../../assets/hamburger.png"
            class="image">
          <div style="padding: 14px;">
            <span>好吃的汉堡</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <el-button type="text"
                class="button">操作按钮</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card :body-style="{ padding: '0px' }"
          class="user-card">
          <img src="../../assets/hamburger.png"
            class="image">
          <div style="padding: 14px;">
            <span>好吃的汉堡</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <el-button type="text"
                class="button">操作按钮</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="table-container">
      <el-table border
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column prop="date"
          label="日期">
        </el-table-column>
        <el-table-column prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column prop="sex"
          label="性别">
        </el-table-column>
        <el-table-column prop="address"
          label="地址">
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      currentDate: new Date(),
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        sex: "男",
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-04',
        name: '王小虎',
        sex: "男",
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        sex: "男",
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-03',
        name: '王小虎',
        sex: "男",
        address: '上海市普陀区金沙江路 1518 弄'
      }]
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    }
  }
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
