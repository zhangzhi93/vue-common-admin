<template>
  <el-aside width="220px"
    class="slider-menu">
    <el-menu :default-active="getActiveMenu.FMenu+getActiveMenu.SMenu"
      background-color="#F4F4F4"
      text-color="#222"
      active-text-color="#1e2221"
      :unique-opened="true"
      router>
      <el-menu-item v-for="item in getSubMenuList.children"
        :index="getSubMenuList.path+'/'+item.path"
        :key="item.name">{{item.meta.title}}</el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Slider',
  computed: {
    ...mapGetters(['getSubMenuList', 'getActiveMenu']),
  },
};
</script>

<style lang="less">
.slider-menu {
  border-right: 1px solid #e6e6e6;
}
</style>
