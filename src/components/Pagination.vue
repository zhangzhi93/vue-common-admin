<template>
  <div class="pagination">
    <a-pagination v-model="pageNum" v-bind="$attrs" :pageSize="pageSize * 1" />
    <a-auto-complete
      v-model="pageSize"
      :data-source="sizeInput.pageSizeOptions"
      :placeholder="sizeInput.placeholder"
      defaultActiveFirstOption
      class="pagination-auto-complete"
      @change="onSizeChange"
    >
      <a-input suffix="条/页" />
    </a-auto-complete>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    size: {
      type: String,
      default: 'small'
    },
    value: {
      type: Number,
      default: 1
    },
    pagination: {
      type: Object,
      default: () => { }
    },
    sizeInput: {
      type: Object,
      default: () => {
        return {
          pageSizeOptions: ['10', '20', '50'],
          placeholder: '请输入'
        };
      }
    }
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
    };
  },
  watch: {
    value: {
      handler(val) {
        this.pageNum = val;
      },
      immediate: true
    },
    pageNum(val) {
      this.$emit('change', val);
    },
    'sizeInput.pageSizeOptions': {
      handler(option) {
        this.pageSize = option[0];
      },
      immediate: true
    },
    pageSize(val) {
      if (!val) {
        this.pageSize = 10;
      }
    }
  },
  methods: {
    onSizeChange(val) {
      this.pageSize = val;
      this.$emit('size-change', val);
    }
  }
};
</script>

<style lang="less" scoped>
.pagination {
  display: flex;
  padding: 10px 20px;
}
.pagination-auto-complete {
  width: 100px;
  margin-left: 10px;
}
</style>
