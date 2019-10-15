<template>
  <div>
    <tree-select :treeData="data" v-model="value" placeholder="请选择组织" size="small"></tree-select>
    <br>
    <el-button @click="value=8">设置选中节点二级 3-2</el-button>
    <el-button @click="value=2">设置选中节点一级 2</el-button>
    <el-button @click="value=10">设置选中节点三级 1-1-2</el-button>
  </div>
</template>

<script>
import TreeSelect from '../../components/TreeSelect.vue';

export default {
  name: 'DiyTreeSelect',
  components: {
    TreeSelect,
  },
  data() {
    return {
      value: 2,
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1',
          }, {
            id: 10,
            label: '三级 1-1-2',
          }],
        }],
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1',
        }, {
          id: 6,
          label: '二级 2-2',
        }],
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1',
        }, {
          id: 8,
          label: '二级 3-2',
        }],
      }],
    };
  },
  watch: {
    value(val) {
      console.log(val);
    },
  },
  methods: {

  },
};
</script>

<style lang="less" scoped>
</style>
