<template>
  <div class="tree-select">
    <el-popover
      v-model="visible"
      placement="bottom-start"
      trigger="click"
      :width="width"
      @show="computeWidth"
      popper-class="tree-select-popover"
      transition="el-zoom-in-top"
    >
      <el-tree
        :data="treeData"
        :props="treeProps"
        :show-checkbox="multiple"
        :highlight-current="!multiple"
        :expand-on-click-node="false"
        :check-strictly="checkStrictly"
        :node-key="nodeKey"
        empty-text="暂无数据"
        :current-node-key="value"
        @node-click="onNodeClick"
        @check-change="onCheckChange"
        ref="tree"
      />
      <el-select
        :disabled="disabled"
        :value="showValue"
        :size="size"
        :multiple="multiple"
        :placeholder="placeholder"
        readonly
        @click="visible = !visible"
        @remove-tag="onRemoveTag"
        :collapse-tags="collapseTags"
        :multiple-limit="multipleLimit"
        slot="reference"
        ref="select"
        popper-class="select-tree-default-popper"
        class="n-select-tree-ipt"
      >
        <el-option v-for="item in options" :key="item[nodeKey]" :label="item[treeProps.label]" :value="item[nodeKey]" />
      </el-select>
    </el-popover>
  </div>
</template>

<script>

export default {
  name: 'TreeSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: [String, Number],
      default: null
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
      default: 'small',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    multipleLimit: {
      type: Number,
      default: 0,
    },
    collapseTags: {
      type: Boolean,
      default: false,
    },
    treeData: {
      type: Array,
      default: () => [],
    },
    treeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'label'
      })
    },
  },
  data() {
    return {
      visible: false,
      showValue: null,
      options: [],
      width: 150,
    };
  },
  watch: {
    visible(val) {
      const arrowDom = this.$refs.select.$el.querySelector('.el-select__caret');
      val ? arrowDom.classList.add('is-reverse') : arrowDom.classList.remove('is-reverse');
    },
    value: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(val);
          });
          const selectNode = this.$refs.tree.getNode(val);
          this.selectName = selectNode ? selectNode[this.treeProps.label] : '';
        } else {
          this.selectName = '';
        }
      },
      immediate: true
    },
    treeData: {
      handler(val) {
        if (this.value) {
          const selectNode = this.$refs.tree.getNode(val);
          this.selectName = selectNode ? selectNode[this.treeProps.label] : '';
        } else {
          this.selectName = '';
        }
      },
      deep: true
    }
  },
  methods: {
    computeWidth() {
      this.width = this.$refs.select.$el.clientWidth;
    },
    onNodeClick(data, checked, node) {
      if (this.multiple) {
        return;
      }
      this.renderOptions([data]);
      this.$emit('change', data[this.nodeKey]);
      this.$emit('tree-click', data, checked, node);
      this.visible = false;
    },
    onCheckChange(data, checked, node) {
      console.log(data, checked, node);
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      console.log(checkedNodes);
      this.renderOptions(checkedNodes);
    },
    onRemoveTag(val){
      this.$refs.tree.setChecked(val, false, !this.checkStrictly);
    },
    // 当选择树节点时给select一个默认option，不然select不会反显数据
    renderOptions(data) {
      this.options = data.map(item => ({
        [this.nodeKey]: item[this.nodeKey],
        [this.treeProps.label]: item[this.treeProps.label]
      }));
      this.showValue = this.multiple ? data.map(item => item[this.nodeKey]) : data[0][this.nodeKey];
    }
  },
};
</script>

<style lang="less">
.tree-select {
  .el-select .el-input.is-disabled .el-input__inner {
    cursor: pointer;
    background-color: #fff;
    border-color: #dcdfe6;
    color: #606266;
  }
  .el-input.is-disabled .el-input__icon {
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
.select-tree-default-popper{
  display: none;
}
.n-select-tree-ipt{
  width: 100%;
}
</style>
