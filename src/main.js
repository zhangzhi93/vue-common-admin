// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import { VueElementLayout } from 'vue-element-layout';
import router from './router';
import store from './store/index';
import App from './App.vue';
import './directives/directiveMoveable';
import 'element-ui/lib/theme-chalk/index.css';
import './style.less';
import './assets/style/index.less';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueElementLayout);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});

router.beforeEach((to, from, next) => {
  console.log(`to: ${to.path}`);
  store.commit('SET_ACTIVE_MENU', to.path);
  next();
});
