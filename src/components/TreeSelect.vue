<template>
  <div class="tree-select">
    <el-popover v-model="visible" placement="bottom-start" trigger="click" :width="width" @show="computeWidth"
      popper-class="tree-select-popover" :disabled="disabled" transition="el-zoom-in-top">
      <el-tree :data="data" :props="treeProps" @node-click="handleNodeClick" highlight-current
        :expand-on-click-node="false" :node-key="nodeKey" empty-text="暂无数据" :current-node-key="currentNodekey"
        ref="tree"></el-tree>
      <el-input :value="selectName" :size="size" :placeholder="placeholder" readonly :disabled="disabled"
        @click="popSlideDown" class="tree-select-input" slot="reference" ref="input">
        <i slot="suffix" :class="['el-input__icon', 'el-icon-arrow-down',visible?'is-reverse':'']"></i>
      </el-input>
    </el-popover>
  </div>
</template>

<script>

export default {
  name: 'TreeSelect',
  model: {
    prop: 'currentNodekey',
    event: 'change',
  },
  props: {
    currentNodekey: {
      type: [String, Number],
    },
    nodeKey: {
      type: String,
      default: 'id',
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    size: {
      type: String,
      default: 'medium',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: [],
    },
    treeProps: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'label'
        }
      }
    }
  },
  data() {
    return {
      visible: false,
      selectName: '',
      width: 150,
    }
  },
  watch: {
    currentNodekey(val) {
      this.$refs.tree.setCurrentKey(val);
      this.selectName = this.$refs.tree.getCurrentNode()[this.treeProps.label];
    }
  },
  methods: {
    computeWidth() {
      this.width = this.$refs.input.$el.clientWidth;
    },
    handleNodeClick(data, checked, node) {
      this.$emit('change', data.id);
      this.$emit('tree-click', data, checked, node);
      this.visible = false;
    },
    popSlideDown() {
      this.visible = !this.visible;
    }
  },
  mounted() {
    this.selectName = this.$refs.tree.getCurrentNode()[this.treeProps.label];
  }
}
</script>

<style lang="less">
.tree-select-input {
  .el-input__inner {
    cursor: pointer;
  }
}
.tree-select-popover {
  box-sizing: border-box;
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #e3f2fd;
  }
}
.tree-select {
  .el-input .el-input__icon.is-reverse {
    transform: rotate(-180deg);
  }
}
</style>
