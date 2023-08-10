<template>
  <div>
    <div>
      <van-uploader
        :after-read="afterRead"
        :max-count="1"
        accept="image/gif, image/jpeg, image/png"
      >
        <div class="avatar-container">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="Uploaded Avatar" />
          <i v-else class="van-icon van-icon-add-o avatar"></i>
        </div>
      </van-uploader>
    </div>
    <div class="mt-5">
      <van-cell-group>
        <van-field label="用户名" v-model="userInfo.name"  required/>
        <van-field label="手机号" v-model="userInfo.phone" value="输入框已禁用" disabled />
        <van-field label="邮箱" v-model="userInfo.email" value="输入框已禁用" disabled />
      </van-cell-group>
      <van-field
        v-model="userInfo.intro"
        rows="2"
        autosize
        label="个人简介"
        type="textarea"
        maxlength="100"
        placeholder="请输入留言"
        show-word-limit
      />
    </div>
    <van-button type="primary" native-type="submit" @click="updateUserInfo"
                style="margin-right: 10px;">保存更改</van-button>
    <van-button type="info" @click="open">更多信息</van-button>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import request from '@/utils/request';
import axios from 'axios';
import { Dialog } from 'vant';

export default {
  computed: mapState({
    user: (state) => state.userModule.userInfo,
  }),
  data() {
    return {
      imageUrl: '',
      userTelephone: '',
      userInfo: {
        userID: '',
        phone: '',
        email: '',
        name: '',
        num: '',
        intro: '',
        ban: '',
        punishnum: '',
        avatarURL: '',
      },
    };
  },
  created() {
    this.getInfo({ phone: this.user.phone })
      .then((res) => {
        this.userInfo.userID = res.data.userID;
        this.userInfo.name = res.data.name;
        this.userInfo.num = res.data.num;
        this.userInfo.phone = res.data.phone;
        this.userInfo.email = res.data.email;
        this.userInfo.intro = res.data.intro;
        this.userInfo.ban = res.data.ban;
        this.userInfo.punishnum = res.data.punishnum;
        this.userInfo.avatarURL = res.data.avatarURL;
        this.imageUrl = this.userInfo.avatarURL;
      })
      .catch((err) => {
        console.error(err);
      });
  },
  methods: {
    afterRead(file) {
      const formData = new FormData();
      formData.append('file', file.file); // 'file' 必须与后端接收的字段名相匹配
      formData.append('phone', this.userInfo.phone);
      axios
        .post('https://localhost:8080/api/auth/uploadavatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log('上传成功', response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.error('上传失败', error);
          this.$bvToast.toast('上传失败', {
            title: '系统提醒',
            variant: 'danger',
            solid: true,
          });
          // 可以在此处处理上传失败的逻辑
        });
    },
    open() {
      if (this.userInfo.punishnum !== 0) {
        Dialog.alert({
          title: '违规信息',
          message: `解除封禁日期：${this.userInfo.ban}，违规次数：${this.userInfo.punishnum}次\n`,
          confirmButtonText: '确定',
        });
      } else {
        Dialog.alert({
          title: '违规信息',
          message: '您没有违规记录，请继续保持~',
          confirmButtonText: '确定',
        });
      }
    },
    ...mapActions('userModule', { getInfo: 'getInfo' }),
    updateUserInfo() {
      const updatedUserInfo = {
        userID: this.userInfo.userID,
        name: this.userInfo.name,
        num: this.userInfo.num,
        intro: this.userInfo.intro,
        avatarURL: this.userInfo.avatarURL,
      };

      request.post('https://localhost:8080/api/auth/updateUserInfo', updatedUserInfo)
        .then((response) => {
          // 处理更新成功的逻辑
          console.log(response);
          console.log('用户信息更新成功');
          Dialog.alert({
            title: '保存成功',
            message: '用户信息已成功更新！',
            confirmButtonText: '确定',
          });
        })
        .catch((error) => {
          // 处理更新失败的逻辑
          console.error('用户信息更新失败', error);
        });
    },
  },
};
</script>

<style>
.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 10%;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.avatar, .van-icon.van-icon-add-o.avatar {
  width: 100%;
  height: 100%;
  object-fit: fill; /* 使图片填满容器 */
}

</style>
