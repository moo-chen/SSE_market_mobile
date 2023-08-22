<!-- eslint-disable max-len -->
<template>
<div>
    <div>
        修改密码
    </div>

    <p v-html="line"></p>

    <div>
      <van-form inset>
        <van-field
          v-model="user.email"
          label="邮箱"
          required
          type="email"
          placeholder="请输入邮箱"
          :error-message="errorEmailInfo"
        />
        <van-field
          v-model="user.password"
          type="password"
          required
          label="密码"
          placeholder="请输入密码"
          :error-message="errorPasswordInfo"
        />

        <van-field
          v-model="user.password2"
          type="password"
          required
          label="再次输入密码"
          placeholder="请再次输入密码"
          :error-message="errorPassword2Info"
        />

        <van-field
          v-model="user.valiCode"
          label="验证码"
          required
          placeholder="请输入邮箱验证码"
        >
          <template #button>
            <van-button size="small" type="info" @click="validateEmail">发送验证码</van-button>
          </template>
        </van-field>
      </van-form>

      <van-button size="normal" type="info" @click="modifyPassword">
        修改密码
      </van-button>
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { required, minLength } from 'vuelidate/lib/validators';
import { len } from 'vuelidate/lib/validators/common';

import customValidator from '@/helper/validator';

export default {
  computed: mapState({
    userInfo: (state) => state.userModule.userInfo,
  }),
  data() {
    return {
      line: '<br/>',
      errorEmailInfo: '',
      errorPasswordInfo: '',
      errorPassword2Info: '',
      user: {
        mode: '',
        email: '',
        password: '',
        password2: '',
        valiCode: '',
      },
    };
  },
  validations: {
    user: {
      password: {
        required,
        password: minLength(6),
      },
      password2: {
        required,
        password2: minLength(6),
      },
      email: {
        required,
        email: customValidator.emailValidator,
      },
    },
  },
  methods: {
    ...mapActions('userModule', { userModify: 'modifyPassword' }),
    ...mapActions('userModule', { userValidate: 'validateEmail' }),
    ...mapActions('userModule', { emailValidate: 'identityValidate' }),

    modifyPassword() {
      // console.error(this.user);
      this.emailValidate(this.user).then(() => {
        this.userModify(this.user).then(() => {
          this.$toast.success('修改密码成功');
        }).catch((err) => {
          // console.error(err);
          this.$toast.fail(err.response.data.msg);
        });
      }).catch((err) => {
        console.error(err);
        this.$toast.fail(err.response.data.msg);
      });
    },

    validateEmail() {
      this.user.mode = 1;
      // console.error(this.user);
      this.userValidate(this.user).then(() => {
        this.$toast.success('已发送验证码，请将邮箱发送的验证码输入以完成注册验证');
      }).catch((err) => {
        // console.error(err);
        this.$toast.fail(err.response.data.msg);
      });
    },
  },

  watch: {
    // eslint-disable-next-line func-names
    'user.password': function (password) {
      if (len(password) < 6) {
        this.errorPasswordInfo = '密码长度需要不小于6位';
      } else {
        this.errorPasswordInfo = '';
      }
    },
    // eslint-disable-next-line func-names
    'user.password2': function (password2) {
      if (len(password2) < 6) {
        this.errorPassword2Info = '密码长度需要不小于6位';
      } else {
        this.errorPassword2Info = '';
      }
    },
    // eslint-disable-next-line func-names
    'user.email': function (email) {
      // console.error(email);
      if (!customValidator.emailValidator(email)) {
        this.errorEmailInfo = '请输入格式正确的邮箱';
      } else {
        this.errorEmailInfo = '';
      }
    },
  },
};
</script>

<style>

</style>
