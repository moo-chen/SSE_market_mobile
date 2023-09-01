<template>
  <div>
    <div>
      注册
    </div>

    <p v-html="line"></p>

    <div>
      <van-cell-group inset>
        <van-field
          v-model="user.name"
          label="用户名"
          placeholder="请输入用户名"
        />

        <van-field
          v-model="user.phone"
          type="tel"
          label="手机号"
          placeholder="请输入手机号,可不填或乱填11位手机号"
          :error-message="errorPhoneMessage"
        />
        <van-field
          v-model="user.email"
          required
          label="邮箱"
          placeholder="请输入邮箱"
          :error-message="errorEmailMessage"
        />

        <van-field
          v-model="user.password"
          type="password"
          required
          label="密码"
          placeholder="请输入密码"
          :error-message="errorPasswordMessage"
        />

        <van-field
          v-model="user.password2"
          type="password"
          required
          label="再次输入密码"
          placeholder="请再次输入密码"
          :error-message="errorPassword2Message"
        />

        <van-field
          v-model="user.valiCode"
          required
          label="验证码"
          placeholder="请输入邮箱验证码"
        >
          <template #button>
            <van-button size="small" type="info" @click="validateEmail">发送验证码</van-button>
          </template>
        </van-field>
        <van-field
          v-model="user.CDKey"
          required
          label="邀请码"
          placeholder="请输入邀请码"
        />
      </van-cell-group>
      <van-button size="normal" type="info" @click="register">
        注册
      </van-button>
    </div>
  </div>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
import { len } from 'vuelidate/lib/validators/common';
import customValidator from '@/helper/validator';

export default {
  data() {
    return {
      line: '<br/>',
      errorEmailMessage: '',
      errorPassword2Message: '',
      errorPasswordMessage: '',
      errorNumMessage: '',
      errorPhoneMessage: '',
      emailCheck: false,
      user: {
        phone: '',
        name: '',
        password: '',
        email: '',
        password2: '',
        valiCode: '',
        CDKey: '',
        mode: '',
      },
      validator: {
        name: {},
        phone: {
          required,
          phone: customValidator.telephoneValidator,
        },
        password: {
          required,
          minLength: minLength(6),
        },
        password2: {
          required,
          minLength: minLength(6),
        },
        email: {
          required,
          email: customValidator.emailValidator,
        },
        num: {
          required,
          minLength: minLength(8),
          maxLength: maxLength(8),
        },
        valiCode: {},
        CDKey: {},
        mode: {},
      },
    };
  },

  methods: {
    ...mapActions('userModule', { userRegister: 'register' }),
    ...mapActions('userModule', { userValidate: 'validateEmail' }),
    ...mapActions('userModule', { emailValidate: 'identityValidate' }),

    validateEmail() {
      this.user.mode = 0;
      console.error(this.user);
      if (this.emailCheck === true) {
        this.userValidate(this.user)
          .then(() => {
            this.$toast.success('已发送验证码，请将邮箱发送的验证码输入以完成注册验证');
          })
          .catch((err) => {
            console.error(err);
            this.$toast.fail(err.response.data.msg);
          });
      } else {
        this.$toast.fail('邮箱格式有误');
      }
    },

    register() {
      // 请求
      this.userRegister(this.user)
        .then(() => {
          // 这里写从后端成功返回数据后的操作
          this.$toast.success('注册成功,请登录', {
            title: '系统提醒',
            variant: 'primary',
            solid: true,
          });
          setTimeout(() => {
            this.$router.push({ name: 'logintest' });
          });
        })
        .catch((err) => {
          // 这里写从后端返回数据失败后的操作
          this.$toast.fail(err.response.data.msg, {
            title: '数据验证错误',
            variant: 'danger',
            solid: true,
          });
        });
    },
  },

  watch: {
    // eslint-disable-next-line func-names
    'user.phone': function (phone) {
      if (!customValidator.telephoneValidator(phone)) {
        this.errorPhoneMessage = '请输入格式正确的手机号';
      } else {
        this.errorPhoneMessage = '';
      }
    },
    // eslint-disable-next-line func-names
    'user.password': function (password) {
      if (len(password) < 6) {
        this.errorPasswordMessage = '密码长度需要不小于6位';
      } else {
        this.errorPasswordMessage = '';
      }
    },
    // eslint-disable-next-line func-names
    'user.password2': function (password2) {
      if (len(password2) < 6) {
        this.errorPassword2Message = '密码长度需要不小于6位';
      } else {
        this.errorPassword2Message = '';
      }
    },
    // eslint-disable-next-line func-names
    'user.email': function (email) {
      if (!customValidator.emailValidator(email)) {
        this.errorEmailMessage = '请输入格式正确的邮箱';
        this.emailCheck = false;
      } else {
        this.errorEmailMessage = '';
        this.emailCheck = true;
      }
    },
  },
};

</script>

<style>

</style>
