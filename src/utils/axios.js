/*
 * Copyright 2019
 * Created by janz (zhangzhi93@hotmail.com)
 */

import axios from 'axios';
import { Message } from 'element-ui';
import { GlobalLoading } from './tools';

const Loading = new GlobalLoading();

const instance = axios.create({
  // -------  线上环境 -------------------------
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
  withCredentials: true,
});

// 添加请求拦截器
instance.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  // 能做的事如下 检查权限 增加页面loading  网络状态判断等
  Loading.showFullScreenLoading();
  return config;
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(response => {
  // 对响应数据做点什么
  Loading.tryHideFullScreenLoading();
  if (response.data.resultCode !== '200') {
    Message.error(response.data.message);
  }
  return response;
}, error => {
  // 对响应错误做点什么
  if (error.response.status === 401) {
    window.location.replace('#/login');
  }
  return Promise.reject(error);
});


export default instance;
