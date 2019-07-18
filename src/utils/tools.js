import { Loading } from 'element-ui';

function GlobalLoading() {
  this.loading = '';
}

GlobalLoading.prototype = {
  needLoadingRequestCount: 0,
  startLoading() {
    this.loading = Loading.service({
      target: '.el-main',
      lock: true,
      text: '加载中……',
    });
  },
  endLoading() {
    this.loading.close();
  },
  showFullScreenLoading() {
    if (this.needLoadingRequestCount === 0) {
      this.startLoading();
    }
    this.needLoadingRequestCount++;
  },
  tryHideFullScreenLoading() {
    if (this.needLoadingRequestCount <= 0) return;
    this.needLoadingRequestCount--;
    if (this.needLoadingRequestCount === 0) {
      this.endLoading();
    }
  },
  resetLoadingCount() {
    this.needLoadingRequestCount = 0;
  },
};

/*
 * url 需要分割的url
 */
function getMenuNameFromUrl(url) {
  return url.split('-/')[0].split('/');
}

//
function getLastMenuListFromName(list, names, index, callback) {
  const subList = list.find(item => item.name === names[index]);
  if (subList.children && subList.children.length > 0) {
    getLastMenuListFromName(subList.children, names, index + 1, callback);
  } else {
    callback(subList);
  }
}
/*
 * 根据分割的url获取菜单列
 *
 * url 需要分割的url
 */
function getMenuInfoFromNames(MenuList, url) {
  const MenuNames = getMenuNameFromUrl(url);
  const SubMenuList = MenuList.find(item => item.name === MenuNames[1]);
  let LastMenu = {};
  getLastMenuListFromName(MenuList, MenuNames, 1, data => {
    LastMenu = data;
  });
  console.log(LastMenu);
  return {
    SubMenuList,
    LastMenuMeta: LastMenu.meta,
    MenuNames,
  };
}
/*
 * 获取tablist
 *
 * url 需要分割的url
 */
function getActiveTabInfo(list, url) {
  const [noSearchUrl, searchUrl] = url.split('?');
  return list.find(item => item.path === noSearchUrl);
}
export { GlobalLoading, getMenuInfoFromNames, getActiveTabInfo };
