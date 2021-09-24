import * as types from './mutation-types';
import { asyncRouterMap, menuLevel } from '../router';
import { getMenuNameFromUrl, getMenuInfoFromUrl, getActiveTabInfo, recursionConvert, recursionFilter, getTreeDataByDeep } from '../utils/utils';

console.log(asyncRouterMap)
const layout = {
  state: {
    permissionMenu: [],
    addRouters:[],
    pathKeys: [],
    nav: [],
    tabList: [],
    activeTab: '',
    ingoreUrl: ['/', '/login', '/403', '/404'], // 某些页面不进行菜单树的计算，需要忽略掉，不然会报错
  },
  getters: {
    // 获取左侧菜单列激活菜单
    getSelectedKeys: state => {
      return state.pathKeys.slice(-1);
    },
    getOpenKeys: state => {
      return state.pathKeys.slice(0, -1);
    },
    // 获取最终渲染的菜单
    getPermissionMenu: state => state.permissionMenu,
    //
    addRouters: state => state.addRouters,
    // 获取tab列表
    getTabList: state => state.tabList,
    //
    getTabActive: state => state.activeTab,
  },
  mutations: {
    [types.SET_PERMISSION_MENU] (state, data) {
      state.permissionMenu = data;
    },
    [types.SET_ROUTERS] (state, data) {
      state.addRouters = data;
    },
    [types.INIT_TABLIST] (state, data) {
      state.tabList = [{ title:data.title, path:data.path, name:data.name, permanent:true }];
    },
    [types.SET_ACTIVE_MENU] (state, url) {
      // 路由到忽略路径，不进行tabactive计算
      if (state.ingoreUrl.includes(url)) return;
      const [path, query = ''] = url.split('?');
      // 根据路径获取激活的菜单
      state.pathKeys = getMenuNameFromUrl(path, menuLevel);
      // 激活的tab路径
      const tabPath = `/${state.pathKeys.join('/')}`;
      // 获取激活的菜单信息
      const activeMenu = getMenuInfoFromUrl(state.permissionMenu, state.pathKeys);
      state.Nav = activeMenu.nav || '';
      // 获取激活的tab菜单信息
      const activeTabInfo = getActiveTabInfo(state.tabList, tabPath);
      // 如果路由到的路径在tablist里面，把tab激活，否则新增一个tab并激活
      if (activeTabInfo) {
        this.commit(types.SET_ACTIVE_STATUS, activeTabInfo.name);
      } else {
        this.commit(types.SET_ACTIVE_STATUS, activeMenu.name);
        state.tabList = [...state.tabList, { title: activeMenu.title, path: tabPath + query, name: activeMenu.name }];
      }
    },
    [types.SET_ACTIVE_STATUS] (state, data) {
      state.activeTab = data;
    },
    [types.REMOVE_TAB_ITEM] (state, { payload, callback }) {
      const tabIndex = state.tabList.findIndex(item => item.name === payload.name);
      state.tabList.splice(tabIndex, 1);
      callback && callback(state.tabList[tabIndex - 1]);
    },
  },
  actions: {
    GenerateRoutes ({ commit }, permission) {
      return new Promise(resolve => {
        const accessedRouters = recursionFilter(asyncRouterMap, permission);
        const index = accessedRouters.findIndex(item => item.path === '/');
        const permissionMenuData = recursionConvert(getTreeDataByDeep(accessedRouters[index].children, menuLevel, 1), item => {
          if (item.meta.hide) {
            return null;
          } else {
            return {
              path: item.path,
              name: item.name,
              title: item.meta.title,
              icon: item.meta.icon,
              nav: item.meta.nav
            };
          }
        });
        const initMenu = getMenuInfoFromUrl(permissionMenuData);
        // 初始化重定向
        accessedRouters[index].redirect = initMenu.path;
        commit(types.INIT_TABLIST, initMenu);
        commit(types.SET_ROUTERS, accessedRouters);
        commit(types.SET_PERMISSION_MENU, permissionMenuData);
        resolve(accessedRouters);
      });
    }
  }
};

export default layout;
