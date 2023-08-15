<template>
  <div>
    <van-form @submit="submitFeedback">
      <van-field
        v-model="feedback.ftext"
        label="反馈"
        placeholder="请输入您的反馈"
        type="textarea"
        rows="10"
        style="margin-top: 50px;"
        required
      />
      <van-uploader
        :after-read="afterReadFile"
        :max-count="1"
        accept="image/gif, image/jpeg, image/png"
      >
        <div class="avatar-container">
          <img v-if="feedback.attachment"
               :src="feedback.attachment" class="avatar" alt="Uploaded Avatar" />
          <img v-else src="https://th.bing.com/th/id/OIP.X-5ho42VHJwTZg1ixPxo4wAAAA?pid=ImgDet&rs=1" class="avatar" alt="Default Plus Image" />
        </div>
      </van-uploader>
      <div class="submit-button">
        <van-button type="primary" native-type="submit" block>提交反馈</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      feedback: {
        ftext: '',
        attachment: '',
      },
    };
  },
  methods: {
    afterReadFile(file) {
      // 这里你可以处理文件上传，然后将链接或其他信息存储到 feedback.attachment
      const formData = new FormData();
      formData.append('file', file.file); // 'file' 必须与后端接收的字段名相匹配
      axios
        .post('https://localhost:8080/api/auth/uploadavatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log('上传成功', response.data);
          this.feedback.attachment = response.data.data.avatar_url;
        })
        .catch((error) => {
          console.error('上传失败', error);
          this.$bvToast.toast('上传失败', {
            title: '系统提醒',
            variant: 'danger',
            solid: true,
          });
        });
    },
    submitFeedback() {
      if (this.feedback.ftext.trim() === '') {
        this.$toast('反馈内容不能为空');
        return;
      }
      this.$axios
        .post('https://localhost:8080/api/auth/submitFeedback', this.feedback)
        .then((response) => {
          if (response.data.code === 200) {
            this.$toast('反馈提交成功');
            // 你可以在这里做一些跳转或其他操作
            this.$router.push('/profile');
          } else {
            this.$toast(`反馈提交失败: ${response.data.message}`);
          }
        })
        .catch((error) => {
          this.$toast(`提交出错: ${error.message}`);
        });
    },
  },
};
</script>

<style>
.submit-button {
  margin: 20px;
}
</style>
