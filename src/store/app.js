import * as types from './mutation-types'
import { MenuList } from '../utils/config'

const state = {
  SubMenuList: MenuList[0],
  FMenu: 'index',
  SMenu: 'Dashboard'
}

const getters = {
  // 得到二级菜单
  getSubMenuList: state => state.SubMenuList,
  // 得到二级菜单
  getActiveMenu: state => {
    return {
      FMenu: state.FMenu,
      SMenu: state.SMenu
    }
  }
}

const mutations = {
  [types.GET_SUB_MENULIST](state, data) {
    state.SubMenuList = MenuList.find(item => item.index === data)
  },
  [types.GET_ACTIVE_MENU](state, data) {
    state.FMenu = data.FMenu
    state.SMenu = data.SMenu
  },
}

const actions = {

}

export default {
  state,
  actions,
  getters,
  mutations
}
