<template>
  <el-aside width="200px"
    class="slider-menu">
    <!-- <span @click="isCollapse=!isCollapse"
      :class="['toggle-icon iconfont',isCollapse?'iconspread':'iconshrink']"></span> -->
    <el-menu :default-active="getActiveSliderMenuName"
      :collapse="isCollapse"
      :collapse-transition="false"
      background-color="#323e47"
      text-color="#fff"
      active-text-color="#ffd04b"
      :unique-opened="true"
      router>
      <menu-item v-for="menu in getSubMenuList.children"
        :key="menu.name"
        :item="menu" />
    </el-menu>
  </el-aside>
</template>

<script>
import { mapGetters } from 'vuex';
import MenuItem from './MenuItem';

export default {
  name: 'Slider',
  data() {
    return {
      isCollapse: false,
    }
  },
  components: {
    MenuItem
  },
  computed: {
    ...mapGetters(['getSubMenuList', 'getActiveSliderMenuName']),
  },
  mounted() {
    console.log(this.getSubMenuList)
  }
};
</script>

<style lang="less">
@import url("./slider.less");
.iconfont {
  margin-right: 5px;
  font-size: 14px;
  color: #bfcbdb;
}
.toggle-icon {
  display: inline-block;
  font-size: 18px;
  color: #bfcbdb;
  padding: 10px;
  width: 100%;
  text-align: right;
  margin: 0;
  box-sizing: border-box;
  &::before {
    cursor: pointer;
  }
}
</style>
