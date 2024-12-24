import { defineStore } from 'pinia';
import { cloneDeep } from 'lodash-es';

import { constantRouterMap, asyncRouterMap } from '@/router';

import HomeLayout from '@/layouts/HomeLayout.vue';

export const usePermissionStore = defineStore('permission', {
  state: () => {
    return {
      routers: [],
      addRouters: [],
      isAddRouters: false,
      menuTabRouters: [],
    };
  },
  getters: {
    getRouters() {
      return this.routers;
    },
    getAddRouters() {
      return cloneDeep(this.addRouters);
    },
    getIsAddRouters() {
      return this.isAddRouters;
    },
    getMenuTabRouters() {
      return this.menuTabRouters;
    },
  },
  actions: {
    generateRoutes(type = 'static') {
      return new Promise((resolve) => {
        let routerMap = [];
        if (type === 'server') {
          // routerMap = generateRoutesByServer(routers);
        } else {
          routerMap = cloneDeep(asyncRouterMap);
        }

        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false,
            },
          },
        ]);
        // 渲染菜单的所有路由
        this.routers = cloneDeep(constantRouterMap).concat(routerMap);
        resolve([
          {
            path: '/',
            redirect: this.addRouters[0].path,
            name: 'HomeLayout',
            component: HomeLayout,
            meta: {
              roles: ['ALL'],
            },
            children: cloneDeep(this.addRouters),
          },
        ]);
      });
    },
    setIsAddRouters(state) {
      this.isAddRouters = state;
    },
  },
});
