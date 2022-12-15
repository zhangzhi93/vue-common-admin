<template>
  <vue-antd-layout
    v-model:collapsed="data.collapsed"
    title="Antd Layout"
    :menu-data="layoutStore.getPermissionMenu"
    :selectedKeys="layoutStore.getSelectedKeys"
    :openKeys="layoutStore.getOpenKeys"
    :show-footer="false"
    :trigger="null"
    class="coli-layout"
    @menu-click="onMenuClick"
  >
    <template #rightContent>
      <div class="right-actions">
        <a-dropdown :trigger="['click']">
          <div class="avatar" @click="e => e.preventDefault()">
            <a-avatar :size="28" icon="user" />
            <span class="name" v-html="appStore.getLoginInfo.nickname || '&nbsp;'" />
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="onQuit">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </template>
    <template #navTabs>
      <layout-tabs
        :activeKey="layoutStore.getActiveTab"
        animated
        :tabs-data="layoutStore.getTabList"
        type="flex"
        @tab-click="onTabClick"
        @tab-remove="onTabRemove"
        @contextmenu="onContextmenu"
      />
    </template>
    <div v-watermark="{ title: appStore.getLoginInfo.nickname||'Janz' }" class="content">
      <router-view />
    </div>
    <!-- <div class="content">
      <router-view />
    </div> -->
    <div
      v-show="data.contextmenuElem.visible"
      class="contextmenu-container"
      :style="{ left: `${data.contextmenuElem.left}px`, top: `${data.contextmenuElem.top}px` }"
    >
      <div class="contextmenu-content">
        <ul>
          <template v-for="item in data.contextmenuData" :key="item.key">
            <li v-if="item.type === 'divider'" class="ant-dropdown-menu-item-divider" />
            <li v-else class="contextmenu-menu-item">
              <span class="contextmenu-menu-title-content" @click="onSelectContextmenu(item.key)">{{ item.title
              }}</span>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </vue-antd-layout>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAppStore, useLayoutStore } from '@/store';

const data = reactive({
  collapsed: false,
  contextmenuElem: {
    data: [{
      title: '关闭',
      key: 'c'
    }, {
      title: '关闭其他',
      key: 'co'
    }, {
      title: '关闭右侧',
      key: 'cr '
    }],
    visible: false,
    top: 0,
    left: 0
  },
  contextmenuData:[]
});

const appStore = useAppStore();
const layoutStore = useLayoutStore();

console.log(layoutStore.getActiveTab);

const router = useRouter();

onMounted(() => {
  // layoutStore.renderRouters();
});


const onMenuClick = (data) => {
  router.push(data.item.value.path);
};

const onTabClick = (data) => {
  router.replace(data.path);
};

const onTabRemove = (data) => {
  layoutStore.removeTabItem({
    payload: {
      name: data.name
    },
    callback: (res) => {
      router.replace(res.path);
    }
  });
};

const onContextmenu = (e) => {
  console.log(e);
};

const onQuit = () => {
  router.replace('/login');
};
</script>

<style lang="less">
.coli-layout {
  // .ant-menu-item-selected {
  //   color: #fff;
  //   &:hover {
  //     color: #fff;
  //   }
  // }
  // .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  //   background: linear-gradient(to right, #e33333, #fff);
  // }
  // .flex-tabs ul li.active {
  //   border-bottom: 2px solid #e33333;
  // }
  // .flex-tabs ul li.active span {
  //   color: #e33333;
  // }
  // .flex-tabs ul li:hover span {
  //   color: #e33333;
  // }
}

.right-actions {
  height: 48px;
  line-height: 48px;
}

.avatar {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 12px;
  transition: all 0.3s;

  :deep(.ant-avatar) {
    margin-right: 6px;
  }

  .name {
    display: inline-block;
    margin-left: 5px;
  }
}

.content {
  margin: 15px;
  min-height: calc(100vh - 109px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
