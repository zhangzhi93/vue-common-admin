/*
 * Copyright 2021
 * Created by janz (zhangzhi93@hotmail.com)
 */

import axios from 'axios';
import storage from 'store';
import { message } from 'ant-design-vue';

const instance = axios.create({
  // -------  线上环境 -------------------------
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : '',
  timeout: process.env.NODE_ENV === 'development' ? 60000 : 30000,
  withCredentials: true,
});

const resetToLogin = () => {
  message.error({
    content: '此账号已经在别处登录',
    duration: 1,
    onClose: () => {
      window.location.replace('#/login');
    }
  });
};

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    // 从 localstorage 获取 token
    if (error.response.status === 403) {
      resetToLogin();
    }
    if (error.response.status === 401) {
      resetToLogin();
    }
  }
  return Promise.reject(error);
};

// 添加请求拦截器
instance.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  // 能做的事如下 检查权限 增加页面loading  网络状态判断等
  const token = storage.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, errorHandler);

// 添加响应拦截器
instance.interceptors.response.use(response => {
  // 对响应数据做点什么
  if (response.data.code !== 200 && response.data.code !== 220) {
    message.error(response.data.msg);
    return Promise.reject(response.data.msg);
  }
  return response.data;
}, errorHandler);

const post = (url, data) => {
  return instance({
    method: 'post',
    url,
    data,
    headers: {
      'Content-Type': 'application/json',
      charset: 'utf-8',
    },
  });
};

const put = (url, data) => {
  return instance({
    method: 'put',
    url,
    data,
    headers: {
      'Content-Type': 'application/json',
      charset: 'utf-8',
    },
  });
};

const get = (url, params, options = {}) => {
  const { baseUrl } = options;
  // for (const k in params) {
  //   if (!(params[k] && params[k].trim())) {
  //     delete params[k];
  //   }
  // }
  return instance({
    method: 'get',
    url: `${baseUrl || ''}${url}`,
    params,
  });
};

const del = (url, params, options = {}) => {
  const { baseUrl } = options;
  // for (const k in params) {
  //   if (!(params[k] && params[k].trim())) {
  //     delete params[k];
  //   }
  // }
  return instance({
    method: 'delete',
    url: `${baseUrl || ''}${url}`,
    params,
  });
};

export default {
  post,
  put,
  get,
  del,
};
