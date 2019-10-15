<template>
  <el-card class="expand-card">
    <div slot="header" class="header">
      <div class="action">
        <i class="el-icon-rank" @click="switchFull"></i>
      </div>
    </div>
    <div ref="content">
      <slot ></slot>
    </div>
  </el-card>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ExpandCard',
  data() {
    return {
      full: false,
    };
  },
  methods: {
    fullScreen() {
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
    },
    exitFullscreen() {
      if (document.exitFullScreen) {
        document.exitFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    },
    switchFull() {
      if (this.full) {
        this.exitFullscreen();
        this.full = false;
      } else {
        this.fullScreen();
        this.full = true;
      }
    },
  }
};
</script>
<style lang="less" scoped>
.expand-card {
  /deep/.el-card__header {
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
