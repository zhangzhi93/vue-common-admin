<template>
  <el-container>
    <Header />
    <el-container class="container">
      <Slider />
      <el-main class="main">
        <SubHeader></SubHeader>
        <div class="content">
          <keep-alive>
            <router-view />
          </keep-alive>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapMutations } from 'vuex'
import Header from "../components/Header.vue";
import Slider from "../components/Slider.vue";
import SubHeader from "../components/SubHeader.vue";

export default {
  name: 'home',
  data() {
    return {
      total: 0
    };
  },
  components: {
    Header,
    Slider,
    SubHeader
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
}
</script>
<style lang="less">
.container {
  height: calc(~"100vh - 51px");
  margin-top: 51px;
}
.main {
  padding: 0 !important;
}
.content {
  padding: 10px;
}
</style>
