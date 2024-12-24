<template>
  <div class="point-cloud-container">
    <PointColud :data="pointData" />
  </div>
</template>

<script setup>
import PointColud from '@/components/PointColud/index.vue';
import pointData from './data';

console.log(pointData);
</script>

<style lang="less" scoped>
.point-cloud-container {
  padding: 15px;
  height: calc(100vh - 80px);
}
</style>
