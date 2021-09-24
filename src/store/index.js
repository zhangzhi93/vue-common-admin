import Vue from 'vue';
import Vuex from 'vuex';

import Layout from './layout';
import App from './app';

Vue.use(Vuex);

// 导出需要的模块
export default new Vuex.Store({
  modules: {
    Layout,
    App
  },
});
