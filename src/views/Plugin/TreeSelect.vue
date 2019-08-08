<template>
  <el-form ref="form" :model="form" label-width="180px" size="small" class="form">
    <el-form-item label="多选">
      <treeselect v-model="form.name" :multiple="true" :options="options" placeholder="请选择" />
      <pre class="result">{{ form.name }}</pre>
    </el-form-item>
    <el-form-item label="异步搜索">
      <treeselect v-model="form.sync" :multiple="true" :async="true" :load-options="loadOptions"
        defaultOptions placeholder="请选择" searchPromptText="请输入"/>
      <pre class="result">{{ form.sync }}</pre>
    </el-form-item>
    <el-form-item label="本地搜索">
      <treeselect v-model="form.local" :multiple="true" :options="options" :searchable="false"
        value-consists-of="LEAF_PRIORITY" showCount :limit="5" :limitText="renderLimitText" placeholder="请选择" />
      <pre class="result">{{ form.local }}</pre>
    </el-form-item>
    <el-form-item label="vuex异步加载子节点">
      <treeselect v-model="form.vuexSync" :multiple="true" :async="true" :searchable="false" :load-options="loadOptions" placeholder="请选择"/>
      <pre class="result">{{ form.vuexSync }}</pre>
    </el-form-item>
  </el-form>
</template>

<script>
import Treeselect, { ASYNC_SEARCH } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

const simulateAsyncOperation = fn => {
  setTimeout(fn, 800)
}

export default {
  components: {
    Treeselect
  },
  data() {
    return {
      form: {
        name: null,
        sync: null,
        local: null,
        vuexSync: null
      },
      options: [{
        id: 'a',
        label: 'a',
        children: [{
          id: 'aa',
          label: 'aa',
        }, {
          id: 'ab',
          label: 'ab',
        }],
      }, {
        id: 'b',
        label: 'b',
        children: [{
          id: 'bb',
          label: 'bb',
        }, {
          id: 'bc',
          label: 'bc',
        },{
          id: 'bd',
          label: 'bd',
        },{
          id: 'be',
          label: 'be',
        }],
      }, {
        id: 'c',
        label: 'c',
      }],
    }
  },
  methods: {
    loadOptions({ action, searchQuery, callback }) {
      if (action === ASYNC_SEARCH) {
        simulateAsyncOperation(() => {
          const options = [1, 2, 3, 4, 5].map(i => ({
            id: `${searchQuery}-${i}`,
            label: `${searchQuery}-${i}`,
          }))
          callback(null, options)
        })
      }
    },
    renderLimitText(count) {
      return `+${count}`
    }
  },
}
</script>

<style lang="less" scoped>
.form {
  margin: 30px auto;
  width: 800px;
}
.result {
  margin: 1em 0;
  padding: 1em 1.5em;
  background: rgba(0, 0, 0, 0.025);
  border: 0;
  border-radius: 5px;
  font-size: 12px;
}
</style>
