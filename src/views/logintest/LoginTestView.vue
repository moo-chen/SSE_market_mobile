<template>
  <div class="login-view">
    <div class="login" @keydown.enter="login">
      <van-row class="mt-5">
        <van-col span="8" offset="8">
          <van-cell>
            <van-form>
              <van-field
                v-model="user.phone"
                label="手机号"
                type="tel"
                placeholder="输入手机号"
              ></van-field>
              <van-field
                v-model="user.password"
                label="密码"
                type="password"
                placeholder="输入密码"
              ></van-field>
              <van-button @click="login">登录</van-button>
            </van-form>
          </van-cell>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>

import { mapActions } from 'vuex';

export default {
  data() {
    return {
      user: {
        phone: '',
        password: '',
      },
    };
  },
  methods: {
    ...mapActions('userModule', { userlogin: 'login' }),
    login() {
      this.userlogin(this.user)
        .then(() => {
          this.$router.go(0);
        })
        .catch((err) => {
          this.$toast.fail(err.response.data.msg);
        });
    },
  },
};
</script>
