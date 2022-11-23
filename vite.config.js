import path from 'path';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

export default {
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [AntDesignVueResolver()],
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    },
  },
  server: {
    host: '0.0.0.0',
    port: 7001,
    open: true,
    proxy: {
      // 选项写法
      '/api': {
        target: 'http://192.168.10.10:8094',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nuc-api/, 'nuc-api')
      },
    }
  }
};
