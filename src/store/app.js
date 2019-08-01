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
      path: '/dashboard/status',
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
      return state.MenuNames.slice(2).join('/');
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
      debugger;
      state.SubMenuList = MenuInfo.SubMenuList;
      state.MenuNames = MenuInfo.MenuNames;
      const { LastMenuMeta } = MenuInfo;
      state.Nav = LastMenuMeta ? LastMenuMeta.nav : '';
      const activeRouterInTab = getActiveTabInfo(state.TabList, data);


      // const MenuItem = data.split('/');
      // state.SubMenuList = state.PermissionMenu.find(item => item.name === MenuItem[1]);
      // const ThirdMenuList = state.SubMenuList.children.find(item => item.name === MenuItem[2]);
      // state.FMenu = `/${MenuItem[1]}`;
      // state.SMenu = MenuItem[2] ? `/${MenuItem[2]}` : state.SubMenuList.children[0].path;
      // state.Nav = MenuItem[3] ? ThirdMenuList.children.find(item => item.name === MenuItem[3]).meta.nav : ThirdMenuList.meta.nav;
      // const ActiveRouter = state.TabList.find(item => item.url === data);

      if (activeRouterInTab) {
        this.commit(types.SET_ACTIVE_STATUS, activeRouterInTab.path);
      } else {
        this.commit(types.SET_ACTIVE_STATUS, data);
        state.TabList = [...state.TabList, { title: LastMenuMeta.title, path: data }];
      }
    },
    [types.SET_ACTIVE_STATUS](state, data) {
      state.activeTab = data;
    },
    [types.REMOVE_TAB_ITEM](state, data) {
      state.TabList.splice(data, 1);
    },
  },
  actions: {

  },
};

export default app;
