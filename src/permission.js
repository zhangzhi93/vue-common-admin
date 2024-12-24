import storage from 'store';
import globalSetting from './settings';
import router from './router';
import { usePermissionStore, useLayoutStore } from '@/store';
import { useNProgress } from '@/hooks/useNProgress';

import { getMenuNameFromUrl } from '@/utils/utils';

const { start, done } = useNProgress();

const allowList = ['login', '404'];

router.beforeEach(async (to, from, next) => {
  // 开始进度条
  start();
  // 修改标题名称
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + globalSetting.title;
  }

  // 路由权限菜单校验
  const permissionStore = usePermissionStore();
  const layoutStore = useLayoutStore();

  // 根据路由计算菜单展开和选中项
  layoutStore.pathKeys = getMenuNameFromUrl(to.path);
  console.log(layoutStore.pathKeys);
  console.log(layoutStore.getSelectedKeys);
  console.log(layoutStore.getOpenKeys);

  // 如果跳转到登录页，则直接进行跳转
  if (to.path === '/login') {
    next();
    return;
  }

  // 通过token判断是否已登录
  if (storage.get('token')) {
    // 判断是否获取到了动态路由
    if (permissionStore.getIsAddRouters) {
      next();
      return;
    }

    const addRouters = await permissionStore.generateRoutes();

    addRouters.forEach((route) => {
      router.addRoute(route); // 动态添加可访问路由表
    });

    const redirectPath = from.query.redirect || to.path;
    const redirect = decodeURIComponent(redirectPath);
    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
    permissionStore.setIsAddRouters(true);
    console.log(permissionStore.routers);
    next(nextData);
  } else {
    if (allowList.includes(to.path)) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  }
});

router.afterEach(() => {
  done();
});
