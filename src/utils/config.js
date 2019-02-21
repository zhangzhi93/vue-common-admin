export const MenuList = [{
  key: 'index',
  index: '/index',
  name: '首页',
  icon: 'el-icon-menu',
  MenuList: [{
    key: 'Dashboard',
    index: '/Dashboard',
    name: 'Dashboard',
  }],
}, {
  key: 'message',
  index: '/message',
  name: '消息中心',
  icon: 'el-icon-message',
  MenuList: [{
    key: 'replyList',
    index: '/replyList',
    name: '回复列表',
  }, {
    key: 'SMS',
    index: '/SMS',
    name: '短信管理',
  }],
}, {
  key: 'user',
  index: '/user',
  name: '用户管理',
  icon: 'el-icon-news',
  MenuList: [{
    key: 'tags',
    index: '/tags',
    name: '用户标签',
  }, {
    key: 'location',
    index: '/location',
    name: '用户区域',
  }],
}];
