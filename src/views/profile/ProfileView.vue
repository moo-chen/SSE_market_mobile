<template>
  <div>
    <div>
      <van-notice-bar
        left-icon="volume-o"
        :scrollable="true"
        text="欢迎大家来到软工集市，此版本为内测版本"
        style="margin-bottom: 10px;"
      />
      <div>
        <van-uploader
          :after-read="afterRead"
          :max-count="1"
          accept="image/gif, image/jpeg, image/png"
        >
          <div class="avatar-container">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="Uploaded Avatar"/>
            <i v-else class="van-icon van-icon-add-o avatar"></i>
          </div>
        </van-uploader>
      </div>
      <div>
        <van-cell-group>
          <van-field class="field-spacing"
                     label="用户名" v-model="userInfo.name" required/>
          <van-field class="field-spacing"
                     label="手机号" v-model="userInfo.phone" value="输入框已禁用" disabled/>
          <van-field class="field-spacing"
                     label="邮箱" v-model="userInfo.email" value="输入框已禁用" disabled/>
        </van-cell-group>
        <van-field
          class="field-spacing"
          v-model="userInfo.intro"
          rows="2"
          autosize
          label="简介"
          type="textarea"
          maxlength="100"
          placeholder="请输入留言"
          show-word-limit
        />
      </div>
      <van-button type="primary" native-type="submit" @click="updateUserInfo"
                  style="margin-right: 10px;">保存更改
      </van-button>
      <van-button type="info" @click="open">更多信息</van-button>
    </div>
    <div>
      <van-button class="custom-yellow-button" @click="gotoSave"
                  style="margin-right: 10px;">我的收藏
      </van-button>
      <van-button class="custom-light-blue-button" @click="gotoHistory">
        历史记录
      </van-button>
    </div>
    <div>
      <van-cell title="退出" clickable @click="logout"/>
    </div>
    <div class="feedback-link">
      <router-link to="/feedback">遇到问题了？点此反馈</router-link>
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

.feedback-link {
  text-align: center;
  margin: 300px 0;
}

.feedback-link a {
  color: #409EFF; /* 你可以选择合适的颜色 */
  text-decoration: none;
}

.feedback-link a:hover {
  text-decoration: underline;
}

.custom-yellow-button {
  background-color: rgba(197, 170, 17, 0.701);
  border-color: rgba(197, 170, 17, 0.701);
  color: white;
}

.custom-light-blue-button {
  background-color: #87CEEB;
  border-color: #87CEEB;
  color: white;
}
</style>
