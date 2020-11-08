import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/Dashboard.vue';

Vue.use(Router);

export const RouterMap = [{
  path: '/dashboard',
  name: 'dashboard',
  component: Dashboard,
  meta: {
    title: '状态概览',
    nav: ['状态概览'],
    icon: 'el-icon-menu',
    roles: [],
  },
}, {
  path: '/wechat',
  redirect: '/wechat/menu',
  component: { render: h => h('router-view') },
  name: 'wechat',
  meta: {
    title: '微信配置',
    nav: ['微信配置'],
    icon: 'el-icon-menu',
    roles: [],
  },
  children: [{
    path: '/wechat/menu',
    name: 'menu',
    component: () => import('./views/Wechat/menu.vue'),
    meta: {
      title: '菜单管理',
      nav: ['微信配置', '菜单管理'],
      icon: 'el-icon-menu',
      roles: [],
    },
  }, {
    path: '/wechat/reply',
    name: 'reply',
    component: () => import('./views/Wechat/reply.vue'),
    meta: {
      title: '关键词回复',
      nav: ['微信配置', '关键词回复'],
      icon: 'el-icon-menu',
      roles: [],
    },
  }],
}, {
  path: '/plugin',
  redirect: '/plugin/venn',
  component: { render: h => h('router-view') },
  name: 'plugin',
  component: () => import('./views/Plugin/index.vue'),
  meta: {
    title: '插件测试',
    nav: ['插件测试'],
    icon: 'el-icon-menu',
    roles: [],
  },
  children: [{
    path: '/plugin/venn',
    name: 'venn',
    component: () => import('./views/Plugin/Venn.vue'),
    meta: {
      title: '韦恩图',
      nav: ['插件测试', '韦恩图'],
      icon: 'el-icon-menu',
      roles: [],
    },
  }, {
    path: '/plugin/tree-select',
    name: 'tree-select',
    component: () => import('./views/Plugin/TreeSelect.vue'),
    meta: {
      title: '树选择',
      nav: ['插件测试', '树选择'],
      icon: 'el-icon-menu',
      roles: [],
    },
  }, {
    path: '/plugin/calendar',
    name: 'calendar',
    component: () => import('./views/Plugin/Calendar.vue'),
    meta: {
      title: '日历',
      nav: ['插件测试', '日历'],
      icon: 'el-icon-menu',
      roles: [],
    },
  }],
}, {
  path: '/function',
  redirect: '/function/diy-tree-select',
  component: { render: h => h('router-view') },
  name: 'function',
  component: () => import('./views/Function/index.vue'),
  meta: {
    title: '自定义功能',
    nav: ['自定义功能'],
    icon: 'el-icon-menu',
    roles: [],
  },
  children: [{
    path: '/function/diy-tree-select',
    name: 'diy-tree-select',
    component: () => import('./views/Function/TreeSelect.vue'),
    meta: {
      title: '自定义树选择',
      nav: ['自定义功能', '自定义树选择'],
      icon: 'el-icon-menu',
      roles: [],
    },
  }, {
    path: '/function/moveable',
    name: 'moveable',
    component: () => import('./views/Function/Moveable.vue'),
    meta: {
      title: '拖动布局',
      nav: ['自定义功能', '拖动布局'],
      icon: 'el-icon-menu',
      roles: [],
    },
  }, {
    path: '/function/fullscreen',
    name: 'fullscreen',
    component: () => import('./views/Function/Fullscreen.vue'),
    meta: {
      title: '自定义全屏',
      nav: ['自定义功能', '自定义全屏'],
      icon: 'el-icon-menu',
      roles: [],
    },
  }],
}];


export default new Router({
  routes: [{
    path: '/',
    redirect: '/dashboard',
  },
  ...RouterMap
  ],
});
