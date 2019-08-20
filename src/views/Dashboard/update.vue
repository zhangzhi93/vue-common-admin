<template>
  <div>
    <p>更新日志</p>
    <input type="text"
      v-model="log">
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      log: '',
    };
  },
  methods: {

  },
};
</script>

<style lang="less" scoped>
</style>
