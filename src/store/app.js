import * as types from './mutation-types';
import { RouterMap } from '../router';
import { getMenuInfoFromNames, getActiveTabInfo } from '../utils/tools';

const app = {
  state: {
    SubMenuList: RouterMap[0],
    PermissionMenu: RouterMap,
    MenuNames: [],
    Nav: [],
    TabList: [{
      title: '状态概览',
      path: '/dashboard',
      name: 'dashboard',
      permanent: true,
    }],
    activeTab: '',
  },
  getters: {
    // 得到二级菜单
    getSubMenuList: state => state.SubMenuList,
    // 获取选中菜单
    getActiveHeaderMenuName: state => `/${state.MenuNames[1]}`,
    // 获取左侧菜单列激活菜单
    getActiveSliderMenuName: state => {
      return state.MenuNames.slice(-1).join('/');
    },
    // 获取最终渲染的菜单
    getPermissionMenu: state => state.PermissionMenu,
    // 获取tab列表
    getTabList: state => state.TabList,
    //
    getTabActive: state => state.activeTab,
  },
  mutations: {
    [types.SET_ACTIVE_MENU](state, data) {
      const MenuInfo = getMenuInfoFromNames(state.PermissionMenu, data);
      state.SubMenuList = MenuInfo.SubMenuList;
      state.MenuNames = MenuInfo.MenuNames;
      const { LastMenu } = MenuInfo;
      state.Nav = LastMenu.meta ? LastMenu.meta.nav : '';
      const activeRouterInTab = getActiveTabInfo(state.TabList, data);

      if (activeRouterInTab) {
        this.commit(types.SET_ACTIVE_STATUS, activeRouterInTab.name);
      } else {
        this.commit(types.SET_ACTIVE_STATUS, LastMenu.name);
        state.TabList = [...state.TabList, { title: LastMenu.meta.title, path: data, name: LastMenu.name }];
      }
    },
    [types.SET_ACTIVE_STATUS](state, data) {
      state.activeTab = data;
    },
    [types.REMOVE_TAB_ITEM](state, data) {
      const tabIndex = state.TabList.findIndex(item => item.name === data)
      state.TabList.splice(tabIndex, 1);
    },
  },
  actions: {
    removeTabItem({ commit, state }, { payload, callback }) {
      const tabIndex = state.TabList.findIndex(item => item.name === payload.name)
      state.TabList.splice(tabIndex, 1);
      if (callback) {
        callback(state.TabList[tabIndex - 1])
      }
    }
  },
};

export default app;
