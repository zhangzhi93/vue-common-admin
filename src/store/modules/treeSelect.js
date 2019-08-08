/*
 * Copyright 2019
 * Created by janz (zhangzhi93@hotmail.com)
 */

import * as types from '../mutation-types';

const User = {
  state: {
    lazyOptions: [],
  },
  // 提供页面用到的参数
  getters: {
    get_lazy_options: state => state.lazyOptions,
  },
  // 同步处理 actions操作state必须通过mutations
  mutations: {
    [types.GET_LAB_LIST](state, data) {
      state.labListData = data.data;
    },
    [types.GET_LAB_DETAIL](state, data) {
      state.labDetailData = data.data;
    },
  },
  // 异步处理
  actions: {
    /**
   * 用户列表
   */
    async getVirtualLabList({ commit }, { params }) {
      const { data } = await api.lab.getVirtualLabList(params);
      if (data) {
        commit(types.GET_LAB_LIST, data);
      }
    },
    /**
     * 用户详情
     */
    async getVirtualLabDetail({ commit }, { params }) {
      const { data } = await api.lab.getVirtualLabDetail(params);
      if (data) {
        commit(types.GET_LAB_DETAIL, data);
      }
    },
  },
};

export default User;
