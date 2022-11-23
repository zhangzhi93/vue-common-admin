import { createApp } from 'vue';
// import { createApp } from 'vue/dist/vue.esm-bundler.js'; // 支持template写法
import VueAudio from 'vue-audio-better';
import Antd from 'ant-design-vue';
import piniaStore from './store';
import router from './router';
import App from './App.vue';
import { VueAntdLayout, LayoutTabs } from 'vue-antd-layout';

import './permission';
import moveable from '@/directives/directiveMoveable';
import watermark from '@/directives/watermark';

import 'ant-design-vue/dist/antd.less';
import './style.less';
import './assets/style/index.less';


const app = createApp(App);

app.use(piniaStore);
app.use(router);
app.use(Antd);
app.use(VueAntdLayout);
app.use(LayoutTabs);
app.use(VueAudio);
app.use(watermark);
app.use(moveable);


app.mount('#app');
