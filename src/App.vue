<template>
  <vue-element-layout :menu-data="data" :defaultActive="getActiveSliderMenuName"
    :show-footer="false">
    <layout-tabs slot="navTabs" :active-name="getTabActive" :tabs-data="getTabList" type="flex"
      @tab-click="onTabClick" @tab-remove="onTabRemove">
    </layout-tabs>
    <router-view />
  </vue-element-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import { RouterMap } from './router';
import { recursionConvert } from './utils/tools';

export default {
  name: 'app',
  data() {
    return {
      data: recursionConvert(RouterMap, 'children', item => ({
        name: item.name,
        title: item.meta.title,
        icon: item.meta.icon,
      }))
    }
  },
  computed: {
    ...mapGetters(['getActiveSliderMenuName', 'getTabList', 'getTabActive'])
  },
  methods: {
    onTabClick(data) {
      this.$router.replace(data.path)
    }
  }
};
</script>

<style lang="less" scoped>
</style>
