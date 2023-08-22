<template>
  <div>
      <van-notice-bar left-icon="volume-o" :scrollable="true"
                      text="欢迎大家来到软工集市，此版本为内测版本" style="margin-bottom: 10px;"/>
      <div class="profile_box">
          <div class="avatar-container">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="Uploaded Avatar"/>
            <i v-else class="van-icon van-icon-add-o avatar"></i>
          </div>
        <div class="user_information">
          <van-cell-group>
            <van-field class="field-spacing" label="用户名" readonly="true"
                       v-model="userInfo.name"/>
            <van-field class="field-spacing" label="手机号" readonly="true"
                       v-model="userInfo.phone" value="输入框已禁用" />
            <van-field class="field-spacing" label="邮箱" readonly="true"
                       v-model="userInfo.email" value="输入框已禁用" />
            <van-field class="field-spacing" readonly="true"
                       v-model="userInfo.intro" rows="2" autosize label="简介" type="textarea"
                       maxlength="100" placeholder="请输入留言" show-word-limit/>
          </van-cell-group>
        </div>
      </div>
    <div class="function_box">
      <van-cell-group title="">
        <van-cell class="my_icon" title="修改信息" icon="certificate"
                  value=" " size="large" is-link to="/changeDetail"/>
        <van-cell class="my_icon" title="我的收藏" icon="coupon-o"
                  @click="gotoSave" value=" " size="large" is-link/>
        <van-cell class="my_icon" title="历史记录" icon="records"
                  @click="gotoHistory" value=" " size="large" is-link/>
        <van-cell class="my_icon" title="更多信息" icon="chat-o"
                  @click="open" value=" " size="large" is-link/>
        <van-cell class="my_icon" title="退出" icon="revoke"
                  @click="logout" value=" " size="large" is-link/>
        <van-cell class="my_icon" title="反馈" icon="warning-o"
                  value=" " size="large" is-link to="/feedback"/>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import axios from 'axios';
import { Dialog } from 'vant';
// eslint-disable-next-line import/no-cycle
import request from '@/utils/request';

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
    ...mapActions('userModule', ['logout']),
    afterRead(file) {
      const formData = new FormData();
      formData.append('file', file.file); // 'file' 必须与后端接收的字段名相匹配
      formData.append('phone', this.userInfo.phone);
      axios
        .post(`${process.env.VUE_APP_BASE_URL}auth/updateAvatar`, formData, {
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
      if (this.userInfo.name.trim() === '') {
        Dialog.alert({
          title: '保存失败',
          message: '用户名不能为空！',
          confirmButtonText: '确定',
        });
        return; // 如果用户名为空，则返回，不执行以下的保存逻辑
      }
      const updatedUserInfo = {
        userID: this.userInfo.userID,
        name: this.userInfo.name,
        num: this.userInfo.num,
        intro: this.userInfo.intro,
        avatarURL: this.userInfo.avatarURL,
      };
      request.post(`${process.env.VUE_APP_BASE_URL}auth/updateUserInfo`, updatedUserInfo)
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
    gotoSave() {
      this.$router.push({ path: '/save' });
    },
    gotoHistory() {
      this.$router.push({ path: '/history' });
    },
  },
};
</script>

<style>
.profile_box {
  display: flex;
  flex-direction: row;
  align-items: center; /* 可选，用于垂直居中对齐 */
  justify-content: center; /* 居中对齐 */
}
.function_box{
  padding-left: 5%;
  padding-right: 5%;
  border: 2px solid black;
}
.avatar-container {
  width: 200px;
  height: 200px;
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

.field-spacing {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
