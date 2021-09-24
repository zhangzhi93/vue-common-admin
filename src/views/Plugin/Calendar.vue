<template>
  <div>
    <div class="mobile">
      <calendar-panel @change="onChange" v-model="date" :disableDate="disableDate"></calendar-panel>
    </div>
    <a-button type="primary" @click="jumpTo">跳转</a-button>
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
      date: '2019/10/18'
    };
  },
  methods: {
    onChange(val) {
      console.log(val)
    },
    jumpTo() {
      this.date = '2019/10/09'
    },
    disableDate(date) {
      return date.split('/')[2] === '12';
    }
  }
};
</script>

<style lang="less" scoped>
.mobile {
  width: 320px;
  height: 568px;
  margin: 0 auto;
  border: 1px solid #efefef;
  background-color: #fff;
}
</style>
