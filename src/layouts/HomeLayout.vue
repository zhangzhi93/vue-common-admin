<template>
  <vue-antd-layout
    :collapsed.sync="collapsed"
    :menu-data="getPermissionMenu"
    :selectedKeys="getSelectedKeys"
    :openKeys="getOpenKeys"
    title="Antd Layout"
    :show-footer="false"
    :trigger="null"
    @menuClick="onMenuClick"
    class="coli-layout"
  >
    <div slot="rightContent" class="right-actions">
      <a-dropdown :trigger="['click']">
        <div class="avatar" @click="e => e.preventDefault()">
          <a-avatar :size="28" icon="user" />
          <span class="name" v-html="getLoginInfo.nickname||'&nbsp;'" />
        </div>
        <a-menu slot="overlay">
          <a-menu-item @click="onQuit">退出登录</a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <layout-tabs
      slot="navTabs"
      type="scroll"
      :tabs-data="getTabList"
      :active-name="getTabActive"
      @tab-click="onTabClick"
      @tab-remove="onTabRemove"
    />
    <div class="content" v-watermark="{title:getLoginInfo.nickname}">
      <router-view />
    </div>
  </vue-antd-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'App',
  data () {
    return {
      collapsed:false,
    };
  },
  computed: {
    ...mapGetters(['getSelectedKeys', 'getOpenKeys', 'getTabList', 'getTabActive', 'getLoginInfo', 'getPermissionMenu'])
  },
  methods: {
    ...mapMutations({
      removeTabItem: 'REMOVE_TAB_ITEM',
    }),
    onMenuClick (data) {
      this.$router.push(data.item.value.path);
    },
    onTabClick (data) {
      this.$router.replace(data.path);
    },
    onTabRemove (data) {
      this.removeTabItem({
        payload: {
          name: data.name
        },
        callback: (res) => {
          this.$router.replace(res.path);
        }
      });
    },
    onQuit () {
      this.$router.replace('/login');
    }
  },
  mounted () {

  }
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
  /deep/.ant-avatar {
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
