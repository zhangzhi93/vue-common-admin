<template>
  <div class="layout">
    <div v-moveable>
      <div v-resize class="resize"></div>
    </div>

    <!-- <div></div>
    <div></div>
    <div></div> -->
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
.layout {
  position: relative;
  min-height: calc(~"100vh - 95px");
  > div {
    width: 150px;
    height: 150px;
    border: 1px solid #8f8f8f;
    display: inline-block;
    position: absolute;
  }
  > div + div {
    margin-left: 10px;
  }
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
