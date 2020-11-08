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
import { mapGetters, mapActions } from 'vuex';
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
    ...mapActions(['removeTabItem']),
    onTabClick(data) {
      this.$router.replace(data.path)
    },
    onTabRemove(data) {
      console.log(data);
      this.removeTabItem({
        payload: {
          name: data.name
        },
        callback: (res) => {
          console.log(res);
          this.$router.replace(res.path);
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
</style>
