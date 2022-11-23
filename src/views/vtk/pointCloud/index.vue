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
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';
import * as vtkMath from '@kitware/vtk.js/Common/Core/Math';


import pointsData from './data.js'



// ----------------------------------------------------------------------------
// 不需要处理监听的全局变量
// ----------------------------------------------------------------------------
let renderWindow = null;
let genericRenderWindow = null;
let renderer = null;
let GLWindow = null;
let interactor = null;

// ----------------------------------------------------------------------------
// proxy绑定的变量，相当于vue2中的data
// ----------------------------------------------------------------------------

const vtkContainerRef = ref(null);
const vtkVolumeRef = ref(null);


// ----------------------------------------------------------------------------
// methods方法
// ----------------------------------------------------------------------------

// 点云
const createPointCloud = (data) => {
  console.log(data.length);
  const points = vtkPoints.newInstance();
  const cellArray = vtkCellArray.newInstance();
  const polyData = vtkPolyData.newInstance();
  const polyDataMapper = vtkMapper.newInstance();
  const actor = vtkActor.newInstance();
  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const pointIndex = points.insertNextPoint(...point);
    cellArray.insertNextCell([pointIndex]);
  }

  const colors = new Uint8Array(points.getNumberOfPoints() * 3);
  for (let i = 0; i < colors.length; i += 3) {
    if (i > colors.length / 2) {
      colors[i + 0] = 0;
      colors[i + 1] = 255;
      colors[i + 2] = 255;
    } else {
      colors[i + 0] = 255;
      colors[i + 1] = 255;
      colors[i + 2] = 0;
    }
  }
  polyData.setPoints(points);
  polyData.setVerts(cellArray);
  polyData.getPointData().setScalars(
    vtkDataArray.newInstance({
      name: 'colors',
      numberOfComponents: 3,
      values: colors,
    })
  );
  polyDataMapper.setInputData(polyData);
  actor.setMapper(polyDataMapper);
  return actor;
};

const renderCubeAxes = (camera, actor) => {
  const cubeAxes = vtkCubeAxesActor.newInstance({
    camera: camera
  });
  // cubeAxes.setCamera(camera);
  cubeAxes.setDataBounds(actor.getBounds());
  return cubeAxes;
}

function setViweUp(direction, camera) {
  const focalPoint = camera.getFocalPoint();
  const position = camera.getPosition();

  const distance = Math.sqrt(
    vtkMath.distance2BetweenPoints(position, focalPoint)
  );

  if (direction === 'K') {
    camera.setPosition(
      focalPoint[0] + 0 * distance,
      focalPoint[1] + 0 * distance,
      focalPoint[2] - 1 * distance
    );

    camera.setViewUp(0, -1, 0);
  }

  if (direction === 'I') {
    camera.setPosition(
      focalPoint[0] + 1 * distance,
      focalPoint[1] + 0 * distance,
      focalPoint[2] + 0 * distance
    );

    camera.setViewUp(0, 0, 1);
  }

  if (direction === 'J') {
    camera.setPosition(
      focalPoint[0] + 0 * distance,
      focalPoint[1] - 1 * distance,
      focalPoint[2] + 0 * distance
    );

    camera.setViewUp(0, 0, 1);
  }
}

// 初始化
const init = () => {
  // 初始化vtkGenericRenderWindow实例
  genericRenderWindow = vtkGenericRenderWindow.newInstance({
    background: [0, 0, 0]
  });
  // 设置窗口显示的dom节点
  genericRenderWindow.setContainer(vtkVolumeRef.value);

  // 获取渲染窗口实例和渲染器实例
  renderWindow = genericRenderWindow.getRenderWindow();
  renderer = genericRenderWindow.getRenderer();

  // 获取OpenGL窗口实例
  // TODO: 暂时不清楚为什么需要添加OpenGLRenderWindow
  GLWindow = genericRenderWindow.getOpenGLRenderWindow();

  // 渲染窗口的交互对象
  interactor = genericRenderWindow.getInteractor();

  const camera = renderer.getActiveCamera();

  // 设置平行投影
  // 设置为true，物体近大远小
  camera.setParallelProjection(true);

  // 向渲染窗口添加渲染器
  renderWindow.addRenderer(renderer);
  // 向渲染窗口添加OpenGL渲染窗口
  renderWindow.addView(GLWindow);
  // 向渲染窗口设置交互器
  // renderWindow.setInteractor(interactor);
  //
  // interactor.setView(GLWindow);
  // 交互器初始化
  // interactor.initialize();

  // 初始化轨迹相机交互组件
  // const iStyle = vtkInteractorStyleTrackballCamera.newInstance();
  // 向交互器设置轨迹相机
  // interactor.setInteractorStyle(iStyle);

  // iStyle.setCenterOfRotation([60,450,-300]);

  // console.log(camera.getPosition());

  // camera.setPosition([0.5,0.5,1]);

  //

  // setViweUp('K', camera);

  const pointCloudActor = createPointCloud(pointsData);

  const pointCloudCubeAxes = renderCubeAxes(camera, pointCloudActor);

  renderer.addActor(pointCloudActor);
  renderer.addActor(pointCloudCubeAxes);

  genericRenderWindow.resize();

  renderer.resetCamera();
  renderWindow.render();
};

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
.vtk-container {
  height: calc(100vh - 109px);
}

.vtk-content {
  overflow: hidden;
  height: 100%;
}
</style>
