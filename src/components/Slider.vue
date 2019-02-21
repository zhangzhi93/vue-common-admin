<template>
  <el-aside width="220px">
    <el-menu :default-active="getActiveMenu.SMenu"
      :unique-opened="true"
      :router="true">
      <el-menu-item v-for="item in getSubMenuList.MenuList"
        :index="getSubMenuList.index+item.index"
        :key="item.key">{{item.name}}</el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HomeMenu',
  computed: {
    ...mapGetters(['getSubMenuList', 'getActiveMenu']),
  },
  methods: {
  }
};
</script>
<style lang="less" scoped>
</style>
