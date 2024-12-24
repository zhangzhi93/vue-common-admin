import * as THREE from 'three';
import { EventDispatcher } from 'three';
import {
  OrbitControls,
  GLTFLoader,
  OBJLoader,
  FBXLoader,
  STLLoader,
  DRACOLoader,
  MTLLoader,
  PointerLockControls,
  CSS3DRenderer,
  CSS3DObject,
} from 'three/addons';

import {
  Camera,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Mesh,
  LoadingManager,
  Clock,
  Box3,
  GridHelper,
  AxesHelper,
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper,
  PointLight,
  PointLightHelper,
  Material,
  Object3D,
  BufferGeometry,
  Vector3Like,
  Vector3Tuple,
  Color,
  Texture,
  CubeTexture,
} from 'three';

import ResourceTracker from './ResourceTracker';

import type { GLTF } from 'three/addons';
import * as TWEEN from '@tweenjs/tween.js';
import { isString, getFileSuffix } from '@/utils/common';

enum FileType {
  GLB = 'glb',
  FBX = 'fbx',
  GLTF = 'gltf',
  OBJ = 'obj',
  STL = 'stl',
  MTL = 'mtl',
}

enum LightType {
  Ambient,
  Directional,
  Point,
}

export enum CameraType {
  OrthographicCamera = 'OrthographicCamera',
  PerspectiveCamera = 'PerspectiveCamera',
}

export enum ControlsType {
  OrbitControls,
  PointerLockControls,
}

type ModelParams = {
  filePath: string;
  fileType?: FileType;
  mtlPath?: string;
  wireframe?: boolean;
  emissive?: boolean;
  renderSize?: number;
  rotate?: THREE.Vector3Like;
  callback?: (event: ProgressEvent) => void;
};

type FileLoaderMap = {
  glb: GLTFLoader;
  gltf: GLTFLoader;
  fbx: FBXLoader;
  obj: OBJLoader;
  stl: STLLoader;
  mtl: MTLLoader;
};

type FileLoader = GLTFLoader | FBXLoader | OBJLoader | STLLoader | MTLLoader;

type RenderCamera = PerspectiveCamera | OrthographicCamera;

interface LoaderResolveResult {
  model: Object3D | null;
  box3: Box3;
  size: THREE.Vector3;
  center: THREE.Vector3;
}

const frustumSize = 12; // 定义视锥体的大小

class RenderScence extends ResourceTracker<{ render: { type: 'render'; target: any } }> {
  container: Element | null;
  config?: any;
  camera?: RenderCamera;
  scene?: Scene;
  renderer?: WebGLRenderer;
  css3DRenderer?: CSS3DRenderer;
  controls?: OrbitControls | PointerLockControls;
  models: any;
  tracker: any;
  raycaster: any;
  mouse: any;
  helper: any;
  light: any;
  loadingManager: LoadingManager | null;
  fileLoaderMap: FileLoaderMap;
  loader: GLTFLoader | FBXLoader | OBJLoader | STLLoader | MTLLoader | null;
  clock: Clock;
  loadingStatus: boolean;
  onWindowResizesListener: any;
  tween: any;
  roamConfig: any;

  constructor(selector: HTMLElement | string, config?: any) {
    super();
    this.container = selector instanceof HTMLElement ? selector : document.querySelector(selector);
    const configCopy = JSON.parse(JSON.stringify(config));
    this.config = {
      camera: configCopy.camera || {
        type: CameraType.PerspectiveCamera,
        position: { x: 0, y: 50, z: -30 },
        lookat: { x: 0, y: 0, z: 0 },
        up: { x: 0, y: 1, z: 0 },
      },
    };
    // 射线
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.helper = {
      skeletonHelper: null, // 模型骨架
      gridHelper: null, // 网格辅助线
      axesHelper: null, // 坐标轴辅助线
      directionalLightHelper: null, // 平行光辅助线
      pointLightHelper: null, // 平行光辅助线
    };
    this.light = {
      ambientLight: null, // 环境光
      directionalLight: null, // 平行光
      pointLight: null,
    };
    // 加载进度监听
    this.loadingManager = new THREE.LoadingManager();
    // 模型加载状态
    this.loadingStatus = true;
    // 加载器
    this.loader = null;
    this.tween = null; // 进动动画
    this.clock = new THREE.Clock();
    this.roamConfig = {
      box3: THREE.Box3,
      moveSpeed: 5,
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
      moveUp: false,
      moveDown: false,
      canJump: false,
      velocity: new THREE.Vector3(),
      direction: new THREE.Vector3(),
    };
    this.init();
    //文件加载器类型
    this.fileLoaderMap = {
      glb: new GLTFLoader(),
      gltf: new GLTFLoader(),
      fbx: new FBXLoader(this.loadingManager),
      obj: new OBJLoader(this.loadingManager),
      stl: new STLLoader(),
      mtl: new MTLLoader(),
    };
  }

  init() {
    if (!this.container) {
      console.error('it must has a container');
      return;
    }

    const { camera } = this.config;

    // 场景
    this.scene = new THREE.Scene();
    // 渲染器
    this.renderer = this.createRender(this.container);
    this.css3DRenderer = this.createCSS3DRenderer(this.container);
    this.container.appendChild(this.renderer.domElement);
    this.container.appendChild(this.css3DRenderer.domElement);
    // 相机
    this.camera = this.createCamera(this.container, camera.type);

    this.scene.add(this.camera);

    this.camera.position.set(camera.position.x, camera.position.y, camera.position.z);
    this.camera.lookAt(camera.lookat.x, camera.lookat.y, camera.lookat.z);
    // 控制器
    this.controls = this.createOrbitControls(this.camera, this.renderer.domElement);
    // this.controls?.pointerLockControls = this.createFirstPersonControls(
    //   this.camera,
    //   this.renderer.domElement,
    //   this.container,
    // );

    // 创建灯光
    this.createLight(LightType.Ambient);
    // this.createLight(LightType.Point);
    // this.createHelper('axesHelper');

    // 监听事件
    this.addEvent();
    //
    this.render();
  }

  // 初始化场景
  setScene(background: Color | string) {
    if (!this.scene) {
      return;
    }

    if (background instanceof Color) {
      this.scene.background = background;
    } else {
      new THREE.TextureLoader().load(background, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        if (!this.scene) {
          return;
        }
        this.scene.background = texture;
        this.scene.environment = texture;
        this.scene.backgroundIntensity = 1;
        this.scene.backgroundBlurriness = 1;
        texture.dispose();
      });
    }
  }

  // 创建渲染器
  createRender(container: Element) {
    const renderer = new THREE.WebGLRenderer({
      antialias: true, //设置抗锯齿
      alpha: true,
      preserveDrawingBuffer: true, //是否保留缓直到手动清除或被覆盖
    });
    //设置屏幕像素比
    renderer.setPixelRatio(window.devicePixelRatio);
    //渲染的尺寸大小
    const { clientWidth, clientHeight } = container;
    renderer.setSize(clientWidth, clientHeight);
    renderer.setAnimationLoop(this.render.bind(this));
    //色调映射
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.autoClear = true;
    // renderer.outputColorSpace = THREE.SRGBColorSpace;
    //曝光
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    return renderer;
  }

  createCSS3DRenderer(container: Element) {
    const { clientWidth, clientHeight } = container;

    const renderer = new CSS3DRenderer();
    renderer.setSize(clientWidth, clientHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.left = '0px';

    renderer.domElement.style.pointerEvents = 'none';
    return renderer;
  }

  // 创建相机
  createCamera(container: Element, camearType: CameraType) {
    const { clientWidth, clientHeight } = container;
    const aspect = clientWidth / clientHeight;

    let camera = null;

    if (camearType === CameraType.OrthographicCamera) {
      camera = new THREE.OrthographicCamera(
        (frustumSize * aspect) / -2, // 左边界
        (frustumSize * aspect) / 2, // 右边界
        frustumSize / 2, // 上边界
        frustumSize / -2, // 下边界
        0.1, // 近剪裁平面
        2000, // 远剪裁平面
      );
    } else {
      camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);
    }

    return camera;
  }

  // 创建控制器
  createOrbitControls(camera: Camera, domElement: HTMLElement) {
    const controls = new OrbitControls(camera, domElement);
    controls.enablePan = true;
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);
    controls.update();
    // 设置控制器最小缩放值
    controls.maxDistance = 1500;
    return controls;
  }
  //
  createFirstPersonControls(camera: Camera, domElement: HTMLElement) {
    const firstPersonControls = new PointerLockControls(camera, domElement);

    document.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.roamConfig.moveForward = true;
          break;

        case 'ArrowLeft':
        case 'KeyA':
          this.roamConfig.moveLeft = true;
          break;

        case 'ArrowDown':
        case 'KeyS':
          this.roamConfig.moveBackward = true;
          break;

        case 'ArrowRight':
        case 'KeyD':
          this.roamConfig.moveRight = true;
          break;
        case 'KeyR':
          this.roamConfig.moveUp = true;
          break;
        case 'KeyF':
          this.roamConfig.moveDown = true;
          break;

        case 'Space':
          if (this.roamConfig.canJump === true) this.roamConfig.velocity.y += 2;
          this.roamConfig.canJump = false;
          break;
      }
    });
    document.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.roamConfig.moveForward = false;
          break;

        case 'ArrowLeft':
        case 'KeyA':
          this.roamConfig.moveLeft = false;
          break;

        case 'ArrowDown':
        case 'KeyS':
          this.roamConfig.moveBackward = false;
          break;

        case 'ArrowRight':
        case 'KeyD':
          this.roamConfig.moveRight = false;
          break;

        case 'KeyR':
          this.roamConfig.moveUp = false;
          break;

        case 'KeyF':
          this.roamConfig.moveDown = false;
          break;
      }
    });

    return firstPersonControls;
  }

  // 切换控制器
  switchControls(control: ControlsType) {
    if (!this.controls || !this.renderer || !this.camera) {
      return;
    }
    if (control === ControlsType.OrbitControls) {
      this.controls.dispose();
      this.controls = this.createOrbitControls(this.camera, this.renderer.domElement);
    } else {
      this.controls.dispose();
      this.controls = this.createFirstPersonControls(this.camera, this.renderer.domElement);

      this.renderer.domElement.addEventListener('click', () => {
        (this.controls as PointerLockControls).lock();
      });
    }
  }

  // 添加3d节点
  add3DText({
    textHtml,
    position,
    scale = 0.01,
    rotate = [0, 0, 0],
  }: {
    textHtml: HTMLElement;
    position: Vector3Like;
    scale?: number;
    rotate?: Vector3Tuple;
  }) {
    if (!textHtml) return;
    const d3Text = new CSS3DObject(textHtml);
    d3Text.position.set(position.x, position.y, position.z);
    d3Text.scale.set(scale, scale, scale);
    d3Text.rotation.set(rotate[0], rotate[1], rotate[2]);
    this.add(d3Text);
    return d3Text;

    // d3Text.rotation.set(common.radify(90), common.radify(180), 0);
  }

  onRoam(box3: Box3, position: Vector3Like, lookat: Vector3Like, moveSpeed: number = 5, pointerSpeed: number = 0.3) {
    if (!this.camera) {
      return;
    }
    this.roamConfig.box3 = box3;
    this.roamConfig.moveSpeed = moveSpeed;
    this.switchControls(ControlsType.PointerLockControls);
    (this.controls as PointerLockControls).pointerSpeed = pointerSpeed;
    this.camera.position.set(position.x, position.y, position.z);
    this.camera.lookAt(0, 0, 0);
  }

  // 创建辅助线
  createHelper(type: any) {
    if (!this.scene) {
      return;
    }
    //网格辅助线
    if (type === 'gridHelper') {
      if (this.helper.gridHelper) {
        this.helper.gridHelper.visible = true;
        return;
      }
      this.helper.gridHelper = new THREE.GridHelper(6, 18, '#fff', 'rgb(193,193,193)');
      this.scene.add(this.helper.gridHelper);
    }

    // 坐标轴辅助线
    if (type === 'axesHelper') {
      if (this.helper.axesHelper) {
        this.helper.axesHelper.visible = true;
        return;
      }
      this.helper.axesHelper = new THREE.AxesHelper(12);
      this.scene.add(this.helper.axesHelper);
    }
  }

  // 创建光源
  createLight(type: LightType, position: Vector3Like = { x: -50, y: 50, z: 50 }, helper = false) {
    if (!this.scene) {
      return;
    }
    // 创建环境光
    if (type === LightType.Ambient) {
      if (this.light.ambientLight) {
        this.light.ambientLight.visible = true;
        return;
      }
      this.light.ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      this.scene.add(this.light.ambientLight);
    }

    // 创建平行光
    if (type === LightType.Directional) {
      if (this.light.directionalLight) {
        this.light.directionalLight.visible = true;
        return;
      }
      // 创建平行光
      this.light.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      this.light.directionalLight.position.set(position.x, position.y, position.z);
      this.light.directionalLight.castShadow = true;
      this.light.directionalLight.visible = true;
      this.scene.add(this.light.directionalLight);
      // 创建平行光辅助线
      if (helper) {
        if (this.helper.directionalLightHelper) {
          this.helper.directionalLightHelper.visible = true;
          return;
        }
        this.helper.directionalLightHelper = new THREE.DirectionalLightHelper(this.light.directionalLight, 0.3);
        this.helper.directionalLightHelper.visible = true;
        this.scene.add(this.helper.directionalLightHelper);
      }
    }

    if (type === LightType.Point) {
      if (this.light.pointLight) {
        this.light.pointLight.visible = true;
        return;
      }
      // 创建点光源
      this.light.pointLight = new THREE.PointLight(0xffffff, 10, 100);
      // this.light.pointLight.position.set(2, 2, 0);
      this.scene.add(this.light.pointLight);
      if (helper) {
        if (this.helper.pointLightHelper) {
          this.helper.pointLightHelper.visible = true;
          return;
        }
        // 创建点光源辅助线
        this.helper.pointLightHelper = new THREE.PointLightHelper(this.light.pointLight, 0.5);
        this.scene.add(this.helper.pointLightHelper);
      }
    }

    return this;
  }

  // 渲染场景
  render() {
    const delta = this.clock.getDelta();

    if (!this.scene || !this.renderer || !this.camera) {
      return;
    }

    //
    if (this.controls instanceof PointerLockControls && this.controls.isLocked === true) {
      const { velocity, direction, moveForward, moveLeft, moveBackward, moveRight, moveUp, moveDown, moveSpeed, box3 } =
        this.roamConfig;

      velocity.x -= velocity.x * (moveSpeed / 0.5) * delta;
      velocity.y -= velocity.y * (moveSpeed / 0.5) * delta;
      velocity.z -= velocity.z * (moveSpeed / 0.5) * delta;

      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.y = Number(moveUp) - Number(moveDown);
      direction.normalize(); // this ensures consistent movements in all directions

      if (moveForward || moveBackward) velocity.z -= direction.z * moveSpeed * delta;
      if (moveLeft || moveRight) velocity.x -= direction.x * moveSpeed * delta;
      if (moveUp || moveDown) velocity.y -= direction.y * moveSpeed * delta;

      this.controls.moveForward(-velocity.z * delta);
      this.controls.moveRight(-velocity.x * delta);
      this.camera.position.y -= velocity.y * delta;

      // x
      if (this.camera.position.x < box3.min.x) {
        this.camera.position.x = box3.min.x;
      }
      if (this.camera.position.x > box3.max.x) {
        this.camera.position.x = box3.max.x;
      }

      // y
      if (this.camera.position.y < box3.min.y) {
        this.camera.position.y = box3.min.y;
      }
      if (this.camera.position.y > box3.max.y) {
        this.camera.position.y = box3.max.y;
      }

      // z
      if (this.camera.position.z < box3.min.z) {
        this.camera.position.z = box3.min.z;
      }
      if (this.camera.position.z > box3.max.z) {
        this.camera.position.z = box3.max.z;
      }

      this.roamConfig.velocity = velocity;
    }

    this.dispatchEvent({ type: 'render', target: this });

    this.tween && this.tween.update();
    this.renderer.render(this.scene, this.camera);
    if (this.css3DRenderer) {
      this.css3DRenderer.render(this.scene, this.camera);
    }
  }

  //
  initLoader(fileType: FileType): FileLoader {
    if ([FileType.GLB, FileType.GLTF].includes(fileType)) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(`draco/gltf/`);
      dracoLoader.setDecoderConfig({ type: 'js' });
      dracoLoader.preload();
      return new GLTFLoader().setDRACOLoader(dracoLoader);
    } else {
      return this.fileLoaderMap[fileType];
    }
  }

  setCameraPosture(
    position: Vector3Like,
    lookat: Vector3Like,
    up: Vector3Like = { x: 0, y: 1, z: 0 },
    time: number = 500,
    callback?: any,
  ) {
    if (!this.camera) {
      return;
    }

    this.tween = new TWEEN.Tween({
      position: this.config.camera.position,
      lookat: this.config.camera.lookat,
      up: this.config.camera.up,
    })
      .to({ position, lookat, up }, time)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate((attitude) => {
        if (this.camera) {
          this.camera.position.set(attitude.position.x, attitude.position.y, attitude.position.z);
          this.camera.lookAt(new THREE.Vector3(attitude.lookat.x, attitude.lookat.y, attitude.lookat.z));
          this.camera.up.set(attitude.up.x, attitude.up.y, attitude.up.z);
        }
      })
      .start()
      .onComplete(() => {
        this.config.camera.position = { ...position };
        this.config.camera.lookat = { ...lookat };
        this.config.camera.up = { ...up };
        callback && callback();
      });

    this.camera.updateProjectionMatrix();
  }

  renderPlane() {
    if (!this.scene) {
      return;
    }
    // 模型平面
    const geometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x8f8f8f });
    const planeGeometry = new THREE.Mesh(geometry, groundMaterial);
    planeGeometry.name = 'planeGeometry';
    planeGeometry.rotation.x = -Math.PI / 2;
    planeGeometry.position.set(0, 0, 0);

    // 让地面接收阴影
    planeGeometry.receiveShadow = true;
    this.scene.add(planeGeometry);
  }

  // 监听事件
  addEvent() {
    //监听场景大小改变，跳转渲染尺寸
    this.onWindowResizesListener = this.onWindowResizes.bind(this);
    window.addEventListener('resize', this.onWindowResizesListener);

    // const geometry = new THREE.CircleGeometry(1, 32);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const circle = new THREE.Mesh(geometry, material);
    // console.log(circle);

    // this.scene?.add(circle);

    // window.addEventListener(
    //   'mousemove',
    //   (event) => {
    //     if (!this.container) return;
    //     // 获取 canvasContainer 的边界
    //     const rect = this.container.getBoundingClientRect();

    //     // 计算鼠标在 canvasContainer 内的相对位置
    //     this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    //     this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    //     // 射线投射
    //     this.raycaster.setFromCamera(this.mouse, this.camera);
    //     const intersects = this.raycaster.intersectObject(this.scene?.children[3]); // 碰撞检测

    //     if (intersects.length > 0) {
    //       const intersection = intersects[0]; // 获取第一个交点
    //       console.log(intersection);
    //       circle.position.copy(intersection.point);
    //       const direction = new THREE.Vector3(0, 0, 1).applyEuler(
    //         new THREE.Euler().setFromQuaternion(circle.quaternion),
    //       );
    //       circle.quaternion.setFromUnitVectors(direction, intersection.face.normal);
    //     }
    //   },
    //   false,
    // );
  }

  getIntersectionFromObject(object: Object3D, position: any, callback: any) {
    // 计算鼠标在 canvasContainer 内的相对位置
    this.mouse.x = position.x;
    this.mouse.y = position.y;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(object); // 碰撞检测
    if (intersects.length > 0) {
      const intersection = intersects[0]; // 获取第一个交点
      callback(intersection);
    }
  }

  getIntersectionFromObjects(objects: Object3D[], position: any, callback: any) {
    // 计算鼠标在 canvasContainer 内的相对位置
    this.mouse.x = position.x;
    this.mouse.y = position.y;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(objects); // 碰撞检测
    if (intersects.length > 0) {
      const intersection = intersects[0]; // 获取第一个交点
      callback(intersection);
    }
  }

  // 监听窗口变化
  onWindowResizes() {
    if (!this.container || !this.renderer || !this.camera) {
      return;
    }

    const { clientWidth, clientHeight } = this.container;
    //调整屏幕大小
    const aspect = clientWidth / clientHeight; // 摄像机宽高比例
    // 更新相机的边界
    if (this.camera instanceof OrthographicCamera) {
      this.camera.left = (frustumSize * aspect) / -2;
      this.camera.right = (frustumSize * aspect) / 2;
      this.camera.top = frustumSize / 2;
      this.camera.bottom = frustumSize / -2;
    }
    //
    this.camera.updateProjectionMatrix(); //相机更新矩阵，将3d内容投射到2d面上转换
    this.renderer.setSize(clientWidth, clientHeight);
    this.render();
  }

  //
  getMaterial(path: string): Promise<MTLLoader.MaterialCreator> {
    return new Promise((resolve, reject) => {
      this.fileLoaderMap[FileType.MTL].setMaterialOptions({
        invertTrProperty: true,
      });
      this.fileLoaderMap[FileType.MTL].load(
        path,
        (materials) => {
          materials.preload();
          resolve(materials);
        },
        (xhr) => {
          console.log(xhr.loaded);
        },
        (err) => {
          // message.error('文件错误');
          console.log(err);
          reject(err);
        },
      );
    });
  }

  loaderModel({
    filePath,
    mtlPath,
    fileType,
    callback,
    rotate = { x: 0, y: 0, z: 0 },
    wireframe = false,
    emissive = false,
    renderSize,
  }: ModelParams): Promise<LoaderResolveResult> {
    return new Promise(async (resolve, reject) => {
      const fileSuffix = getFileSuffix(filePath) as FileType;
      let loader: FileLoader;

      if (fileType) {
        loader = this.initLoader(fileType);
      } else if (fileSuffix) {
        fileType = fileSuffix;
        loader = this.initLoader(fileSuffix);
      } else {
        console.error('can not know the file type!');
        return;
      }

      // 初始化加载状态
      this.loadingStatus = false;

      if (mtlPath) {
        const materials = await this.getMaterial(mtlPath);
        (loader as OBJLoader).setMaterials(materials);
      }

      loader.load(
        filePath,
        (result) => {
          let model: Object3D;
          switch (fileType) {
            case FileType.GLB:
            case FileType.GLTF:
              model = (result as GLTF).scene;
              break;
            case FileType.FBX:
            case FileType.OBJ:
              model = result as Object3D;
              break;
            case FileType.STL:
              const material = new THREE.MeshStandardMaterial();
              model = new THREE.Mesh(result as BufferGeometry, material);
              break;
            default:
              throw new Error(`Unsupported file type: ${fileType}`);
          }

          if (!model) {
            console.log('model load error');
            return;
          }

          model.traverseVisible((child) => {
            if (child instanceof Mesh) {
              const mesh = child;
              if (Array.isArray(mesh.material)) {
                for (let index = 0; index < mesh.material.length; index++) {
                  let material = mesh.material[index];
                  material.side = THREE.DoubleSide;
                  material.wireframe = wireframe;
                  if (emissive) {
                    material.emissive = material.color;
                    material.emissiveIntensity = 0.5;
                    material.emissiveMap = material.map;
                  }
                }
              } else {
                mesh.material.side = THREE.DoubleSide;
                mesh.material.wireframe = wireframe;
                if (emissive) {
                  mesh.material.emissive = mesh.material.color;
                  mesh.material.emissiveIntensity = 0.5;
                  mesh.material.emissiveMap = mesh.material.map;
                }
              }
            }
          });

          model.updateMatrixWorld();
          const modelbox3 = new THREE.Box3().setFromObject(model);
          const size = modelbox3.getSize(new THREE.Vector3());
          const center = modelbox3.getCenter(new THREE.Vector3());
          model.position.setY(-modelbox3.min.y);
          model.rotation.set(rotate.x, rotate.y, rotate.z);

          model.updateMatrixWorld();
          const newmodelbox3 = new THREE.Box3().setFromObject(model);
          model.renderOrder = 0;

          this.add(model);

          this.loadingStatus = true;
          resolve({ model, box3: newmodelbox3, size, center });
        },
        (xhr) => {
          callback && callback(xhr);
        },
        (err) => {
          // message.error('文件错误');
          console.log(err);
          reject(err);
        },
      );
    });
  }

  // 添加模型，并追踪资源
  add(model: Object3D) {
    this.scene?.add(this.track(model));
    return model.uuid;
  }

  // 删除模型，并删除资源
  remove(object: any) {
    this.removeObjectById(object.uuid);
  }

  // 清除场景模型数据
  clear() {
    for (const key in this.objects) {
      if (Object.prototype.hasOwnProperty.call(this.objects, key)) {
        this.removeObjectById(this.objects[key].object.uuid);
      }
    }
  }
}

export default RenderScence;
