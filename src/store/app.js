import * as types from './mutation-types';
import storage from 'store';

const userInfo = JSON.parse(storage.get('userinfo') || '{}');

const app = {
  state: {
    loginInfo: userInfo,
    workLines: []
  },
  getters: {
    // 获取用户信息
    getLoginInfo: state => state.loginInfo,
  },
  mutations: {
    [types.SET_USER_INFO](state, data) {
      state.loginInfo = data;
    },
  },
  actions: {

  },
};

export default app;
