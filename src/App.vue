<template>
  <div id="app">
    <el-container style="min-width: 1198px;">
      <Header />
      <el-container class="main-container">
        <Slider />
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import Header from "./components/Header.vue";
import Slider from "./components/Slider"

export default {
  name: 'app',
  components: {
    Header,
    Slider
  },
  watch: {
    '$route'(to, from) {
      const MenuArray = to.fullPath.split('/');
      this.activeMenu({
        FMenu: `/${MenuArray[1]}`,
        SMenu: to.fullPath
      })
    }
  },
  methods: {
    ...mapMutations({
      subMenuHandler: 'GET_SUB_MENULIST',
      activeMenu: 'GET_ACTIVE_MENU'
    }),
  },
  mounted() {
    const MenuArray = this.$route.fullPath.split('/');
    const FMenu = `/${MenuArray[1]}`;
    this.subMenuHandler(FMenu);
    this.activeMenu({
      FMenu,
      SMenu: this.$route.fullPath
    })
  }
};
</script>
<style lang="less" scoped>
.main-container {
  height: calc(~"100vh - 61px");
  margin-top: 61px;
}
</style>
