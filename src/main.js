// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import router from './router';
import store from './store/index';
import App from './App.vue';
import 'element-ui/lib/theme-chalk/index.css';
import './style.less';

Vue.config.productionTip = false;

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
