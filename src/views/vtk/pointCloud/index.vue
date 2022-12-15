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
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';
import * as vtkMath from '@kitware/vtk.js/Common/Core/Math';
import { FieldAssociations } from '@kitware/vtk.js/Common/DataModel/DataSet/Constants';


import pointsData from './data.js';
import colorsData from './colors';



// ----------------------------------------------------------------------------
// 不需要处理监听的全局变量
// ----------------------------------------------------------------------------
let renderWindow = null;
let genericRenderWindow = null;
let renderer = null;
let GLWindow = null;
let interactor = null;
let apiSpecificRenderWindow = null;
let hardwareSelector = null;

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

  const pointsNumber = points.getNumberOfPoints();

  const colors = new Uint8Array(pointsNumber * 4);

  for (let i = 0; i < pointsNumber; i += 1) {
    const weight = colorsData[i];
    let opacity = 0;
    if (weight === 0) {
      opacity = 0;
    } else if (weight > 0 && weight < 5) {
      opacity = 0;
    } else if (weight >= 5 && weight < 15) {
      opacity = 150;
    } else if (weight >= 15 && weight < 30) {
      opacity = 220;
    } else if (weight >= 30 && weight < 40) {
      opacity = 220;
    } else if (weight >= 40 && weight < 50) {
      opacity = 220;
    } else if (weight >= 50) {
      opacity = 255;
    }
    colors[i * 4 + 0] = 0;
    colors[i * 4 + 1] = 255;
    colors[i * 4 + 2] = 0;
    colors[i * 4 + 3] = opacity;
  }
  polyData.setPoints(points);
  polyData.setVerts(cellArray);
  polyData.getPointData().addArray(
    vtkDataArray.newInstance({
      name: 'Colors',
      numberOfComponents: 4,
      values: colors,
    })
  );

  // let radiusData = new Float32Array(pointsNumber);

  // radiusData.fill(10.0);

  // const radius = vtkDataArray.newInstance({
  //   name: 'Radius',
  //   values: radiusData,
  // });
  // polyData.getPointData().addArray(radius);
  // const ctfun = vtkColorTransferFunction.newInstance();
  // ctfun.addRGBPoint(200.0, 0.4, 0.2, 0.0);
  // ctfun.addRGBPoint(2000.0, 1.0, 1.0, 1.0);
  // console.log(ctfun);

  console.log(polyDataMapper);
  polyDataMapper.setColorByArrayName('Colors');
  polyDataMapper.setScalarModeToUsePointFieldData();
  // polyDataMapper.setColorModeToDirectScalars();
  // polyDataMapper.set({
  //   scalarVisibility: true,
  //   interpolateScalarsBeforeMapping: false,
  // });
  polyDataMapper.setInputData(polyData);
  actor.setMapper(polyDataMapper);
  console.log(actor.getProperty());
  actor.getProperty().setPointSize(5);
  // actor.getProperty().setRGBTransferFunction(0, ctfun);
  return actor;
};

const renderCubeAxes = (camera, actor) => {
  const cubeAxes = vtkCubeAxesActor.newInstance({
    camera: camera
  });
  // cubeAxes.setCamera(camera);
  cubeAxes.setDataBounds(actor.getBounds());
  return cubeAxes;
};

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

const createPointer = () => {
  const pointerSource = vtkSphereSource.newInstance({
    phiResolution: 15,
    thetaResolution: 15,
    radius: 0.05,
  });
  const pointerMapper = vtkMapper.newInstance();
  const pointerActor = vtkActor.newInstance();
  pointerMapper.setInputConnection(pointerSource.getOutputPort());
  pointerActor.setMapper(pointerMapper);
  pointerActor.setPosition([91.43099975585938, 468.30450439453125, -343.6517639160156]);
  return pointerActor;
};

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

  // const pointerActor = createPointer();

  const pointCloudCubeAxes = renderCubeAxes(camera, pointCloudActor);

  renderer.addActor(pointCloudActor);
  // renderer.addActor(pointerActor);
  // renderer.addActor(pointCloudCubeAxes);

  genericRenderWindow.resize();

  renderer.resetCamera();
  renderWindow.render();

  //
  apiSpecificRenderWindow = interactor.getView();

  //
  hardwareSelector = apiSpecificRenderWindow.getSelector();

  hardwareSelector.setFieldAssociation(FieldAssociations.FIELD_ASSOCIATION_POINTS);
  hardwareSelector.setCaptureZValues(true);

  function eventToCanvasXY(event) {
    // We know we are full screen => window.innerXXX
    // Otherwise we can use pixel device ratio or else...
    const { offsetX, offsetY } = event;
    const [width, height] = apiSpecificRenderWindow.getSize();
    // console.log(vtkVolumeRef.value.offsetWidth);
    const x = Math.round((width * offsetX) / vtkVolumeRef.value.offsetWidth);
    const y = Math.round(height * (1 - offsetY / vtkVolumeRef.value.offsetHeight)); // Need to flip Y
    return [x, y];
  }

  function processSelections(selections) {
    if (!selections || selections.length === 0) {
      return;
    }

    const {
      worldPosition: rayHitWorldPosition,
      compositeID,
      prop,
      propID,
      attributeID,
    } = selections[0].getProperties();

    console.log(selections);
    console.log(selections[0].getProperties());
    console.log(hardwareSelector.getFieldAssociation());
    let closestCellPointWorldPosition = [...rayHitWorldPosition];
    if (attributeID || attributeID === 0) {
      const input = prop.getMapper().getInputData();
      if (!input.getCells()) {
        input.buildCells();
      }
      if (hardwareSelector.getFieldAssociation() === FieldAssociations.FIELD_ASSOCIATION_POINTS) {
        // Selecting points
        // closestCellPointWorldPosition = [
        //   ...input.getPoints().getTuple(attributeID),
        // ];
        console.log('attributeID', attributeID);
        // console.log(prop.getMapper().getInputData().getPoints().getTuple(attributeID));
      }
    }
    // pointerActor.setPosition(closestCellPointWorldPosition);
    renderWindow.render();
  }

  document.addEventListener('mousedown', (event) => {
    console.log(event);
    const [x, y] = eventToCanvasXY(event);
    console.log(x, y);
    hardwareSelector.getSourceDataAsync(renderer, x, y, x, y).then((result) => {
      console.log(result);
      console.log(result.generateSelection(x, y, x, y));
      if (result) {
        processSelections(result.generateSelection(x, y, x, y));
      } else {
        processSelections(null);
      }
    });
  });
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
