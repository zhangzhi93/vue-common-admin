import router from './router';
import store from './store/index';
import storage from 'store';
import NProgress from 'nprogress';
import '@/components/NProgress/nprogress.less';

NProgress.configure({ showSpinner: false });

const loginRoutePath = '/login';
const allowList = ['login', '404'];

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (storage.get('token')) {
    if (store.getters.addRouters.length === 0) {
      store.dispatch('GenerateRoutes', store.getters.getLoginInfo.permission).then((accessedRouters) => {
        router.addRoutes(accessedRouters);
        store.commit('SET_ACTIVE_MENU', to.path);
        next({ ...to, replace: true });
      });
    } else {
      store.commit('SET_ACTIVE_MENU', to.path);
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
