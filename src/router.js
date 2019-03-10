import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export const RouterMap = [{
  path: '/index',
  redirect: '/index/dashboard',
  name: 'index',
  component: Home,
  meta: {
    title: '状态概览',
    nav: ['状态概览'],
    icon: 'el-icon-menu',
    roles: [],
  },
  children: [{
    path: 'dashboard',
    name: 'dashboard',
    meta: {
      title: '状态概览',
      nav: ['状态概览', '状态概览'],
      icon: 'el-icon-menu',
      roles: [],
    },
  }],
}, {
  path: '/wechat',
  redirect: '/wechat/menu',
  name: 'wechat',
  component: () => import('./views/Wechat/index.vue'),
  meta: {
    title: '微信配置',
    nav: ['微信配置'],
    icon: 'el-icon-menu',
    roles: [],
  },
  children: [{
    path: 'menu',
    name: 'menu',
    component: () => import('./views/Wechat/menu.vue'),
    meta: {
      title: '菜单管理',
      nav: ['微信配置', '菜单管理'],
      icon: 'el-icon-menu',
      roles: [],
    },
  }, {
    path: 'reply',
    name: 'reply',
    component: () => import('./views/Wechat/reply.vue'),
    meta: {
      title: '关键词回复',
      nav: ['微信配置', '关键词回复'],
      icon: 'el-icon-menu',
      roles: [],
    },
  }],
}];

export default new Router({
  routes: [{
    path: '/',
    redirect: '/index',
  }, ...RouterMap],
});
