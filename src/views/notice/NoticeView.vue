<template>
  <div>
    <!-- 通知列表 -->
    <van-list v-if="notices.length > 0" class="notification-list" ref="totalGroup">
      <!-- 标记未读 -->
      <van-cell
            v-for="(notice, index) in nownotices"
            :key="index"
            :class="{ 'notification-unread': !notice.read }"
            @click="viewNotice(notice,index)"
        >
          <template #icon>
          <van-image
            v-if="notice.type==='pcomment'|| notice.type==='ccomment'"
            :src="notice.senderAvatar"
            width="48"
            height="48"
            round
          />
          </template>
        <van-col style="margin-outside: 5px">
          <van-row style="margin-top:5px">{{formatNoticeTitle(notice)}}</van-row>
          <van-row style="margin-top: 5px">{{formatNoticeContent(notice)}}</van-row>
        </van-col>
        <van-badge :content="'New'"/>
      </van-cell>
      <van-cell class="loading" v-if="loading">正在加载...</van-cell>
      <van-button v-else block @click="loadMoreNotices">加载更多</van-button>
    </van-list>
    <p v-else>没有通知</p>
    <!-- 查看通知弹窗 -->
    <van-popup v-if="currentNotice"
               v-model="modalVisible" position="center"
               overlay @close="markAsRead"
               safe-area-inset-bottom
               round>
      <div class="d-flex align-items-center" style="margin: 10px">
        <!-- 头像 -->
        <img
            v-if="currentNotice.type==='pcomment'|| currentNotice.type==='ccomment'"
            :src="currentNotice.senderAvatar"
            width="48"
            height="48"
            class="avatar mr-2"
            alt=""
        >
        <div style="display: flex;flex-direction: column;">
          <!-- 标题 -->
          <van-col>
            <van-row v-if="currentNotice.type==='pcomment'
            || currentNotice.type==='ccomment'"
                  class="title" STYLE="color: #409EFF">{{ currentNotice.senderName }}</van-row>
            <van-row v-else class="title" STYLE="color:saddlebrown">系统通知：</van-row>
            <van-row style="font-size:10px;color: #888888">
              {{ formatDate(currentNotice.time) }}</van-row>
          </van-col>
          <!-- 内容和类型 -->
          <div style="display: flex;flex-direction: column;">
            <span v-if="currentNotice.type === 'pcomment'" class="postjump"
                  @click="showDetails" @keydown.enter="showDetails">评论了你的帖子: </span>
            <span v-if="currentNotice.type === 'ccomment'" class="postjump"
                  @click="showDetails" @keydown.enter="showDetails">回复了你的评论: </span>
            <span v-if="currentNotice.type === 'punishment'" style="color: red">警告，你的账号出现违规： </span>
            <span v-if="currentNotice.type === 'sue'">你的举报已得到处理： </span>
            <span v-if="currentNotice.type === 'feedback'">你的反馈已得到处理回复： </span>
            <span class="preview mb-2" style="color:black">{{ currentNotice.content }}</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import request from '@/utils/request';

export default {
  data() {
    return {
      loading: true,
      page: 1,
      pagesize: 10,
      notices: [],
      currentNotice: null,
      currentIndex: 0,
      modalVisible: false, // 弹出窗口是否可见
    };
  },
  mounted() {
    this.getNotices();
    window.addEventListener('scroll', this.handleScroll);
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userModule.userInfo,
    }),
    nownotices() {
      return this.notices.slice(0, this.page * this.pagesize);
    },
    isNightStyle() {
      if (JSON.parse(localStorage.getItem('Style')) === 'night') {
        return true;
      }
      return false;
    },
  },
  created() {
    if (typeof localStorage !== 'undefined') {
      if (!localStorage.getItem('Style')) {
        localStorage.setItem('Style', JSON.stringify('day'));
      }
    }
    if (this.$route.params.before) {
      this.before = this.$route.params.before;
    }
  },
  methods: {
    formatNoticeTitle(notice) {
      let title = '';
      if (notice.type === 'pcomment' || notice.type === 'ccomment') {
        title += `${notice.senderName}：\n`;
      }
      return title;
    },
    formatNoticeContent(notice, isTitle = false) {
      let content = '';
      switch (notice.type) {
        case 'pcomment':
          content += '评论了你的帖子：';
          break;
        case 'ccomment':
          content += '回复了你的评论：';
          break;
        case 'punishment':
          content += '警告，你的账号出现违规：';
          break;
        case 'sue':
          content += '你的举报已得到处理：';
          break;
        case 'feedback':
          content += '你的反馈已得到处理回复：';
          break;
        default:
          content += '';
      }
      if (isTitle) {
        content += '\n';
        content += notice.content;
      } else {
        content += notice.content.length > 5 ? `${notice.content.slice(0, 5)}...` : `${notice.content}`;
      }
      return content;
    },
    // ...
    handleScroll() {
      this.$nextTick(() => {
        const listGroup = this.$refs.totalGroup.$el;
        if (listGroup.getBoundingClientRect().bottom <= window.innerHeight) {
          this.loadMoreNotices();
        }
      });
    },
    async loadMoreNotices() {
      window.removeEventListener('scroll', this.handleScroll);
      this.loading = true;
      setTimeout(() => {
        this.page += 1;
      }, 500);
      this.loading = false;
      window.addEventListener('scroll', this.handleScroll);
    },
    // 获取通知列表
    getNotices() {
      request.get('/auth/getNotice').then((response) => {
        // 注意这里接受的notice的字段是小写开头的驼峰,下面是对应的go结构体
        // type NoticeResponse struct {
        //   NoticeID     int    `json:"noticeID"`
        //   ReceiverName string `json:"receiverName"`
        //   SenderName   string `json:"senderName"`
        //   SenderAvatar string `json:"senderAvatar"`
        //   Type         string `json:"type"`
        //   Content      string `json:"content"`
        //   Read         bool   `json:"read"`
        //   PostID       int    `json:"postID"`
        //   Target       int    `json:"target"`
        //   PcommentID   int    `json:"pcommentID"`
        // }
        this.notices = response.data.sort((a, b) => {
          // 先比较是否已读
          if (a.read && !b.read) {
            return 1;
          } if (!a.read && b.read) {
            return -1;
          }
          // 如果两个通知都已读或都未读，则比较时间
          const timeA = Date.parse(a.time);
          const timeB = Date.parse(b.time);
          if (timeA < timeB) {
            return 1;
          } if (timeA > timeB) {
            return -1;
          }
          return 0;
        });
      }).then(() => {
        this.loadMoreNotices();
      }).catch((error) => {
        console.error(error);
      });
    },
    // 查看通知
    viewNotice(notice, index) {
      this.currentNotice = notice;
      this.currentIndex = index;
      this.modalVisible = true;
    },
    // 标记为已读
    markAsRead() {
      if (this.currentNotice.read === false) {
        const { noticeID } = this.currentNotice;
        request.patch(`/auth/readNotice/${noticeID}`, { read: true }).then(() => {
          this.notices[this.currentIndex].read = true;
          this.currentIndex = 0;
        }).catch((error) => {
          console.error(error);
        });
      }
      this.currentNotice = null;
    },
    showDetails() {
      // 标为已读
      const nowNotice = this.currentNotice;
      // const nowComment = this.currentComment;
      this.markAsRead();
      if (!this.userInfo) {
        this.toLogin = true;
        return;
      }
      // 跳转到对应的帖子
      setTimeout(() => {
        if (nowNotice.type === 'pcomment') {
          const link = this.$router.resolve({
            name: 'postDetails',
            query: {
              id: nowNotice.postID, partition: this.partition, before: 'notice', pcommentID: nowNotice.target,
            },
          });
          window.open(link.href, '_blank');
        } else if (nowNotice.type === 'ccomment') {
          const link = this.$router.resolve({
            name: 'postDetails',
            query: {
              id: nowNotice.postID, partition: this.partition, before: 'notice', pcommentID: nowNotice.pcommentID, ccommentID: nowNotice.target,
            },
          });
          window.open(link.href, '_blank');
        }
      }, 100);
    },
    formatDate(date) {
      // 格式化日期时间
      const d = new Date(date);
      return `${d.getFullYear()}年${
        d.getMonth() + 1
      }月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.notification-list {
  margin-top: 10px;
  margin-bottom: 10px;
}

.notification-item {
  cursor: pointer;
}

.notification-unread {
  background-color: #f7f7f7;
}

.notification-unread .van-cell__title {
  font-weight: bold;
}

p {
  color: #888;
}

.avatar {
  border-radius: 50%;
}

.postjump {
  font-size: 14px;
  cursor: pointer;
  color: #409eff;
  text-decoration: underline;
}

.preview {
  font-size:14px;
  display: inline-block;
  max-width: 700px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
}

.notification-item {
  cursor: pointer;
}

.title {
  font-size: 18px; /* 调整为适合的字体大小 */
}

</style>
