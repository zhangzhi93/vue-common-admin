<template>
  <router-view />
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'home',
  data() {
    return {
      total: 0,
    };
  },
  // methods: {
  //   ...mapMutations({
  //     setActiveMenu: 'SET_ACTIVE_MENU',
  //   }),
  // },
  // mounted () {
  //   this.setActiveMenu(this.$route.fullPath);
  // },
};
</script>
