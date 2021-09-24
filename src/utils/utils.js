/*
 * 获取deep深度的树 return data.map(item => this.getTreeDataByDeep(item, 0));
 */
function getTreeDataByDeep (data, deep, point, key = 'children') {
  return data.map(item => {
    const temp = { ...item };
    if (point < deep) {
      if (temp[key] && temp[key].length > 0) {
        temp[key] = getTreeDataByDeep(item[key], deep, point + 1, key);
      }
    } else {
      delete temp[key];
    }
    return temp;
  });
}

/*
 * url 需要分割的url  menuLevel = 2 时 /a/b/c/d -> ['a','b']
 */
function getMenuNameFromUrl (url, menuLevel) {
  return url.substr(1).split('/').slice(0, menuLevel);
}

//
function getLastMenuListFromName (list = [], names, index, callback) {
  const subList = names ? list.find(item => item.name === names[index]) : list[0];
  if (subList) {
    if (subList.hasOwnProperty('children') && subList.children.length > 0) {
      getLastMenuListFromName(subList.children, names, index + 1, callback);
    } else {
      callback(subList);
    }
  } else {
    console.warn('请查看菜单配置！');
  }
}
/*
 * 根据分割的url获取菜单列
 *
 * MenuList 菜单嵌套数组
 * url 需要分割的url(地址栏中#/后面的地址)
 */
function getMenuInfoFromUrl (menuList, pathKeys) {
  let LastMenu = {};
  getLastMenuListFromName(menuList, pathKeys, 0, data => {
    LastMenu = data;
  });
  return LastMenu;
}
/*
 * 获取tablist
 *
 * url 需要分割的url
 */
function getActiveTabInfo (list, url) {
  return list.find(item => {
    const [path] = item.path.split('?');
    return path === url;
  });
}

/*
 * 递归转换
 */
function recursionConvert (data = [], format, key = 'children') {
  return data.map(item => {
    const temp = format(item);
    if (temp && item[key]) {
      temp[key] = recursionConvert(item[key], format, key);
    }
    return temp;
  }).filter(item => !!item);
}

/*
 * 递归过滤
 */
function recursionFilter (data = [], permission, key = 'children') {
  return data.filter(item => {
    if (permission === 'ALL' || item.meta.roles.includes('ALL') || item.meta.roles.includes(permission)) {
      if (item[key] && item[key].length > 0) {
        item[key] = recursionFilter(item[key], permission, key);
      }
      return true;
    }
    return false;
  });
}

export { getMenuNameFromUrl, getMenuInfoFromUrl, getActiveTabInfo, recursionConvert, recursionFilter, getTreeDataByDeep };
