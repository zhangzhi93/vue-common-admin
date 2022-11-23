import router from './router';
import { useAppStore, useLayoutStore } from '@/store';
import storage from 'store';
import NProgress from 'nprogress';
import '@/components/NProgress/nprogress.less';

NProgress.configure({ showSpinner: false });

const loginRoutePath = '/login';
const allowList = ['login', '404'];

router.beforeEach((to, from, next) => {
  const layoutStore = useLayoutStore();
  const appStore = useAppStore();
  NProgress.start();
  if (storage.get('token')) {
    if (layoutStore.dynamicRouters.length === 0) {
      layoutStore.generateRoutes(appStore.getLoginInfo.permission).then((accessedRouters) => {
        console.log(accessedRouters);
        accessedRouters.forEach(r => {
          router.addRoute(r);
        });

        console.log(router.getRoutes());
        console.log(router.hasRoute('menu'));
        layoutStore.setActiveMenu(to.path);
        // next({ ...to, replace: true });
        router.replace(to.fullPath);
      });
    } else {
      layoutStore.setActiveMenu(to.path);
      next();
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next();
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } });
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
