<template>
  <vue-element-layout :menu-data="data">
    <router-view />
  </vue-element-layout>
</template>

<script>
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
  }
};
</script>

<style lang="less" scoped>
</style>
