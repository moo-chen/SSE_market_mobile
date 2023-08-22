<template>
  <div class="login-view">
    <h2>SSE_market</h2>
    <div class="login" @keydown.enter="login">
      <van-row>
        <van-cell>
          <van-form>
            <van-field
              v-model="user.email"
              label="邮箱"
              type="text"
              placeholder="请输入邮箱"
              required
              :error-message="errorMessage"
            ></van-field>
            <van-field
              v-model="user.password"
              label="密码"
              type="password"
              placeholder="输入密码"
              required
              :error-message="errorInfo"
            ></van-field>
            <van-row style="margin:10px" type="flex" justify="space-around">
              <van-col offset="6">
                <van-button @click="login">登录</van-button>
              </van-col>
              <router-link style="margin-top: 10px" to="/register">注册</router-link>
              <router-link style="margin-top: 10px" to="/modifyPassword">忘记密码</router-link>
            </van-row>

          </van-form>
        </van-cell>
      </van-row>
    </div>
  </div>
</template>

<script>

import { mapActions } from 'vuex';
import validator from '@/helper/validator';

export default {
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      showKeyboard: false,
      errorInfo: '', // 密码错误提示
      errorMessage: '', // 邮箱错误提示
      // item: require('@/assets/用户条款.txt'),
    };
  },
  methods: {
    ...mapActions('userModule', { userlogin: 'login' }),
    login() {
      this.userlogin(this.user)
        .then(() => {
          this.$toast.success('登陆成功');
          this.$router.push({ name: 'home' });
        })
        .catch((err) => {
          console.error(err); // 打印完整的错误对象
          if (err.response && err.response.data) {
            this.$toast.fail(err.response.data.msg);
          } else {
            this.$toast.fail('登录失败'); // 或者其他通用错误消息
          }
        });
    },
  },
  watch: {
    // eslint-disable-next-line func-names
    'user.password': function (password) {
      if (password < 6) {
        this.errorInfo = '密码长度>6';
      } else {
        this.errorInfo = '';
      }
    },
    // eslint-disable-next-line func-names
    'user.email': function (email) {
      if (!validator.emailValidator(email)) {
        this.errorMessage = '请输入格式正确的邮箱';
      }
    },
  },
};
</script>
