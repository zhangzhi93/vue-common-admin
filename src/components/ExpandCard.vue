<template>
  <a-card class="expand-card">
    <slot name="extra">
      <div class="action">
        <FullscreenOutlined @click="switchFull" />
      </div>
    </slot>
    <div ref="content">
      <slot />
    </div>
  </a-card>
</template>

<script setup>
import { FullscreenOutlined } from '@ant-design/icons-vue';

const full = ref(false);

const fullScreen = () => {
  const ele = document.querySelector('.expand-card');
  if (ele.requestFullscreen) {
    ele.requestFullscreen();
  } else if (ele.mozRequestFullScreen) {
    ele.mozRequestFullScreen();
  } else if (ele.webkitRequestFullscreen) {
    ele.webkitRequestFullscreen();
  } else if (ele.msRequestFullscreen) {
    ele.msRequestFullscreen();
  }
};
const exitFullscreen = () => {
  if (document.exitFullScreen) {
    document.exitFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};
const switchFull = () => {
  if (full.value) {
    exitFullscreen();
    full.value = false;
  } else {
    fullScreen();
    full.value = true;
  }
};
</script>
<style lang="less" scoped>
.expand-card {
  :deep(.el-card__header) {
    padding: 5px;
  }
}

.header {
  overflow: hidden;
}

.action {
  padding: 5px;
  float: right;
  margin-right: 10px;

  .el-icon-rank {
    cursor: pointer;
  }

  .el-select {
    width: 80px;
  }
}
</style>
