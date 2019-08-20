<template>
  <div>
    <el-submenu v-if="item.children && item.children.length !== 0" :index="fullPath">
      <template slot="title">
        <i class="el-icon-menu"></i>
        {{item.meta.title}}
      </template>

      <template v-for="child in item.children">
        <menu-item v-if="child.children && child.children.length !== 0" :item="child" :key="child.name"
          :parentPath="fullPath" />
        <el-menu-item v-else :key="child.name" :index="`${fullPath}/${child.path}`">
          <i class="el-icon-location"></i>
          {{child.meta.title}}
        </el-menu-item>
      </template>
    </el-submenu>

    <template v-else>
      <el-menu-item :index="fullPath">
        <i :class="['iconfont',item.icon]"></i>
        <span>{{item.meta.title}}</span>
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
      required: true,
    },
    parentPath: {
      type: String,
    },
  },
  computed: {
    fullPath() {
      return `${this.parentPath}/${this.item.path}`;
    },
  },
};
</script>

<style lang="less">
</style>
