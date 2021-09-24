// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Antd from 'ant-design-vue';
import { VueAntdLayout, LayoutTabs } from 'vue-antd-layout';
import router from './router';
import store from './store/index';
import App from './App.vue';
import VueAudio from 'vue-audio-better';
import '@/directives/directiveMoveable';
import Watermark from '@/directives/watermark';

import 'ant-design-vue/dist/antd.less';
import './style.less';
import './assets/style/index.less';
import './permission';

Vue.config.productionTip = false;

Vue.use(Antd);
Vue.use(VueAntdLayout);
Vue.use(LayoutTabs);
Vue.use(VueAudio)
Vue.use(Watermark)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
