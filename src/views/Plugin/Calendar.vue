<template>
  <div>
    <div class="mobile">
      <calendar-panel></calendar-panel>
    </div>
  </div>
</template>

<script>
import CalendarPanel from 'vue-calendar-mobile-panel';

export default {
  name: 'Calendar',
  components: {
    CalendarPanel,
  },

  data() {
    return {

    };
  },
};
</script>

<style lang="less" scoped>
.mobile {
  width: 320px;
  height: 568px;
  margin: 0 auto;
  border: 1px solid #efefef;
}
</style>
