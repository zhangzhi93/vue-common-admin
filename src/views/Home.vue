<template>
  <dashboard />
</template>
<script>
import Dashboard from "../components/dashboard"
export default {
  name: 'home',
  data() {
    return {
      total: 0
    };
  },
  components: {
    Dashboard
  },
  methods: {
    change(name) {
      console.log(name);
      this.$router.push({
        path: name
      })
    }
  }
}
</script>
<style lang="less">

</style>
