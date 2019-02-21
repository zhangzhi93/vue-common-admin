<template>
  <div class="header">
    <div class="logo">
      <i class="el-icon-goods"></i>
    </div>
    <el-menu :default-active="getActiveMenu.FMenu"
      mode="horizontal"
      menu-trigger="click"
      @select="handleSelect"
      :router="true"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item v-for="item in MenuList"
        :key="item.key"
        :index="item.index">
        <i :class="item.icon"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { MenuList } from "../utils/config";

export default {
  name: 'Header',
  data() {
    return {
      MenuList: MenuList
    };
  },
  computed: {
    ...mapGetters(['getActiveMenu']),
  },
  methods: {
    ...mapMutations({
      subMenuHandler: 'GET_SUB_MENULIST'
    }),
    handleSelect(key, keyPath) {
      this.subMenuHandler(key)
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
  background-color: rgb(84, 92, 100);
  border-bottom: solid 1px #e6e6e6;
  .logo {
    float: left;
    margin: 10px 60px 0 60px;
    width: 80px;
    height: 40px;
    background-color: rgb(90, 102, 120);
    border-radius: 3px;
    text-align: center;
    color: #fff;
    line-height: 40px;
  }
  :global {
    .el-menu {
      float: left;
      border-bottom: none;
    }
  }
}
</style>
