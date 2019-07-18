<template>
  <div>
    <el-submenu v-if="item.children && item.children.length !== 0"
      :index="item.path">
      <template slot="title">
        <i class="el-icon-menu"></i>
        {{item.meta.title}}
      </template>

      <template v-for="child in item.children">
        <menu-item v-if="child.children && child.children.length !== 0"
          :item="child"
          :key="child.name" />
        <el-menu-item v-else
          :key="child.name"
          :index="child.path">
          <i class="el-icon-location"></i>
          {{child.meta.title}}
          <span>{{child.path}}</span>
        </el-menu-item>
      </template>
    </el-submenu>

    <template v-else>
      <el-menu-item :index="item.path">
        <i :class="['iconfont',item.icon]"></i>
        <span class="menu-title">{{item.meta.title}}</span>
        <span>{{child.path}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
};
</script>

<style lang="less">
</style>
