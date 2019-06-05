<template>
  <div class="sub-header">
    <ul>
      <li v-for="item in list"
        :key="item.key"
        @click="goToPage(item)"
        :class="{'active':active==item.key}">
        <span>{{item.title}}</span>
        <i class="el-icon-close close-btn"></i>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SubHeader',
  data() {
    return {
      active: 1,
      list: [{
        key: 1,
        title: '状态',
        url: '/dashboard/status'
      }, {
        key: 2,
        title: '更新日志',
        url: '/dashboard/update'
      }]
    };
  },
  computed: {
    ...mapGetters(['getPermissionMenu', 'getActiveMenu']),
  },
  watch: {
    getActiveMenu(val) {
      console.log(val);
    }
  },
  methods: {
    goToPage(item) {
      this.active = item.key;
      this.$router.push(item.url);
    }
  }
};
</script>
<style lang="less" scoped>
.sub-header {
  background-color: #e5e6e9;
  padding: 2px 5px 0;
  ul {
    overflow: hidden;
    li {
      padding: 0 20px;
      float: left;
      height: 30px;
      text-align: center;
      line-height: 28px;
      font-size: 13px;
      position: relative;
      cursor: pointer;
      &.active {
        background-color: #eff1f3;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        .close-btn {
          display: block;
        }
      }
      &:hover {
        background-color: #f6f7fb;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      .close-btn {
        display: none;
        font-size: 10px;
        position: absolute;
        top: 2px;
        right: 2px;
        cursor: pointer;
        border-radius: 50%;
        &:hover{
          background-color: #c9c9c9;
        }
      }
    }
  }
}
</style>
