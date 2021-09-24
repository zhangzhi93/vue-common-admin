module.exports = {
  publicPath: './',
  transpileDependencies: [
    'vue-echarts',
    'resize-detector',
  ],
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 7001,
    https: false,
    hotOnly: false,
    proxy: null, // 设置代理
    progress: true,
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            'primary-color': '#00aff0',
            'border-radius-base': '2px',
            'tabs-card-height': '30px',
          },
        }
      }
    }
  },
};
