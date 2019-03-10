import * as types from './mutation-types';
import { RouterMap } from '../router';

const app = {
  state: {
    PermissionMenu: RouterMap,
    FMenu: 'index',
    SMenu: 'dashboard',
    Nav: [],
    SubMenuList: RouterMap[0],
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

  },
  mutations: {
    [types.SET_ACTIVE_MENU](state, data) {
      state.SubMenuList = state.PermissionMenu.find(item => item.name === data[1]);
      const ThirdMenuList = state.SubMenuList.children.find(item => item.name === data[2]);
      state.FMenu = `/${data[1]}`;
      state.SMenu = data[2] ? `/${data[2]}` : state.SubMenuList.children[0].path;
      state.Nav = data[3] ? ThirdMenuList.children.find(item => item.name === data[3]).meta.nav : ThirdMenuList.meta.nav;
    },
  },
  actions: {

  },
};

export default app;
