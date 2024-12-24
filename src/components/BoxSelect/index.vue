<template>
  <div
    ref="boxSelectRef"
    class="box-select-container"
    @mousedown.stop="onMouseDown"
    @mousemove.stop="onMouseMove"
    @mouseup.stop="onMouseUp"
  >
    <div class="box-select-content">
      <img :src="img">
    </div>
    <div class="box-select-modal" />
    <div
      class="box-select-area"
      :style="{ width: `${boxPos.width}px`, height: `${boxPos.height}px`, transform: `translateX(${boxPos.x}px) translateY(${boxPos.y}px)` }"
    >
      <span class="box-select-view">
        <!-- <img :src="img"> -->
      </span>
      <span class="box-select-move" />
      <span class="box-select-line line-l" />
      <span class="box-select-line line-r" />
      <span class="box-select-line line-t" />
      <span class="box-select-line line-b" />
      <span class="box-select-point point-l" />
      <span class="box-select-point point-r" />
      <span class="box-select-point point-t" />
      <span class="box-select-point point-b" />
      <span class="box-select-point point-lt" />
      <span class="box-select-point point-rt" />
      <span class="box-select-point point-lb" />
      <span class="box-select-point point-rb" />
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  img: {
    type: String,
    default: null
  }
});

const boxSelectRef = ref(null);

const boxPos = reactive({
  x: 156.511,
  y: 128.225,
  width: 415.378,
  height: 233.65
});

const container = {
  width: 0,
  height: 0
};

const mouseStatus = {
  handler: 'move',
  down: false,
  x: 0,
  y: 0,
  boxWidth: 0,
  boxHeight: 0
};

const onMouseDown = (e) => {
  console.log(e);
  mouseStatus.down = true;
  const className = e.target.className;
  console.log(className);
  if (className === 'box-select-modal') {
    boxPos.x = e.offsetX;
    boxPos.y = e.offsetY;
  }
  if (className === 'box-select-move') {
    mouseStatus.handler = 'move';
    mouseStatus.x = e.offsetX;
    mouseStatus.y = e.offsetY;
  }
  if (className === 'box-select-line line-r') {
    mouseStatus.handler = 'lineR';
    mouseStatus.x = e.clientX;
    mouseStatus.y = e.clientY;
    mouseStatus.boxWidth = boxPos.width;
    mouseStatus.boxHeight = boxPos.height;
  }

  if (className === 'box-select-line line-l') {
    mouseStatus.handler = 'lineR';
    mouseStatus.x = e.clientX;
    mouseStatus.y = e.clientY;
    mouseStatus.boxWidth = boxPos.width;
    mouseStatus.boxHeight = boxPos.height;
  }
};

const onMouseMove = (e) => {
  // 鼠标未按下则不执行操作
  console.log(mouseStatus.down);
  if (!mouseStatus.down) return;
  if (mouseStatus.handler === 'move') {
    const offsetLeft = boxPos.x + (e.offsetX - mouseStatus.x);
    const offsetTop = boxPos.y + (e.offsetY - mouseStatus.y);
    if (offsetLeft > 0 && offsetLeft + boxPos.width < container.width) {
      boxPos.x = offsetLeft;
    } else if (offsetLeft <= 0) {
      boxPos.x = 0;
    } else if (offsetLeft + boxPos.width >= container.width) {
      boxPos.x = container.width - boxPos.width;
    }

    if (offsetTop >= 0 && offsetTop + boxPos.height <= container.height) {
      boxPos.y = offsetTop;
    } else if (offsetTop <= 0) {
      boxPos.y = 0;
    } else if (offsetTop + boxPos.height >= container.height) {
      boxPos.y = container.height - boxPos.height;
    }
  }

  if (mouseStatus.handler === 'lineR') {
    boxPos.width = mouseStatus.boxWidth + (e.clientX - mouseStatus.x);
  }
};

const onMouseUp = (e) => {
  mouseStatus.down = false;
  mouseStatus.handler = '';
};

//
onMounted(() => {
  container.width = boxSelectRef.value.clientWidth;
  container.height = boxSelectRef.value.clientHeight;
});
</script>

<style lang="less" scoped>
.box-select-container {
  position: relative;
  overflow: hidden;
}

.box-select-content {
  img {
    width: 100%;
  }
}

.box-select-modal {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  cursor: crosshair;
  background-color: #000;
  opacity: 0.5;
}

.box-select-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
}

.box-select-view {
  display: block;
  height: 100%;
  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
  overflow: hidden;
  width: 100%;
}

.box-select-move {
  display: block;
  position: absolute;
  height: 100%;
  width: 100%;
  opacity: 0.1;
  cursor: move;
  background-color: #fff;
  left: 0;
  top: 0;
}

.box-select-line {
  display: block;
  position: absolute;
  height: 100%;
  width: 100%;
  opacity: 0.1;
}

.box-select-line {
  background-color: #39f;

  &.line-l {
    cursor: ew-resize;
    left: -2px;
    top: 0;
    width: 4px;
  }

  &.line-r {
    cursor: ew-resize;
    right: -2px;
    top: 0;
    width: 4px;
  }

  &.line-t {
    cursor: ns-resize;
    height: 4px;
    left: 0;
    top: -2px;
  }

  &.line-b {
    cursor: ns-resize;
    height: 4px;
    left: 0;
    bottom: -2px;
  }
}

.box-select-point {
  display: block;
  position: absolute;
  background-color: #39f;
  height: 6px;
  width: 6px;
  opacity: 0.8;

  &.point-l {
    cursor: ew-resize;
    left: -3px;
    margin-top: -3px;
    top: 50%;
  }

  &.point-r {
    cursor: ew-resize;
    right: -3px;
    top: 50%;
    margin-top: -3px;
  }

  &.point-t {
    cursor: ns-resize;
    left: 50%;
    top: -3px;
    margin-left: -3px;
  }

  &.point-b {
    cursor: s-resize;
    bottom: -3px;
    left: 50%;
    margin-left: -3px;
  }

  &.point-lt {
    cursor: nwse-resize;
    left: -3px;
    top: -3px;
  }

  &.point-rt {
    cursor: nesw-resize;
    right: -3px;
    top: -3px;
  }

  &.point-lb {
    cursor: nesw-resize;
    bottom: -3px;
    left: -3px;
  }

  &.point-rb {
    cursor: nwse-resize;
    bottom: -3px;
    right: -3px;
  }
}
</style>
