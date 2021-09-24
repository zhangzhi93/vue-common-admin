<template>
  <div class="login-container">
    <!-- <div class="brand">
      <img src="../assets" title="中海地产">
    </div>
    <div class="title">
      <img src="../assets/images/title.png" title="不合规行为清单查询">
    </div> -->
    <div class="login-form">
      <h2>用户登录</h2>
      <a-form-model :model="loginForm" :rules="rules" ref="loginForm">
        <a-form-model-item prop="username">
          <a-input v-model="loginForm.username" placeholder="请输入您的账号" class="login-input">
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input v-model="loginForm.password" type="password" placeholder="请输入您的密码" class="login-input">
            <a-icon type="lock" slot="prefix" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="code">
          <a-row>
            <a-col :span="10">
              <a-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" @keyup.enter.native="handleLogin" />
            </a-col>
            <a-col :span="8">
              <div class="login-code">
                <img :src="codeUrl" @click="getCode" style="height:32px;margin:0 15px 0 20px">
              </div>
            </a-col>
            <a-col :span="5">
              <div class="refresh-code">
                <span @click="getCode">换一张</span>
              </div>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item>
          <a-checkbox v-model="rememberMe">记住密码</a-checkbox>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" size="large" :loading="loading" @click.native.prevent="handleLogin" class="login-btn">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="copyright">
      <span>版权所有 Copyright 2021 corperation.All rights reserved</span>
    </div>
  </div>
</template>

<script>
import storage from 'store';
import { mapMutations } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      loginForm: {
        username: 'admin',
        password: '123456',
        code: '1234',
        uuid: ''
      },
      codeUrl: '',
      rememberMe: false,
      rules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      }
    };
  },
  created() {
    storage.clearAll();
    // this.getCode();
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USER_INFO',
    }),
    getCode() {
      this.$api.login.getCaptchaImage().then(data => {
        this.codeUrl = 'data:image/gif;base64,' + data.img;
        this.loginForm.uuid = data.uuid;
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const time = 7 * 24 * 60 * 60 * 1000;
          setTimeout(() => {
            const info = {
              token:'ab354djdkj3939',
              nickname: 'janz',
              permission: 'ALL'
            }
            storage.set('token', info.token, time);
            this.setUserInfo(info);
            this.loading = false;
            this.$router.replace('/');
          }, 1500)

          // this.$api.login.onLogin(this.loginForm).then((res) => {
          //   this.loading = false;
          //   this.setUserInfo(res.data);
          //   const time = 7 * 24 * 60 * 60 * 1000;
          //   storage.set('userinfo', JSON.stringify(res.data), time);
          //   storage.set('token', res.data.token, time);
          //   this.$router.replace('/');
          // }).catch((msg) => {
          //   this.loading = false;
          //   this.getCode();
          // });
        }
      });
    }
  },
};
</script>

<style lang="less" scoped>
.login-container {
  position: relative;
  height: 100vh;
}
.brand {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 160px;
  img {
    width: 100%;
  }
}
.title {
  position: absolute;
  top: 54vh;
  left: 11vw;
  width: 450px;
  img {
    width: 100%;
  }
}
.login-form {
  position: absolute;
  right: 15vw;
  top: 25vh;
  width: 350px;
  h2 {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 30px;
  }

  /deep/.has-error .login-input .ant-input:focus {
    box-shadow: none;
  }
}
.login-input {
  /deep/.ant-input {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #d8d8d8;
    &:focus {
      box-shadow: none;
    }
  }
}
.login-btn {
  background: linear-gradient(to bottom, #c6383e, #ab2027, #8e0c18);
  border-top-color: #d87678;
  border-bottom-color: #8d0b17;
  border-left: none;
  border-right: none;
  width: 100%;
  border-radius: 0;
  &:hover,
  &:focus {
    background: linear-gradient(to bottom, #c6383e, #ab2027, #8e0c18);
    border-top-color: #d87678;
    border-bottom-color: #8d0b17;
    border-left: none;
    border-right: none;
    color: #fff;
  }
}

.refresh-code {
  flex: 1;
  text-decoration: underline;
  margin-left: 10px;
  span {
    cursor: pointer;
  }
}
.copyright {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px 0;
  text-align: center;
  font-size: 14px;
  background-color: #000;
  color: #989898;
}
</style>
