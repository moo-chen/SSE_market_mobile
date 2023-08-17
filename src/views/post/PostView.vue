<template>
  <div class="post-form">
    <van-nav-bar title="发帖"
    left-arrow @click-left="onClickLeft"/>
    <van-cell-group>
      <van-field v-model="posts.title" label-width="50px"
      label="标题" placeholder="请输入标题"></van-field>
    </van-cell-group>

    <van-cell-group>
      <van-field v-model="posts.content" label="正文" label-width="50px" clearable
      type="textarea" rows="10" placeholder="请输入正文"></van-field>
    </van-cell-group>

    <van-cell-group title="图片上传"><van-cell>
    <van-uploader v-model="fileList" action='https://localhost:8080/api/auth/uploadphotos'
      multiple :on-preview='handlePictureCardPreview' list-type='picture-card'
      :on-remove='handleRemove' :on-success='handleSuccess'
      accept=".jpg,.png">
    </van-uploader></van-cell>
    </van-cell-group>
    <van-dialog v-model="dialogVisible">
      <img width='100%' :src='dialogImageUrl' alt='' />
    </van-dialog>

    <van-cell-group>
      <van-field
        v-model="posts.partition"
        label-width="50px"
        clickable
        readonly
        label="分区"
        placeholder="选择分区"
        @click="showPicker = true"
      />
      <van-popup v-model="showPicker" round position="bottom" class="custom-popup">
        <van-picker
          show-toolbar
          :columns="partitions"
          v-model="posts.partition"
          @cancel="showPicker = false"
          @confirm="onPartitionConfirm"
        />
      </van-popup>
    </van-cell-group>

    <van-cell-group>
    <van-checkbox-group v-model="tagitems">
      <template #default>
        <van-field
          label-width="50px"
          readonly
          label="标签"
        >
        <template #right-icon>
        <span class="tag-list">
          <van-checkbox
            v-for="(item, index) in tags"
            :key="index"
            :name="item.label"
            :value="item.label"
            class="tag-checkbox"
          >
          {{ item.label }}
          </van-checkbox>
        </span>
        </template>
        </van-field>
      </template>
    </van-checkbox-group>
    </van-cell-group>

    <div class="form-buttons">
      <van-button type="primary" size="large"
      @click='post()' class="custom-send-button">发送</van-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { Notify } from 'vant';
// import { Picker } from 'emoji-mart-vue';

export default {
  computed: mapState({
    userInfo: (state) => state.userModule.userInfo,
  }),
  props: {
    mode: String,
  },
  //   components: {
  //     Picker,
  //   },
  data() {
    return {
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      posts: {
        userTelephone: '',
        title: '',
        content: '',
        partition: '',
        photos: '',
        tagList: '',
      },
      showEmoji: false,
      showTagPicker: false,
      rounded: true,
      showPicker: false,
      partitions: ['日常吐槽', '学习交流', '恋爱交友', '二手闲置', '打听求助', '其他'],
      tags: [
        { label: '大厂', value: '大厂' },
        { label: '高工资', value: '高工资' },
        { label: '实习', value: '实习' },
      ],
      tagitems: [],
    };
  },
  methods: {
    ...mapActions('postModule', { Post: 'post' }),
    handleSuccess(response, file) {
      this.fileList.push({ name: file.name, url: response.fileURL });
    },
    handleRemove(file, fileList) {
      this.fileList = this.fileList.filter((item) => item.name !== file.name);
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onClickLeft() {
      this.$router.push({ path: '/' });
    },
    onTagConfirm() {
      this.showTagPicker = false;
      // 在这里处理选中的标签
    },
    send() {
      if (this.mode === 'post') {
        this.post();
      } else if (this.mode === 'feedback') {
        this.feedback();
      }
    },
    post() {
      this.posts.userTelephone = this.userInfo.phone;
      // 提取 fileList 中的所有 url，并连接成一个字符串
      this.posts.photos = this.fileList.map((file) => file.url).join('|');
      this.posts.tagList = this.tagitems.join('|');
      // 请求
      this.Post(this.posts)
        .then(() => {
          Notify({ type: 'success', message: '发帖成功' });
          // 跳转主页
          setTimeout(() => {
            this.$router.go(0);
          }, 500);
        })
        .catch((err) => {
          Notify({ type: 'danger', message: err.response.data.msg });
        });
    },
    addEmoji(emoji) {
      this.posts.content += emoji.native;
    },
    showEmojiStatus() {
      this.showEmoji = !this.showEmoji;
    },
    onPartitionConfirm(selectedValues) {
      this.posts.partition = selectedValues;
      this.showPicker = false;
    },
  },
};
</script>

<style>
.van-uploader__input {
    size : 20px !important;
}

.post-form {
  padding: 20px;
  font-weight: bold;
  font-family: 'Open Sans', sans-serif;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.tag-list {
  display: flex;
  align-items: center;
}

.tag-checkbox {
  margin-right: 8px;
}

.custom-send-button {
  background-color: transparent; /* Transparent background */
  border: 2px solid #409EFF; /* Blue border */
  border-radius: 30px; /* Rounded corners */
  color: #409EFF; /* Blue text color */
  height: 70px; /* Increased height */
  line-height: 46px; /* Centered text vertically */
  font-size: 25px; /* Adjust font size */
  padding: 0 20px; /* Adjust horizontal padding */
}
</style>
