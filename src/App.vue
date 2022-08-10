<template>
  <a-config-provider :locale="zhCN">
    <keep-alive>
      <router-view />
    </keep-alive>
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
export default {
  name: 'App',
  data() {
    return {
      zhCN,
    };
  },
};
</script>
