<template>
  <el-header height="50px"
    class="header">
    <div class="logo">
      <i class="el-icon-goods"></i>
      <span>管理系统</span>
    </div>
    <el-menu :default-active="getActiveMenu.FMenu"
      mode="horizontal"
      menu-trigger="click"
      router
      background-color="#18475f"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item v-for="item in getPermissionMenu"
        :key="item.name"
        :index="item.path">
        <i :class="item.meta.icon"></i>
        <span slot="title">{{item.meta.title}}</span>
      </el-menu-item>
    </el-menu>
  </el-header>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Header',
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['getPermissionMenu', 'getActiveMenu']),
  },
  watch: {
    getActiveMenu(val) {
      console.log(val);
    }
  },
};
</script>
<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 99;
  overflow: hidden;
  background-color: #18475f;
  padding: 0;
  .logo {
    float: left;
    border-radius: 3px;
    text-align: center;
    color: #fff;
    min-width: 200px;
    line-height: 50px;
    i {
      margin-right: 15px;
    }
  }
  /deep/.el-menu--horizontal > .el-menu-item {
    height: 50px;
    line-height: 50px;
  }
  .el-menu {
    float: left;
    border-bottom: none;
  }
}
</style>
