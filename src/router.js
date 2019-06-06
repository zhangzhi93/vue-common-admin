import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Status from './views/Dashboard/index.vue';

Vue.use(Router);

export const RouterMap = [{
  path: 'dashboard',
  redirect: '/dashboard/status',
  name: 'dashboard',
  component: Status,
  meta: {
    title: '状态概览',
    nav: ['状态概览'],
    icon: 'el-icon-menu',
    roles: [],
  },
  children: [{
    path: 'status',
    name: 'status',
    component: () => import('./views/Dashboard/status.vue'),
    meta: {
      title: '状态概览',
      nav: ['状态概览', '状态概览'],
      icon: 'el-icon-menu',
      roles: [],
    },
  }, {
    path: 'update',
    name: 'update',
    component: () => import('./views/Dashboard/update.vue'),
    meta: {
      title: '更新日志',
      nav: ['更新日志', '更新日志'],
      icon: 'el-icon-menu',
      roles: [],
    },
  }],
}, {
  path: 'wechat',
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
    name: 'home',
    component: Home,
    children: RouterMap,
  }],
});
