<template>
  <div class="sub-header">
    <ul>
      <li v-for="(item,index) in getTabList" :key="item.path" @click="goToPage(item)" :class="{'active':getTabActive == item.path}">
        <span>{{item.title}}</span>
        <i class="el-icon-close close-btn" v-if="!item.permanent" @click.stop="closeTab(index)"></i>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'SubHeader',
  computed: {
    ...mapGetters(['getTabList', 'getTabActive']),
  },
  methods: {
    ...mapMutations({
      setActiveStatus: 'SET_ACTIVE_STATUS',
      removeTabItem: 'REMOVE_TAB_ITEM',
    }),
    goToPage(item) {
      this.setActiveStatus(item.path);
      this.$router.push(item.path).catch(err => { console.log(err) });
    },
    closeTab(index) {
      this.$router.push(this.getTabList[index - 1].path).catch(err => { console.log(err) });
      this.removeTabItem(index);
    },
  },
};
</script>
<style lang="less" scoped>
.sub-header {
  background-color: #e5e6e9;
  padding: 2px 5px 0;
  position: fixed;
  top: 50px;
  width: 100%;
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
        &:hover {
          background-color: #c9c9c9;
        }
      }
    }
  }
}
</style>
