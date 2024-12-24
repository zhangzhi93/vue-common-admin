<template>
  <div ref="vtkContainerRef" class="vtk-container">
    <div ref="vtkVolumeRef" class="vtk-content" />
  </div>
</template>

<script setup>
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
import vtkGlyph3DMapper from '@kitware/vtk.js/Rendering/Core/Glyph3DMapper';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';
import * as vtkMath from '@kitware/vtk.js/Common/Core/Math';
import { FieldAssociations } from '@kitware/vtk.js/Common/DataModel/DataSet/Constants';

import colorsData from './colors';

const emit = defineEmits(['selectPoint']);

// ----------------------------------------------------------------------------
// 不需要处理监听的全局变量
// ----------------------------------------------------------------------------
const vtkStaticVar = {
  renderWindow: null,
  renderer: null,
  GLWindow: null,
  interactor: null,
  pointerActor: null,
  pointsIns: null,
  cellArray: null,
  polyData: [],
};

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

// ----------------------------------------------------------------------------
// proxy绑定的变量，相当于vue2中的data
// ----------------------------------------------------------------------------

const vtkContainerRef = ref(null);
const vtkVolumeRef = ref(null);

// 创建小球体模型
const sphereSource = vtkSphereSource.newInstance({ radius: 0.1 });

// ----------------------------------------------------------------------------
// methods方法
// ----------------------------------------------------------------------------

//
const initPolyData = (data) => {
  vtkStaticVar.pointsIns = vtkPoints.newInstance();
  vtkStaticVar.cellArray = vtkCellArray.newInstance();
  const polyData = vtkPolyData.newInstance();
  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const pointIndex = vtkStaticVar.pointsIns.insertNextPoint(...point);
    vtkStaticVar.cellArray.insertNextCell([pointIndex]);
  }

  // vtkStaticVar.pointsIns.setData(vtkStaticVar.pointsIns);
  polyData.setPoints(vtkStaticVar.pointsIns);
  polyData.setVerts(vtkStaticVar.cellArray);

  return polyData;
};

// 点云
const createPointCloud = (polyData) => {
  vtkStaticVar.polyDataMapper = vtkMapper.newInstance();

  const actor = vtkActor.newInstance();

  vtkStaticVar.polyDataMapper.setInputData(polyData);
  actor.setMapper(vtkStaticVar.polyDataMapper);
  actor.getProperty().setPointSize(2);
  return actor;
};

const renderCubeAxes = (camera, actor) => {
  const cubeAxes = vtkCubeAxesActor.newInstance({
    camera: camera,
  });
  // cubeAxes.setCamera(camera);
  cubeAxes.setDataBounds(actor.getBounds());
  return cubeAxes;
};

// 创建指示点
const createPointer = () => {
  const pointerSource = vtkSphereSource.newInstance({
    phiResolution: 15,
    thetaResolution: 15,
    radius: 0.15,
  });
  vtkStaticVar.pointerMapper = vtkMapper.newInstance();
  const pointerActor = vtkActor.newInstance();
  vtkStaticVar.pointerMapper.setInputConnection(pointerSource.getOutputPort());
  pointerActor.setMapper(vtkStaticVar.pointerMapper);
  pointerActor.getProperty().setColor([0, 255, 0]);
  return pointerActor;
};

// 初始化
const init = () => {
  // 初始化vtkGenericRenderWindow实例
  const genericRenderWindow = vtkGenericRenderWindow.newInstance({
    background: [0, 0, 0],
  });

  // 设置窗口显示的dom节点
  genericRenderWindow.setContainer(vtkVolumeRef.value);

  // 获取渲染窗口实例和渲染器实例
  vtkStaticVar.renderWindow = genericRenderWindow.getRenderWindow();
  vtkStaticVar.renderer = genericRenderWindow.getRenderer();

  console.log(vtkStaticVar.renderWindow);

  // 获取OpenGL窗口实例
  // TODO: 暂时不清楚为什么需要添加OpenGLRenderWindow
  vtkStaticVar.GLWindow = genericRenderWindow.getOpenGLRenderWindow();

  // 渲染窗口的交互对象
  vtkStaticVar.interactor = genericRenderWindow.getInteractor();

  vtkStaticVar.camera = vtkStaticVar.renderer.getActiveCamera();

  console.log(vtkStaticVar.camera);

  // 设置平行投影
  // 设置为true，物体近大远小
  vtkStaticVar.camera.setParallelProjection(true);

  // 向渲染窗口添加渲染器
  vtkStaticVar.renderWindow.addRenderer(vtkStaticVar.renderer);
  // 向渲染窗口添加OpenGL渲染窗口
  vtkStaticVar.renderWindow.addView(vtkStaticVar.GLWindow);

  // 向渲染窗口设置交互器
  vtkStaticVar.renderWindow.setInteractor(vtkStaticVar.interactor);

  //
  // interactor.setView(GLWindow);
  // 交互器初始化
  // interactor.initialize();

  // 初始化轨迹相机交互组件
  // const iStyle = vtkInteractorStyleTrackballCamera.newInstance();
  // 向交互器设置轨迹相机
  // interactor.setInteractorStyle(iStyle);

  vtkStaticVar.polyData = initPolyData(toRaw(props.data));
  vtkStaticVar.pointCloudActor = createPointCloud(vtkStaticVar.polyData);
  vtkStaticVar.renderer.addActor(vtkStaticVar.pointCloudActor);

  console.log(vtkStaticVar.polyData);

  // const pointCloudCubeAxes = renderCubeAxes(vtkStaticVar.camera, vtkStaticVar.pointCloudActor);

  // vtkStaticVar.renderer.addActor(pointCloudCubeAxes);

  //
  vtkStaticVar.pointerActor = createPointer();

  vtkStaticVar.renderer.addActor(vtkStaticVar.pointerActor);
  vtkStaticVar.pointerActor.setVisibility(false);

  //
  // onBindPointSelectEvent();

  // setViweUp('K', camera);

  genericRenderWindow.resize();

  vtkStaticVar.renderer.resetCamera();
  vtkStaticVar.renderWindow.render();
};

const onReceiveNewPoints = (data) => {
  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const pointIndex = vtkStaticVar.pointsIns.insertNextPoint(...point);
    vtkStaticVar.cellArray.insertNextCell([pointIndex]);
  }

  // vtkStaticVar.polyData.setPoints(vtkStaticVar.pointsIns);
  // vtkStaticVar.polyData.setVerts(vtkStaticVar.cellArray);
  vtkStaticVar.pointsIns.dataChange();

  vtkStaticVar.polyData.modified();

  // vtkStaticVar.pointsIns.modified();
  // vtkStaticVar.cellArray.modified();

  // vtkStaticVar.polyData.computeBounds();

  const bounds = vtkStaticVar.polyData.getBounds();

  // bounds[0] = 53;
  console.log(bounds);

  console.log(vtkStaticVar.camera.getFocalPoint());
  console.log(vtkStaticVar.camera.getPosition());
  // vtkStaticVar.camera.setParallelScale((bounds[3] - bounds[2]) / 2);
  vtkStaticVar.camera.setPosition(
    bounds[0] - (bounds[1] - bounds[0]) / 2,
    bounds[2] - (bounds[3] - bounds[2]) / 2,
    bounds[4],
  );
  vtkStaticVar.camera.setFocalPoint(
    bounds[0] - (bounds[1] - bounds[0]) / 2,
    bounds[2] - (bounds[3] - bounds[2]) / 2,
    bounds[4] - (bounds[5] - bounds[4]) / 2,
  );
  vtkStaticVar.camera.setViewUp([0, 1, 0]);

  // vtkStaticVar.camera.computeClippingRange();
  vtkStaticVar.renderer.resetCameraClippingRange();
  vtkStaticVar.renderer.resetCamera();

  // 更新mapper对象中的点云数据
  // vtkStaticVar.polyDataMapper.setInputData(vtkStaticVar.polyData);
  // vtkStaticVar.polyDataMapper.getInputData().modified();
  // vtkStaticVar.polyDataMapper.update();
  // vtkStaticVar.pointCloudActor.modified();
  // vtkStaticVar.renderer.modified();

  // 渲染
  vtkStaticVar.renderWindow.render();
};

// 获取点云点的颜色表
const getColorTable = (number, index = 0, color, defalutColor = [255, 255, 255, 255]) => {
  const colors = new Uint8Array(number * 4);

  for (let i = 0; i < number; i += 1) {
    if (i <= index) {
      colors[i * 4 + 0] = color[0];
      colors[i * 4 + 1] = color[1];
      colors[i * 4 + 2] = color[2];
      colors[i * 4 + 3] = color[3];
    } else {
      colors[i * 4 + 0] = defalutColor[0];
      colors[i * 4 + 1] = defalutColor[1];
      colors[i * 4 + 2] = defalutColor[2];
      colors[i * 4 + 3] = defalutColor[3];
    }
  }

  return colors;
};

// checkIdx 当前检查到的点，改变checkIdx点和之前所有点的颜色
function updatePointCloudColor(checkIdx) {
  vtkStaticVar.polyData.getPointData().removeArray(`Colors${checkIdx - 1}`);
  const colors = getColorTable(props.data.length, checkIdx, [255, 0, 0, 255]);

  // 添加颜色数据
  vtkStaticVar.polyData.getPointData().addArray(
    vtkDataArray.newInstance({
      name: `Colors${checkIdx}`,
      numberOfComponents: 4,
      values: colors,
    }),
  );

  // 使点云actor使用`Colors${checkIdx}`的颜色数据
  vtkStaticVar.polyDataActor.getMapper().setColorByArrayName(`Colors${checkIdx}`);
  vtkStaticVar.polyDataActor.getMapper().setScalarModeToUsePointFieldData();
  vtkStaticVar.polyDataActor.getMapper().setColorModeToDirectScalars();

  //
  vtkStaticVar.renderWindow.render();
}

// ----------------------------------------------------------------------------
// 生命周期方法
// ----------------------------------------------------------------------------

onMounted(() => {
  init();

  setInterval(() => {
    onReceiveNewPoints([
      [53 + Math.random(), 460 + Math.random() * 10, -347 - Math.random()],
      [53 + Math.random(), 460 + Math.random() * 10, -347 - Math.random()],
    ]);
  }, 2500);
});
</script>

<style lang="less" scoped>
.vtk-container {
  height: 100%;
}

.vtk-content {
  overflow: hidden;
  height: 100%;
}
</style>
