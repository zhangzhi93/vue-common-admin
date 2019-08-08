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
import Slider from "../components/Slider/index.vue";
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
  methods: {
    ...mapMutations({
      setActiveMenu: 'SET_ACTIVE_MENU',
    }),
  },
  mounted() {
    this.setActiveMenu(this.$route.fullPath);
  }
}
</script>
<style lang="less">
.container {
  height: calc(~"100vh - 50px");
  margin-top: 50px;
}
.main {
  padding: 0 !important;
}
.content {
  padding: 10px;
}
</style>
