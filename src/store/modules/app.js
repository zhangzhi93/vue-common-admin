import { defineStore } from 'pinia';
import storage from 'store';

const userInfo = JSON.parse(storage.get('userinfo') || '{}');

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      loginInfo: userInfo
    };
  },
  getters: {
    // 获取用户信息
    getLoginInfo: state => state.loginInfo,
  },
  actions:{
    setUserInfo(data){
      this.loginInfo = data;
    }
  }
});
