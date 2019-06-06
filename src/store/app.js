import * as types from './mutation-types';
import { RouterMap } from '../router';

const app = {
  state: {
    PermissionMenu: RouterMap,
    FMenu: 'index',
    SMenu: 'dashboard',
    Nav: [],
    SubMenuList: RouterMap[0],
    TabList: [],
    active: '',
  },
  getters: {
    // 得到二级菜单
    getSubMenuList: state => state.SubMenuList,
    // 获取选中菜单
    getActiveMenu: state => {
      return {
        FMenu: state.FMenu,
        SMenu: state.SMenu,
        Nav: state.Nav,
      };
    },
    // 获取最终渲染的菜单
    getPermissionMenu: state => state.PermissionMenu,
    // 获取tab列表
    getTabList: state => state.TabList,
    //
    getTabActive: state => state.active,
  },
  mutations: {
    [types.SET_ACTIVE_MENU](state, data) {
      const MenuItem = data.split('/');
      state.SubMenuList = state.PermissionMenu.find(item => item.name === MenuItem[1]);
      const ThirdMenuList = state.SubMenuList.children.find(item => item.name === MenuItem[2]);
      state.FMenu = `/${MenuItem[1]}`;
      state.SMenu = MenuItem[2] ? `/${MenuItem[2]}` : state.SubMenuList.children[0].path;
      state.Nav = MenuItem[3] ? ThirdMenuList.children.find(item => item.name === MenuItem[3]).meta.nav : ThirdMenuList.meta.nav;
      const ActiveRouter = state.TabList.find(item => item.url === data);
      if (ActiveRouter) {
        this.commit(types.SET_ACTIVE_STATUS, ActiveRouter.url);
      } else {
        this.commit(types.SET_ACTIVE_STATUS, data);
        state.TabList = [...state.TabList, { title: ThirdMenuList.meta.title, url: data }];
      }
    },
    [types.SET_ACTIVE_STATUS](state, data) {
      state.active = data;
    },
    [types.REMOVE_TAB_ITEM](state, data) {
      state.TabList = data;
    },
  },
  actions: {

  },
};

export default app;
