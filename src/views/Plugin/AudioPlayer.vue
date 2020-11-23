<template>
  <div>
    <vue-audio audio-source="https://moeplayer.b0.upaiyun.com/aplayer/secretbase.mp3"></vue-audio>
    <mini-audio audio-source="https://moeplayer.b0.upaiyun.com/aplayer/secretbase.mp3"></mini-audio>
  </div>
</template>

<script>
export default {
  name: 'AudioPlayer',
  data() {
    return {

    }
  },
  methods: {
    // 播放前做的事
    onBeforePlay(next) {
      console.log('这里可以做一些事情...')
      next() // 开始播放
    }
  }
}
</script>

<style>
</style>
