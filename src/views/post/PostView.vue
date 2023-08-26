<template>
  <div class="post-form">
    <van-nav-bar title="发帖"
                 left-arrow @click-left="onClickLeft"/>
    <van-cell-group>
      <van-field v-model="posts.title" label-width="50px"
                 id="titleInput"
                 label="标题" placeholder="请输入标题">
        <!--      表情选择器-->
        <template #button>
          <van-button style="margin-right: 2px"
                      type='primary' size="small" plain
                      native-type="button"
                      @click="showTitleEmojiStatus">😀
          </van-button>
        </template>
      </van-field>
      <div v-if="showTitleEmoji">
        <picker
          :include="['people']"
          :showSearch="false"
          :showPreview="false"
          :showCategories="false"
          @select="addEmojiToTitle"
        />
      </div>
    </van-cell-group>
    <van-cell-group>
      <van-field v-model="posts.content" label="正文" label-width="50px" clearable
                 id="contentInput"
                 type="textarea" rows="10" placeholder="请输入正文">
        <!--      表情选择器-->
        <template #button>
          <van-button style="margin-right: 2px"
                      type='primary' size="small" plain
                      native-type="button"
                      @click="showContentEmojiStatus">😀
          </van-button>
        </template>
      </van-field>
      <div v-if="showContentEmoji">
        <picker
          :include="['people']"
          :showSearch="false"
          :showPreview="false"
          :showCategories="false"
          @select="addEmojiToContent"
        />
      </div>
    </van-cell-group>
    <van-cell-group title="图片上传">
      <van-cell>
        <van-uploader
          :file-list="fileList"
          :after-read="afterRead"
          :deletable="true"
          @delete="onDelete"
          :max-count="9"
          multiple
        />
      </van-cell>
    </van-cell-group>
    <van-dialog v-model="dialogVisible">
      <img width='100%' :src='dialogImageUrl' alt=''/>
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
    <div class="form-buttons">
      <van-button type="primary" size="large"
                  @click='post()' class="custom-send-button">发送
      </van-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { Notify } from 'vant';
import axios from 'axios';
import { Picker } from 'emoji-mart-vue';

export default {
  components: {
    Picker,
  },
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
      uploadPhotosActionURL: `${process.env.VUE_APP_BASE_URL}auth/uploadPhotos`,
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
      showContentEmoji: false,
      showTitleEmoji: false,
      showTagPicker: false,
      rounded: true,
      showPicker: false,
      partitions: ['日常吐槽', '学习交流', '恋爱交友', '二手闲置', '打听求助', '其他'],
    };
  },
  methods: {
    ...mapActions('postModule', { Post: 'post' }),
    afterRead(files) {
      const filesArray = Array.isArray(files) ? files : [files];

      filesArray.forEach((file) => {
        const formData = new FormData();
        formData.append('file', file.file);

        axios
          .post(this.uploadPhotosActionURL, formData)
          .then((response) => {
            const url = response.data.fileURL;
            this.fileList.push({ url });
          })
          .catch((error) => {
            console.error('Error uploading file:', error);
            // 在这里可以添加错误处理逻辑，比如提示用户上传失败等
          });
      });
    },
    onDelete(item) {
      this.fileList = this.fileList.filter((v) => v.url !== item.url);
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
      this.posts.photos = this.fileList.map((file) => file.url)
        .join('|');
      // 请求
      this.Post(this.posts)
        .then(() => {
          Notify({
            type: 'success',
            message: '发帖成功',
          });
          // 跳转主页
          setTimeout(() => {
            this.$router.push({ path: '/' });
          }, 500);
        })
        .catch((err) => {
          Notify({
            type: 'danger',
            message: err.response.data.msg,
          });
        });
    },
    addEmojiToContent(emoji) {
      const textarea = document.getElementById('contentInput');
      const startPos = textarea.selectionStart; // Get the cursor's start position
      const endPos = textarea.selectionEnd; // Get the cursor's end position
      // Insert the emoji at the cursor position
      this.posts.content = this.posts.content.slice(0, startPos)
        + emoji.native + this.posts.content.slice(endPos);

      // Update the cursor position to be after the inserted emoji
      const newCursorPos = startPos + emoji.native.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    },
    addEmojiToTitle(emoji) {
      const textarea = document.getElementById('titleInput');
      const startPos = textarea.selectionStart; // Get the cursor's start position
      const endPos = textarea.selectionEnd; // Get the cursor's end position
      // Insert the emoji at the cursor position
      this.posts.title = this.posts.title.slice(0, startPos)
        + emoji.native + this.posts.title.slice(endPos);

      // Update the cursor position to be after the inserted emoji
      const newCursorPos = startPos + emoji.native.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    },
    showContentEmojiStatus() {
      this.showContentEmoji = !this.showContentEmoji;
    },
    showTitleEmojiStatus() {
      this.showTitleEmoji = !this.showTitleEmoji;
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
  size: 20px !important;
}

.post-form {
  padding: 20px;
  font-weight: bold;
  font-family: 'Open Sans', sans-serif;
  margin-bottom: 100px;
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
