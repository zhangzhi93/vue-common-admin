import { defineStore } from 'pinia';
import { asyncRouterMap, menuLevel } from '../../router';
import { getMenuNameFromUrl, getMenuInfoFromUrl, getActiveTabInfo, recursionConvert, recursionFilter, getTreeDataByDeep } from '../../utils/utils';

export const useLayoutStore = defineStore('layout', {
  state: () => {
    return {
      permissionMenu: [],
      dynamicRouters: [],
      pathKeys: [],
      nav: [],
      tabList: [],
      activeTab: '',
      ingoreUrl: ['/', '/login', '/403', '/404'], // 某些页面不进行菜单树的计算，需要忽略掉，不然会报错
    };
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
    getDynamicRouters: state => state.dynamicRouters,
    // 获取tab列表
    getTabList: state => state.tabList,
    //
    getActiveTab: state => state.activeTab,
  },
  actions: {
    initTabList(data) {
      this.tabList = [{ title: data.title, path: data.path, name: data.name, key: data.name, permanent: true }];
    },
    setPermissionMenu(data) {
      this.permissionMenu = data;
    },
    setRouters(data) {
      this.dynamicRouters = data;
    },
    setActiveTab(data) {
      this.activeTab = data;
    },
    setActiveMenu(url) {
      if (!url) return;
      if (this.ingoreUrl.includes(url)) return;
      const [path, query = ''] = url.split('?');
      // 根据路径获取激活的菜单
      this.pathKeys = getMenuNameFromUrl(path, menuLevel);
      // 激活的tab路径
      const tabPath = `/${this.pathKeys.join('/')}`;
      // 获取激活的菜单信息
      const activeMenu = getMenuInfoFromUrl(this.permissionMenu, this.pathKeys);
      this.Nav = activeMenu.nav || '';
      // 获取激活的tab菜单信息
      const activeTabInfo = getActiveTabInfo(this.tabList, tabPath);
      // 如果路由到的路径在tablist里面，把tab激活，否则新增一个tab并激活
      if (activeTabInfo) {
        this.setActiveTab(activeTabInfo.name);
      } else {
        this.setActiveTab(activeMenu.name);
        this.tabList.push({ title: activeMenu.title, path: tabPath + query, name: activeMenu.name, key: activeMenu.name });
        // this.tabList = [...this.tabList, { title: activeMenu.title, path: tabPath + query, name: activeMenu.name }];
      }
    },
    removeTabItem({ payload, callback }) {
      const tabIndex = this.tabList.findIndex(item => item.name === payload.name);
      this.tabList.splice(tabIndex, 1);
      callback && callback(this.tabList[tabIndex - 1]);
    },
    renderRouters() {
      const accessedRouters = recursionFilter(asyncRouterMap);
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
      this.initTabList(initMenu);
      this.setRouters(accessedRouters);
      this.setPermissionMenu(permissionMenuData);
      this.setActiveMenu('/dashboard');
    },
    generateRoutes(permission) {
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
        this.initTabList(initMenu);
        this.setRouters(accessedRouters);
        this.setPermissionMenu(permissionMenuData);
        resolve(accessedRouters);
      });
    }
  }
});
