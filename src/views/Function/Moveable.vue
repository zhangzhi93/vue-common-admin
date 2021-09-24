<template>
  <div v-moveable class="move-block">
    <div v-resize class="resize"></div>
  </div>
</template>

<script>

export default {
  name: 'Moveable',
  data() {
    return {
    }
  },
  methods: {

  },
};
</script>

<style lang="less" scoped>
.move-block {
  width: 150px;
  height: 150px;
  border: 1px solid #8f8f8f;
  display: inline-block;
  position: absolute;
  .resize {
    width: 6px;
    height: 6px;
    position: absolute;
    right: -3px;
    bottom: -3px;
    background-color: #888;
    cursor: se-resize;
  }
}
</style>
