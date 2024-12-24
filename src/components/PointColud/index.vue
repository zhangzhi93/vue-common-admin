<template>
  <div ref="vtkContainerRef" class="vtk-container">
    <div ref="vtkVolumeRef" class="vtk-content" />
    <div v-if="flexible" class="vtk-toggle-btn" @click="onToggle">
      <fullscreen-outlined v-if="!expand" />
      <fullscreen-exit-outlined v-else />
    </div>
    <a-tooltip v-if="surfaceAdded" placement="bottom">
      <template #title>
        <span>{{ visible ? '隐藏表面' : '显示表面' }}</span>
      </template>
      <div class="vtk-toggle-surface" @click="onToggleSurface">
        <EyeOutlined v-if="visible" />
        <EyeInvisibleOutlined v-else />
      </div>
    </a-tooltip>
  </div>
</template>

<script setup>
import delaunator from 'delaunator';
import '@kitware/vtk.js/Rendering/Profiles/All';

import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow';
import vtkPoints from '@kitware/vtk.js/Common/Core/Points';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
import vtkCellArray from '@kitware/vtk.js/Common/Core/CellArray';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
import vtkCubeAxesActor from '@kitware/vtk.js/Rendering/Core/CubeAxesActor';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';
import vtkPointPicker from '@kitware/vtk.js/Rendering/Core/PointPicker';
import vtkGlyph3DMapper from '@kitware/vtk.js/Rendering/Core/Glyph3DMapper';
import vtkPlaneSource from '@kitware/vtk.js/Filters/Sources/PlaneSource';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import * as vtkMath from '@kitware/vtk.js/Common/Core/Math';
import { FieldAssociations } from '@kitware/vtk.js/Common/DataModel/DataSet/Constants';

import { FullscreenOutlined, FullscreenExitOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue';

import colorsData from './colors';

const emit = defineEmits(['selectPoint', 'toggle']);

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  pointSize: {
    type: Number,
    default: 0.08,
  },
  flexible: {
    type: Boolean,
    default: false,
  },
});

// ----------------------------------------------------------------------------
// 不需要处理监听的全局变量
// ----------------------------------------------------------------------------
const genericRenderWindow = vtkGenericRenderWindow.newInstance({
  background: [0, 0, 0],
});

const vtkData = {
  renderWindow: genericRenderWindow.getRenderWindow(), // 获取渲染窗口实例
  renderer: genericRenderWindow.getRenderer(), // 渲染器实例
  GLWindow: genericRenderWindow.getApiSpecificRenderWindow(), // 获取OpenGL窗口实例
  interactor: genericRenderWindow.getInteractor(), // 渲染窗口的交互对象
  camera: null,
  surfaceActor: null,
  polyDataMapper: vtkMapper.newInstance(),
  planeSource: vtkPlaneSource.newInstance(),
};

const pointCloud = {
  points: vtkPoints.newInstance(),
  cells: vtkCellArray.newInstance(),
  polyData: vtkPolyData.newInstance(),
  sphereSource: vtkSphereSource.newInstance({
    radius: props.pointSize,
    phiResolution: 10,
    thetaResolution: 10,
  }),
  polyDataMapper: vtkGlyph3DMapper.newInstance({
    orient: false, // 点云点没有方向信息
    scaling: false, // 点云点不需要根据点的自身信息进行缩放
    scaleMode: vtkGlyph3DMapper.ScaleModes.SCALE_BY_CONSTANT,
  }),
  polyDataActor: vtkActor.newInstance(),
  pointerActor: null,
  pointerSphere: vtkSphereSource.newInstance({
    radius: props.pointSize * 1 + 0.03,
    phiResolution: 10,
    thetaResolution: 10,
  }),
  colors: null,
};

// ----------------------------------------------------------------------------
// proxy绑定的变量，相当于vue2中的data
// ----------------------------------------------------------------------------

const vtkContainerRef = ref(null);
const vtkVolumeRef = ref(null);
const expand = ref(false);
const surfaceAdded = ref(false);
const visible = ref(true);

// ----------------------------------------------------------------------------
// methods方法
// ----------------------------------------------------------------------------

// 监听窗口变化
const resizeObserver = new ResizeObserver((entries) => {
  // 窗口大小重置
  genericRenderWindow.resize();
  // 重新设置相机
  // vtkData.renderer.resetCamera();
});

// 生成面点云actor
const initPlanPolyDataActor = (data) => {
  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const pointIndex = pointCloud.points.insertNextPoint(...point);
    pointCloud.cells.insertNextCell([pointIndex]);
  }

  pointCloud.polyData.setPoints(pointCloud.points);
  pointCloud.polyData.setVerts(pointCloud.cells);

  pointCloud.polyDataMapper.setInputData(pointCloud.polyData);

  pointCloud.polyDataActor.setMapper(pointCloud.polyDataMapper);
  pointCloud.polyDataActor.getProperty().setPointSize(5);
};

// 生成面
const renderPointsSurface = (data) => {
  const cells = vtkCellArray.newInstance();
  const points = vtkPoints.newInstance();
  const polyData = vtkPolyData.newInstance();
  const surfaceMapper = vtkMapper.newInstance();
  const surfaceActor = vtkActor.newInstance();

  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const pointIndex = points.insertNextPoint(...point);
  }

  const zData = data.map((item) => [item[0], item[1]]);

  const delaunayData = delaunator.from(zData);
  const triangles = delaunayData.triangles;

  for (var i = 0; i < triangles.length; i += 3) {
    cells.insertNextCell([triangles[i], triangles[i + 1], triangles[i + 2]]);
  }

  polyData.setPoints(points);
  polyData.setPolys(cells);

  surfaceMapper.setInputData(polyData);

  surfaceActor.setMapper(surfaceMapper);

  surfaceActor.getProperty().setColor(0.5, 0.5, 0.5);

  return surfaceActor;
};

// 生成球点云
const initPointCloud = (data = [], defalutColor = [255, 255, 255, 255]) => {
  //
  const colorData = new Uint8Array(data.length * 4);

  for (let i = 0; i < data.length; i++) {
    pointCloud.points.insertNextPoint(data[i][0], data[i][1], data[i][2]);

    colorData[i * 4 + 0] = defalutColor[0];
    colorData[i * 4 + 1] = defalutColor[1];
    colorData[i * 4 + 2] = defalutColor[2];
    colorData[i * 4 + 3] = defalutColor[3];
  }

  pointCloud.polyData.setPoints(pointCloud.points);

  pointCloud.colors = vtkDataArray.newInstance({
    numberOfComponents: 4, // 每个颜色有4个分量（R、G、B, A）
    values: colorData,
    name: 'Colors',
  });

  // 添加颜色数据
  pointCloud.polyData.getPointData().setScalars(pointCloud.colors);

  pointCloud.polyDataMapper.setInputData(pointCloud.polyData, 0);
  pointCloud.polyDataMapper.setInputConnection(pointCloud.sphereSource.getOutputPort(), 1);

  pointCloud.polyDataActor.setMapper(pointCloud.polyDataMapper);
  // pointCloud.polyDataActor.getProperty().setPointSize(5);
  return pointCloud.polyDataActor;
};

// 渲染正方形坐标盒
const renderCubeAxes = (camera, actor) => {
  const cubeAxes = vtkCubeAxesActor.newInstance({
    camera: camera,
  });
  cubeAxes.setDataBounds(actor.getBounds());
  return cubeAxes;
};

// 创建点云选择标识点
const createPointer = () => {
  const pointerMapper = vtkMapper.newInstance();
  const pointerActor = vtkActor.newInstance();
  pointerMapper.setInputConnection(pointCloud.pointerSphere.getOutputPort());
  pointerActor.setMapper(pointerMapper);
  pointerActor.getProperty().setColor([0, 255, 0]);
  return pointerActor;
};

// 初始化
const init = () => {
  // 设置窗口显示的dom节点
  genericRenderWindow.setContainer(vtkVolumeRef.value);

  // 获取相机实例
  vtkData.camera = vtkData.renderer.getActiveCamera();

  // 设置平行投影
  // 设置为true，物体近大远小
  vtkData.camera.setParallelProjection(true);
  vtkData.camera.setParallelScale(1);
  // vtkData.camera.setViewUp([0, 1, 0]);

  // 向渲染窗口添加渲染器
  // vtkData.renderWindow.addRenderer(vtkData.renderer);
  // 向渲染窗口添加OpenGL渲染窗口，渲染3d内容，并且需要调用webGL的api，需要添加GLwindow
  // vtkData.renderWindow.addView(vtkData.GLWindow);

  // 向渲染窗口设置交互器
  vtkData.renderWindow.setInteractor(vtkData.interactor);
  //
  vtkData.interactor.setView(vtkData.GLWindow);
  // 交互器初始化
  vtkData.interactor.initialize();

  // 生成点云actor

  // 添加点云actor
  vtkData.renderer.addActor(initPointCloud(toRaw(props.data)));

  // const pointCloudCubeAxes = renderCubeAxes(vtkData.camera, vtkData.polyDataActor);

  // vtkData.renderer.addActor(pointCloudCubeAxes);

  // 添加指示点actor
  pointCloud.pointerActor = createPointer();
  vtkData.renderer.addActor(pointCloud.pointerActor);
  pointCloud.pointerActor.setVisibility(false);

  resetVtkRenderer();
  // // 渲染
  vtkData.renderWindow.render();
};

//
// function setPointCloudColor(pointsLength, defalutColor = [255, 255, 255, 255]) {
//   // if (pointsLength === 0) return;

//   const colors = new Uint8Array(pointsLength * 4);

//   for (let i = 0; i < pointsLength; i += 1) {
//     colors[i * 4 + 0] = defalutColor[0];
//     colors[i * 4 + 1] = defalutColor[1];
//     colors[i * 4 + 2] = defalutColor[2];
//     colors[i * 4 + 3] = defalutColor[3];
//   }

//   vtkData.colors = vtkDataArray.newInstance({
//     numberOfComponents: 4, // 每个颜色有4个分量（R、G、B, A）
//     values: colors,
//     name: 'Colors',
//   });

//   // 添加颜色数据
//   vtkData.polyData.getPointData().setScalars(vtkData.colors);

//   //
//   vtkData.renderWindow.render();
// }

// 选择点云点的事件
function onPickerPoint() {
  const eventXY = {
    x: 0,
    y: 0,
  };
  const picker = vtkPointPicker.newInstance();

  // 设置 1 声明picker只对添加到list里面的actor进行拾取，0 则对所有actor进行拾取
  picker.setPickFromList(1);
  // 初始化拾取列表
  picker.initializePickList();
  // 添加要拾取的actor
  picker.addPickList(pointCloud.polyDataActor);
  // 设置拾取灵敏度，越大拾取的范围越大，可能导致点击离点很远的地方，点就被选中的问题
  picker.setTolerance(props.pointSize);

  vtkData.interactor.onLeftButtonPress(({ position }) => {
    eventXY.x = position.x;
    eventXY.y = position.y;
  });

  vtkData.interactor.onLeftButtonRelease(({ position }) => {
    const dx = position.x - eventXY.x;
    const dy = position.y - eventXY.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 1) {
      picker.pick([position.x, position.y, 0.0], vtkData.renderer);

      if (picker.getActors().length > 0) {
        const pointId = picker.getPointId();
        emit('selectPoint', pointId);
        pointCloud.pointerActor.setPosition(pointCloud.polyData.getPoints().getPoint(pointId));
        pointCloud.pointerActor.setVisibility(true);
        vtkData.renderWindow.render();
      } else {
        pointCloud.pointerActor.setVisibility(false);
        vtkData.renderWindow.render();
      }
    }
  });
}

// 添加物体表面
function renderSurface(data) {
  if (vtkData.renderer.hasViewProp(vtkData.surfaceActor)) {
    vtkData.surfaceActor.setVisibility(true);
  } else {
    vtkData.surfaceActor = renderPointsSurface(data);
    vtkData.renderer.addActor(vtkData.surfaceActor);
  }

  surfaceAdded.value = true;
  visible.value = true;

  resetVtkRenderer();
}

function removeSurface() {
  if (vtkData.renderer.hasViewProp(vtkData.surfaceActor)) {
    vtkData.renderer.removeActor(vtkData.surfaceActor);
  }

  surfaceAdded.value = false;
  visible.value = false;

  resetVtkRenderer();
}

// 修改第几个点的颜色  updatePointCloudColor
function changeColorOfRange(indexes, color) {
  for (let i = 0; i < indexes.length; i++) {
    pointCloud.colors.setTuple(indexes[i], color);
  }
  // 通知vtk polyData 依赖的数据已经改变了
  pointCloud.polyData.modified();

  // 渲染
  vtkData.renderWindow.render();
}

//
function changeColorStartToEnd(start, end, color = [255, 255, 255, 255]) {
  for (let i = start; i <= end; i++) {
    pointCloud.colors.setTuple(i, color);
  }
  // 通知vtk polyData 依赖的数据已经改变了
  pointCloud.polyData.modified();

  // 渲染
  vtkData.renderWindow.render();
}

// 重新渲染颜色
function reRenderColor(colors) {
  for (let i = 0; i < colors.length; i++) {
    pointCloud.colors.setTuple(i, colors[i]);
  }
  // 通知vtk polyData 依赖的数据已经改变了
  pointCloud.polyData.modified();

  // 渲染
  vtkData.renderWindow.render();
}

// updatePointCloudFromNewPoints
// 追加点
function appendPoints(data, color = [255, 255, 255, 255]) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < data.length; i++) {
      pointCloud.points.insertNextPoint(data[i][0], data[i][1], data[i][2]);
      pointCloud.colors.insertNextTuple(color);
      // vtkData.cells.insertNextCell([pointIndex]);
    }

    // 通知vtk points 数据有改变，（重要，声明了datachange后，点云边界才会进行更新）
    pointCloud.points.dataChange();

    // 通知vtk polyData 依赖的数据已经改变了
    pointCloud.polyData.modified();

    // // 计算新点云的边界
    // const bounds = pointCloud.polyData.getBounds(); // (xmin, xmax, ymin, ymax, zmin, zmax)

    // // 设置相机的观察参数
    // vtkData.camera.setPosition(
    //   bounds[0] - (bounds[1] - bounds[0]) / 2,
    //   bounds[2] - (bounds[3] - bounds[2]) / 2,
    //   bounds[4],
    // );
    // vtkData.camera.setFocalPoint(
    //   bounds[0] - (bounds[1] - bounds[0]) / 2,
    //   bounds[2] - (bounds[3] - bounds[2]) / 2,
    //   bounds[4] - (bounds[5] - bounds[4]) / 2,
    // );
    // vtkData.camera.setViewUp([0, 1, 0]);

    resetVtkRenderer();

    resolve();
    // vtkData.renderer.resetCameraClippingRange();

    // vtkData.renderer.resetCamera();
    // // // 更新渲染窗口
    // vtkData.renderWindow.render();
  });
}

function getPointsData() {
  const data = pointCloud.polyData.getPoints().getData();
  const result = [];
  for (let i = 0; i < data.length; i += 3) {
    result.push(data.slice(i, i + 3));
  }
  return result;
}

function setViewUp(vector) {
  vtkData.camera.setViewUp(vector);
  resetVtkRenderer();
}

// 清除所有点
function clearPoints() {
  //
  pointCloud.points.initialize();
  pointCloud.colors.initialize();
  // 通知vtk points 数据有改变，（重要，声明了datachange后，点云边界才会进行更新）
  pointCloud.points.dataChange();

  // 通知vtk polyData 依赖的数据已经改变了
  pointCloud.polyData.modified();

  //
  pointCloud.pointerActor.setVisibility(false);

  resetVtkRenderer();
}

// 截图
const onCaptureImage = () => {
  return vtkData.renderWindow.captureImages()[0];
};

//
const onToggle = () => {
  expand.value = !expand.value;
  emit('toggle', expand.value);
};

const onToggleSurface = () => {
  visible.value = !visible.value;
  vtkData.surfaceActor.setVisibility(visible.value);
  // 更新渲染窗口
  resetVtkRenderer();
};

const onResume = () => {
  clearPoints();
  removeSurface();
};

//
const resetVtkRenderer = () => {
  genericRenderWindow.resize();
  // 重置渲染器
  vtkData.renderer.resetCameraClippingRange();
  vtkData.renderer.resetCamera();

  // 更新渲染窗口
  vtkData.renderWindow.render();
};

defineExpose({
  appendPoints,
  clearPoints,
  changeColorOfRange,
  changeColorStartToEnd,
  reRenderColor,
  onCaptureImage,
  renderSurface,
  removeSurface,
  getPointsData,
  setViewUp,
  onResume,
});

// ----------------------------------------------------------------------------
// 观察方法
// ----------------------------------------------------------------------------

// 如果修改了点的半径，重新设置渲染点云点的大小
watch(
  () => props.pointSize,
  (size) => {
    pointCloud.sphereSource.setRadius(size);
    pointCloud.pointerSphere.setRadius(size * 1 + 0.02);
    // 更新渲染窗口
    vtkData.renderWindow.render();
  },
);

// ----------------------------------------------------------------------------
// 生命周期方法
// ----------------------------------------------------------------------------

onMounted(() => {
  init();
  onPickerPoint();
  resizeObserver.observe(vtkContainerRef.value);
});

onBeforeUnmount(() => {
  resizeObserver.unobserve(vtkContainerRef.value);
});
</script>

<style lang="less" scoped>
.vtk-container {
  height: 100%;
  width: 100%;
  position: relative;
}

.vtk-content {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.vtk-toggle-btn {
  position: absolute;
  bottom: 1px;
  right: 5px;

  :deep(.anticon) {
    font-size: 18px;
    color: #fff;
    cursor: pointer;
  }
}
.vtk-toggle-surface {
  position: absolute;
  top: 10px;
  right: 10px;
  :deep(.anticon) {
    font-size: 18px;
    color: #fff;
    cursor: pointer;
  }
}
</style>
