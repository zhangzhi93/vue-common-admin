import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '@/layouts/LoginLayout.vue';
import HomeLayout from '@/layouts/HomeLayout.vue';
import Dashboard from '@/views/Dashboard.vue';
import RouteView from '@/layouts/RouteView.vue';
import { AimOutlined } from '@ant-design/icons-vue';

// 要渲染的菜单深度
export const menuLevel = 2;

export const asyncRouterMap = [
  {
    path: '/',
    redirect: '/dashboard',
    name: 'HomeLayout',
    component: HomeLayout,
    meta: {
      roles: ['ALL']
    },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
          title: '状态概览',
          nav: ['状态概览'],
          icon: AimOutlined,
          roles: ['ALL'],
        },
      },
      {
        path: '/menu1',
        name: 'menu1',
        component: () => import('./views/Wechat/menu.vue'),
        meta: {
          title: '菜单',
          nav: ['菜单'],
          icon: AimOutlined,
          roles: ['ALL'],
        },
      },
      {
        path: '/wechat',
        component: RouteView,
        name: 'wechat',
        meta: {
          title: '微信配置',
          nav: ['微信配置'],
          icon: AimOutlined,
          roles: ['ALL'],
        },
        children: [
          {
            path: '/wechat/menu',
            name: 'menu',
            component: () => import('./views/Wechat/menu.vue'),
            meta: {
              title: '菜单管理',
              nav: ['微信配置', '菜单管理'],
              icon: AimOutlined,
              roles: ['ALL'],
            },
          },
          {
            path: '/wechat/reply',
            name: 'reply',
            component: () => import('./views/Wechat/reply.vue'),
            meta: {
              title: '关键词回复',
              nav: ['微信配置', '关键词回复'],
              icon: AimOutlined,
              roles: ['ALL'],
            },
          },
        ],
      },
      {
        path: '/plugin',
        component: RouteView,
        name: 'plugin',
        meta: {
          title: '插件测试',
          nav: ['插件测试'],
          icon: AimOutlined,
          roles: ['ALL'],
        },
        children: [
          // {
          //   path: '/plugin/venn',
          //   name: 'venn',
          //   component: () => import('./views/plugin/Venn.vue'),
          //   meta: {
          //     title: '韦恩图',
          //     nav: ['插件测试', '韦恩图'],
          //     icon: AimOutlined,
          //     roles: ['ALL'],
          //   },
          // },
          {
            path: '/plugin/tree-select',
            name: 'tree-select',
            component: () => import('./views/Plugin/TreeSelect.vue'),
            meta: {
              title: '树选择',
              nav: ['插件测试', '树选择'],
              icon: AimOutlined,
              roles: ['ALL'],
            },
          },
          {
            path: '/plugin/calendar',
            name: 'calendar',
            component: () => import('./views/Plugin/Calendar.vue'),
            meta: {
              title: '日历',
              nav: ['插件测试', '日历'],
              icon: AimOutlined,
              roles: ['ALL'],
            },
          },
          {
            path: '/plugin/audio-player',
            name: 'audio-player',
            component: () => import('./views/Plugin/AudioPlayer.vue'),
            meta: {
              title: '播放器',
              nav: ['插件测试', '播放器'],
              icon: AimOutlined,
              roles: ['ALL'],
            },
          },
          {
            path: '/plugin/baidumapvgl',
            name: 'baidumapvgl',
            component: () => import('./views/Plugin/BaiduMapVgl.vue'),
            meta: {
              title: '百度地图',
              nav: ['插件测试', '百度地图'],
              icon: AimOutlined,
              roles: ['ALL'],
            },
          }
        ],
      },
      {
        path: '/function',
        component: RouteView,
        name: 'function',
        meta: {
          title: '自定义功能',
          nav: ['自定义功能'],
          icon: AimOutlined,
          roles: ['ALL'],
        },
        children: [
          {
            path: '/function/diy-tree-select',
            name: 'diy-tree-select',
            component: () => import('./views/Function/TreeSelect.vue'),
            meta: {
              title: '自定义树选择',
              nav: ['自定义功能', '自定义树选择'],
              icon: AimOutlined,
              roles: ['ALL'],
            },
          },
          {
            path: '/function/moveable',
            name: 'moveable',
            component: () => import('./views/Function/Moveable.vue'),
            meta: {
              title: '拖动布局',
              nav: ['自定义功能', '拖动布局'],
              icon: AimOutlined,
              roles: ['ALL'],
            },
          },
          {
            path: '/function/fullscreen',
            name: 'fullscreen',
            component: () => import('./views/Function/Fullscreen.vue'),
            meta: {
              title: '自定义全屏',
              nav: ['自定义功能', '自定义全屏'],
              icon: AimOutlined,
              roles: ['ALL'],
            },
          }
        ],
      },
      {
        path: '/vtk',
        component: RouteView,
        name: 'vtk',
        meta: {
          title: 'vtk',
          nav: ['vtk'],
          icon: AimOutlined,
          roles: ['ALL'],
        },
        children: [
          {
            path: '/vtk/pointcloud',
            name: 'pointcloud',
            component: () => import('./views/vtk/pointCloud/index.vue'),
            meta: {
              title: '点云',
              nav: ['vtk', '点云'],
              icon: AimOutlined,
              roles: ['ALL'],
            },
          },
        ],
      }
    ]
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
    meta: {
      roles: ['ALL']
    },
  }
];


export const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
  },
  ...asyncRouterMap
];


export default createRouter({
  history: createWebHashHistory(),
  routes: constantRouterMap,
});
