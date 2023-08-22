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
          type="email"
          :rule="[
            { required: true, message: '请输入邮箱' },
            { pattern: '/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/', meesage: '邮箱不符合要求'}
          ]"
          placeholder="请输入邮箱"
        />
        <van-field
          v-model="user.password"
          type="password"
          :rule="[
            { required: true, message: '请输入密码' },
          ]"
          label="密码"
          placeholder="请输入密码"
        />

        <van-field
          v-model="user.password2"
          type="password"
          :rule="[
            { required: true, message: '请再次输入密码' },
          ]"
          label="再次输入密码"
          placeholder="请再次输入密码"
        />

        <van-field
          v-model="user.valiCode"
          label="验证码"
          :rule="[
            { required: true, message: '请输入邮箱验证码' },
          ]"
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
import customValidator from '@/helper/validator';

export default {
  computed: mapState({
    userInfo: (state) => state.userModule.userInfo,
  }),
  data() {
    return {
      line: '<br/>',
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
      console.error(this.user);
      this.emailValidate(this.user).then(() => {
        this.user.phone = this.userInfo.phone;
        this.userModify(this.user).then(() => {
          this.$toast.fail('修改密码成功');
        }).catch((err) => {
          console.error(err);
          this.$toast.fail(err.response.data.msg);
        });
      }).catch((err) => {
        this.$toast.fail(err.response.data.msg);
      });
    },

    validateEmail() {
      this.user.mode = 1;
      console.error(this.user);
      this.userValidate(this.user).then(() => {
        this.$toast.success('已发送验证码，请将邮箱发送的验证码输入以完成注册验证');
      }).catch((err) => {
        console.error(err);
        this.$toast.fail(err.response.data.msg);
      });
    },
  },
};
</script>

<style>

</style>
