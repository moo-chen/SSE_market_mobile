<template>
  <div>
    <van-nav-bar
      :title="post.title"
      left-text="返回"
      right-text="更多"
      left-arrow
      @click-left="goback"
      @click-right="toggleMenu"
      fixed
      placeholder
      safe-area-inset-top
    />
  <div class='postDetails' style="margin-left:10px">
    <van-cell class='mx-auto my-5' style="max-width: 800px;"
    :style="{ 'background-color': isNightStyle ? 'rgb(50,50,50)' : 'white',
          'color': isNightStyle ? 'gray' : null}">
      <van-popup v-model="post.showMenu" position="bottom" round
                 :style="{ height: '40' }" @click.stop>
          <van-row
              :style="{ 'background-color': isNightStyle ? 'rgb(50,50,50)' : 'white',
                    'color': isNightStyle ? 'gray' : null,
                    margin:'20px'}">
            <van-icon class="mr-2" :name="post.isSaved ? 'star-o' : 'star'"
            @click.stop="save()" :class="{ 'text-warning': post.isSaved }"></van-icon>收藏
          </van-row>
        <hr>
          <van-row
                   v-if="this.post.authorTelephone !== userInfo.phone"
          :style="{ 'background-color': isNightStyle ? 'rgb(50,50,50)' : 'white',
                    'color': isNightStyle ? 'gray' : null,
                    margin:'20px'}"
            @click.stop="showReportModal = true">
            <van-icon name="failure" class="mr-2"></van-icon>举报
          </van-row>
          <van-popup v-model="showReportModal" title="举报" @hidden="clearReportReason"
            @ok="submitReport('post',post.postID)" ok-title="Submit">
            <van-field v-model="reportReason" placeholder="请输入举报原因" rows="8">
            </van-field>
          </van-popup>
          <van-cell v-if="this.post.authorTelephone === userInfo.phone"
          :style="{ 'background-color': isNightStyle ? 'rgb(50,50,50)' : 'white',
                    'color': isNightStyle ? 'gray' : null}"
            @click.stop="showDeleteModal = true">
            <van-icon name="delete-o" class="mr-2"></van-icon>删除
          </van-cell>
          <van-popup v-model="showDeleteModal" title="确认删除" ok-title="Confirm"
            @ok="postdelete(post)">
            <p>你确定要删除这个帖子吗？</p>
          </van-popup>
      </van-popup>
      <div class="van-row--flex mb-2">
        <van-image :src="post.authorAvatar"
                   width="48"
                   height="48"
                   round class="mr-3"></van-image>
        <div class='author-box mb-2' :style="{ 'background-color': isNightStyle ?
                  'rgb(246, 155, 10)' : 'rgb(17, 167, 226)'}">
          {{ post.author }}</div>
      </div>
      <van-row  class="title-font-size" style="margin: 30px">{{ post.title }}</van-row>
      <van-row class="content-font-size">{{ post.content }}</van-row>
      <div v-if="fileListGet.length > 0" class="photo-viewer">
        <div class="thumbnail-container">
          <template v-if="fileListGet.length === 4">
            <div>
              <img :src="fileListGet[0]"
                  width="100px"
                  height="100px"
                  @click="handlePictureCardPreview(0)"
                  @keyup.enter="handlePictureCardPreview(0)"
                   @loadeddata="handlePictureCardPreview(0)"
                  alt="Post Photo" preview-text="Post Photo"
                  preview="1"/>
              <img :src="fileListGet[1]"
                  width="100px"
                  height="100px"
                  style="margin-top:20px"
                  @click="handlePictureCardPreview(1)"
                  @keyup.enter="handlePictureCardPreview(1)"
                  @loadeddata="handlePictureCardPreview(1)"
                   alt="Post Photo"
                  preview/>
            </div>
            <div>
              <img :src="fileListGet[2]"
                  width="100px"
                  height="100px"
                  @click="handlePictureCardPreview(2)"
                  @keyup.enter="handlePictureCardPreview(2)"
                   @loadeddata="handlePictureCardPreview(2)"
                  alt="Post Photo"
                  preview/>
              <img :src="fileListGet[3]"
                  width="100px"
                  height="100px"
                  style="margin-top:20px"
                  @click="handlePictureCardPreview(3)"
                  @keyup.enter="handlePictureCardPreview(3)"
                   @loadeddata="handlePictureCardPreview(3)"
                  alt="Post Photo" preview/>
            </div>
          </template>
          <template v-else>
            <div v-for="(file, index) in fileListGet" :key="index">
              <img :src="file"
                  width="100px"
                  height="100px"
                  @click="handlePictureCardPreview(index)"
                  @keyup.enter="handlePictureCardPreview(index)"
                   @loadeddata="handlePictureCardPreview(index)"
                  alt="Post Photo" preview/>
            </div>
          </template>
        </div>
      </div>
      <div class="d-flex justify-content-between">
        <small class="text-muted">{{ formatDate(post.postTime) }}</small>
      </div>
      <div class='van-row--flex mt-3'>
        <div class="text-muted">
          <van-icon :name="post.isLiked ? 'like' : 'like-o'" :color="post.isLiked ? '#ee0a24' : ''"
          @click.stop="like()" :class="{ 'text-danger': post.isLiked }"></van-icon>
          {{ post.like }}
        </div>
        <div class="text-muted">
              <van-icon name="eye-o"></van-icon> {{ post.browse }}
        </div>
        <div class='text-muted'><van-icon name='comment-o'></van-icon> {{ commentsNum }}</div>
      </div>
    </van-cell>
    <van-button @click="post.showCommentForm
            = !post.showCommentForm" type="primary">
      {{ post.showCommentForm ? '隐藏评论' : '评论' }}
    </van-button>
  <!--显示帖子评论窗口-->
  <div v-if="post.showCommentForm" style="margin-top:10px">
        <div>
          <van-field v-model="pcomment.content"
          placeholder="请写下你的精彩评论..." rows="3">
          </van-field>
        </div>
        <div>
          <van-button  type='primary' @click="showEmojiStatus()">😀</van-button>
            <div v-if="showEmoji">
              <picker
                :include="['people']"
                :showSearch="false"
                :showPreview="false"
                :showCategories="false"
                @select="addEmojiToPcomment"
              />
            </div>
        </div>
        <b-button @click="pcommentPost" type="primary">提交评论</b-button>
    </div>
  </div>
  </div>

</template>

<script>

import { mapState, mapActions } from 'vuex';
import { len } from 'vuelidate/lib/validators/common';
import { Picker } from 'emoji-mart-vue';

export default {
  components: {
    Picker,
  },
  computed: {
    // 计算属性，根据当前展示的评论数和每次展示的评论数量，返回可见的评论
    visibleComments() {
      if (this.allComments === true) {
        return this.comments;
      }
      return this.comments.slice(0, 10);
    },
    fileListGet() {
      console.log(this.post.photos.split('|'));
      if (this.post.photos === '') return [];
      return this.post.photos.split('|');
    },
    ...mapState({
      userInfo: (state) => state.userModule.userInfo,
    }),
    commentsNum() {
      let num = len(this.comments);
      for (let i = 0; i < this.comments.length; i += 1) {
        const comment = this.comments[i];
        num += len(comment.subComments);
      }
      return num;
    },
    isNightStyle() {
      if (JSON.parse(localStorage.getItem('Style')) === 'night') {
        return true;
      }
      return false;
    },
  },
  mounted() {
    // 获取当前评论ID
    this.currentPcommentID = this.$route.query.pcommentID;
    this.currentCcommentID = this.$route.query.ccommentID;
  },
  data() {
    return {
      // currentPcommentID和currentCcommentID是用来进行通知的跳转
      currentPcommentID: 0,
      currentCcommentID: 0,
      before: '',
      sortkind: 'Date',
      allComments: false,
      userTelephone: '',
      partition: '',
      showDeleteModal: false,
      showReportModal: false,
      showccmenu: false,
      reportReason: '',
      fileList: [],
      dialogVisible: false,
      post: {
        postID: 0,
        author: '',
        authorTelephone: '',
        title: '',
        content: '',
        like: '',
        comment: '',
        postTime: '',
        isSaved: '',
        isLiked: '',
        showMenu: '',
        showCommentForm: '',
        photos: '',
        browse: '',
      },
      comments: [],
      pcomment: {
        userTelephone: '',
        postID: '',
        content: '',
      },
      ccomment: {
        userTelephone: '',
        postID: 0,
        pcommentID: 0,
        content: '',
        userTargetName: '',
        ccommentID: 0,
      },
      // 用来记录是否悬停在子评论上
      isHovered: false,
      nowSubIndex: 0,
      nowIndex: 0,
      replyshow: false,
      // 用来修复发表评论后页面的跳转问题（尚未修复）
      showcommentsindex: 0, // 当先评论的回复所对应的帖子评论
      nowReplyComment: -1, // 当前想要回复的评论的评论
      showRepliesModal: false, // 显示窗口
      showEmoji: false,
    };
  },

  created() {
    if (typeof localStorage !== 'undefined') {
      if (!localStorage.getItem('Style')) {
        localStorage.setItem('Style', JSON.stringify('day'));
      }
    }
    if (this.$route.query.before) {
      this.before = this.$route.query.before;
      // 将postID保存在本地缓存中
      localStorage.setItem('Before', JSON.stringify(this.$route.query.before));
    } else {
      // 在本地缓存在直接读取postID
      this.before = JSON.parse(localStorage.getItem('Before'));
    }
    if (this.$route.query.id) {
      this.post.postID = parseInt(this.$route.query.id, 10);
      // 将postID保存在本地缓存中
      localStorage.setItem('PostID', JSON.stringify(this.$route.query.id));
    } else {
      // 在本地缓存在直接读取postID
      this.post.postID = JSON.parse(localStorage.getItem('PostID'));
    }
    if (this.$route.query.partition) {
      this.partition = this.$route.query.partition;
      // 将partition保存在本地缓存中
      localStorage.setItem('Partition', JSON.stringify(this.$route.query.partition));
    } else {
      // 在本地缓存在直接读取postID
      this.partition = JSON.parse(localStorage.getItem('Partition'));
    }
    this.userTelephone = this.userInfo.phone;
    // 根据该id向后端发送请求，获取该帖子的详细信息，并展示在页面上
    this.postShowDetails({ userTelephone: this.userTelephone, postID: this.post.postID })
      .then((post) => {
        this.post.postID = post.data.PostID;
        this.post.author = post.data.UserName;
        this.post.authorTelephone = post.data.UserTelephone;
        this.post.authorAvatar = post.data.UserAvatar;
        this.post.title = post.data.Title;
        this.post.content = post.data.Content;
        this.post.like = post.data.Like;
        this.post.comment = post.data.Comment;
        this.post.postTime = post.data.PostTime;
        this.post.isSaved = post.data.IsSaved;
        this.post.isLiked = post.data.IsLiked;
        this.post.showMenu = false;
        this.post.photos = post.data.Photos;
        this.post.browse = post.data.Browse;
      })
      .catch((err) => {
        console.error(err);
      });
    this.pcommentsShow();
    // 这里或许有比setTimeout更好的写法，但是暂时写不出来，
    // 所以先用setTimeout的方法来确保pcommentsShow执行完成之后再执行this.scrollToComment()
    setTimeout(() => {
      this.scrollToComment();
    }, 500);
  },
  beforeRouteLeave(to, from, next) {
    // 返回上一页面时清空本地缓存
    localStorage.removeItem('PostID');
    localStorage.removeItem('Before');
    next();
  },
  methods: {
    scrollToComment() {
      console.log('scrollToComment');
      // 获取当前评论所在的元素
      let commentEl = document.getElementById(`comment-${this.currentPcommentID}`);
      console.log(commentEl);
      // const commentRef = this.$refs.commentRef[3];
      // if (commentRef) {
      //   commentRef.setAttribute('tabindex', '-1');
      //   commentRef.scrollIntoView({ behavior: 'smooth', duration: 500 });
      // }
      if (commentEl === null) {
        this.allComments = true;
        const get = new Promise((resolve, reject) => {
          setTimeout(() => {
            commentEl = document.getElementById(`comment-${this.currentPcommentID}`);
            if (commentEl) resolve(commentEl);
            else reject(commentEl);
          });
        });
        get.then(() => {
          // 使用vue-scrollto插件平滑滚动到元素所在位置
          this.$scrollTo(commentEl, {
            duration: 750, // 滚动动画持续时间，单位为毫秒
            offset: -150, // 滚动偏移量，用于调整滚动位置
          });
          commentEl.classList.add('blink');
          setTimeout(() => {
            commentEl.classList.remove('blink');
          }, 10000);
          if (this.currentCcommentID) {
            const parentEl = commentEl.parentNode;
            this.showcommentsindex = Array.prototype.indexOf.call(parentEl.children, commentEl);
            this.showRepliesModal = true;
            setTimeout(() => {
              let childEl = document.getElementById(`ccomment-${this.currentCcommentID}`);
              console.log(childEl, this.currentCcommentID);
              if (childEl === null) {
                this.showAllReplies(this.showcommentsindex);
                setTimeout(() => {
                  childEl = document.getElementById(`ccomment-${this.currentCcommentID}`);
                });
              }
              if (childEl) {
                // 使用vue-scrollto插件平滑滚动到元素所在位置
                childEl.focus();
                childEl.classList.add('blink');
                setTimeout(() => {
                  childEl.classList.remove('blink');
                }, 10000);
              }
            }, 500);
          }
        }).catch((err) => {
          console.log(err);
        });
      } else {
        // 使用vue-scrollto插件平滑滚动到元素所在位置
        this.$scrollTo(commentEl, {
          duration: 750, // 滚动动画持续时间，单位为毫秒
          offset: -150, // 滚动偏移量，用于调整滚动位置
        });
        commentEl.classList.add('blink');
        setTimeout(() => {
          commentEl.classList.remove('blink');
        }, 10000);
        if (this.currentCcommentID) {
          const parentEl = commentEl.parentNode;
          this.showcommentsindex = Array.prototype.indexOf.call(parentEl.children, commentEl);
          this.showRepliesModal = true;
          setTimeout(() => {
            let childEl = document.getElementById(`ccomment-${this.currentCcommentID}`);
            console.log(childEl, this.currentCcommentID);
            if (childEl === null) {
              this.showAllReplies(this.showcommentsindex);
              const get = new Promise((resolve, reject) => {
                setTimeout(() => {
                  childEl = document.getElementById(`ccomment-${this.currentCcommentID}`);
                  if (childEl) resolve();
                  else reject();
                });
              });
              get.then(() => {
                childEl.focus();
                childEl.classList.add('blink');
                setTimeout(() => {
                  childEl.classList.remove('blink');
                }, 10000);
              }).catch((error) => {
                console.log(error);
              });
            }
          });
        }
      }
    },
    handlePictureCardPreview(index) {
      console.log(index);
      this.$previewRefresh();
    },
    len,
    ...mapActions('postModule', { postShowDetails: 'showDetails' }),
    ...mapActions('postModule', { postLike: 'like' }),
    ...mapActions('userModule', { postSave: 'save' }),
    ...mapActions('postModule', { deletepost: 'deletepost' }),
    ...mapActions('postModule', { submitreport: 'submitreport' }),
    ...mapActions('commentModule', { showPcomments: 'showPcomments' }),
    ...mapActions('commentModule', { deletePcomment: 'deletePcomment' }),
    ...mapActions('commentModule', { deleteCcomment: 'deleteCcomment' }),
    ...mapActions('commentModule', { postPcomment: 'postPcomment' }),
    ...mapActions('commentModule', { postCcomment: 'postCcomment' }),
    ...mapActions('commentModule', { pcommentlike: 'pcommentLike' }),
    ...mapActions('commentModule', { ccommentlike: 'ccommentLike' }),
    showAllReplies(index) {
      // 将评论的所有子评论都显示出来
      this.comments[index].showAllReplies = !this.comments[index].showAllReplies;
    },
    showAllComments() {
      this.allComments = !this.allComments;// 将帖子所有评论都展示出来
    },
    goback() {
      console.log(this.before);
      if (this.before === 'home') {
        this.$router.replace({ name: 'home', query: { partitions: this.partition } });
      } else if (this.before === 'save') {
        this.$router.replace({ name: 'save' });
      } else if (this.before === 'history') {
        this.$router.replace({ name: 'history' });
      } else if (this.before === 'notice') {
        this.$router.replace({ name: 'notice' });
      }
    },
    toggleMenu() {
      this.post.showMenu = !this.post.showMenu;
    },
    formatDate(date) {
      // 格式化日期时间
      const d = new Date(date);
      return `${d.getFullYear()}年${
        d.getMonth() + 1
      }月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    },
    save() {
      const userTelephone = this.userInfo.phone;
      // 请求
      this.postSave({
        userTelephone, postID: this.post.postID, isSaved: this.post.isSaved,
      }).then(() => {
      }).catch((err) => {
        console.error(err);
      });
      // 更新点赞状态及点赞数
      this.post.isSaved = !this.post.isSaved;
    },
    like() {
      const userTelephone = this.userInfo.phone;
      // 请求
      this.postLike({
        userTelephone, postID: this.post.postID, isLiked: this.post.isLiked,
      }).then(() => {
      }).catch((err) => {
        console.error(err);
      });
      // 更新点赞状态及点赞数
      this.post.isLiked = !this.post.isLiked;
      if (this.post.isLiked) this.post.like += 1;
      else this.post.like -= 1;
    },
    pclike(index) {
      this.pcommentlike({
        userTelephone: this.userTelephone,
        pcommentID: this.comments[index].pcommentID,
        isLiked: this.comments[index].isLiked,
      }).then(() => {
      }).catch((err) => {
        console.error(err);
      });
      // 更新点赞状态及点赞数
      this.comments[index].isLiked = !this.comments[index].isLiked;
      if (this.comments[index].isLiked) this.comments[index].likeNum += 1;
      else this.comments[index].likeNum -= 1;
    },
    cclike(index, subIndex) {
      this.ccommentlike({
        userTelephone: this.userTelephone,
        ccommentID: this.comments[index].subComments[subIndex].ccommentID,
        isLiked: this.comments[index].subComments[subIndex].isLiked,
      }).then(() => {
      }).catch((err) => {
        console.error(err);
      });
      // 更新点赞状态及点赞数
      // eslint-disable-next-line max-len
      this.comments[index].subComments[subIndex].isLiked = !this.comments[index].subComments[subIndex].isLiked;
      // eslint-disable-next-line max-len
      if (this.comments[index].subComments[subIndex].isLiked) this.comments[index].subComments[subIndex].likeNum += 1;
      else this.comments[index].subComments[subIndex].likeNum -= 1;
    },
    postdelete() {
      this.deletepost({
        postID: this.post.postID,
      }).then(() => {
        this.$bvToast.toast('删除成功', {
          title: '系统提醒',
          variant: 'primary',
          solid: true,
        });
        this.$router.go(-1);
      }).catch((err) => {
        console.error(err);
      });
    },
    pcommentdelete(comment) {
      this.deletePcomment({
        pcommentID: comment.pcommentID,
      }).then(() => {
        this.$bvToast.toast('删除成功', {
          title: '系统提醒',
          variant: 'primary',
          solid: true,
        });
        this.$router.go(0);
      }).catch((err) => {
        console.error(err);
      });
    },
    ccommentdelete(SubComment) {
      this.deleteCcomment({
        ccommentID: SubComment.ccommentID,
      }).then(() => {
        this.$bvToast.toast('删除成功', {
          title: '系统提醒',
          variant: 'primary',
          solid: true,
        });
        this.$router.go(0);
      }).catch((err) => {
        console.error(err);
      });
    },
    submitReport(type, idnum) {
      this.submitreport({
        TargetID: idnum,
        Targettype: type,
        userTelephone: this.userInfo.phone,
        Reason: this.reportReason,
      }).then(() => {
        this.$bvToast.toast('举报发送成功', {
          title: '系统提醒',
          variant: 'primary',
          solid: true,
        });
      }).catch((err) => {
        this.$bvToast.toast(err.response.data.msg, {
          title: '数据验证错误',
          variant: 'danger',
          solid: true,
        });
      });
    },
    clearReportReason() {
      this.reportReason = '';
    },
    async pcommentsShow() {
      const postid = this.post.postID;
      // 请求
      try {
        const { data } = await this.showPcomments({
          userTelephone: this.userTelephone, postID: postid,
        });
        const comments = data.map((pcomment) => ({
          pcommentID: pcomment.PcommentID,
          author: pcomment.Author,
          authorAvatar: pcomment.AuthorAvatar,
          authorTelephone: pcomment.AuthorTelephone,
          commentTime: pcomment.CommentTime,
          content: pcomment.Content,
          likeNum: pcomment.LikeNum,
          subComments: pcomment.SubComments,
          isLiked: pcomment.IsLiked,
          showMenu: false,
          showReplyForm: false,
          showAllReplies: false,
          heat: pcomment.LikeNum + len(pcomment.SubComments),
        }));
        this.comments = this.sortcomments(comments);
        // .sort((a, b) => new Date(b.commentTime) - new Date(a.commentTime))
        // this.comments = data;
      } catch (err) {
        console.error(err);
      }
    },
    sortcomments(comments) {
      if (this.sortkind === 'Date') {
        return comments.sort((a, b) => new Date(b.commentTime) - new Date(a.commentTime));
      }
      return comments.sort((a, b) => b.heat - a.heat);
    },
    // 发表帖子评论
    pcommentPost() {
      this.pcomment.postID = this.post.postID;
      this.pcomment.userTelephone = this.userTelephone;
      this.postPcomment(this.pcomment).then(() => {
        this.$bvToast.toast('评论成功', {
          title: '系统提醒',
          variant: 'primary',
          solid: true,
        });
        setTimeout(() => {
          this.pcommentsShow();
          this.pcomment.content = '';
        }, 1000);
      })
        .catch((err) => {
          this.$bvToast.toast(err.response.data.msg, {
            title: '评论失败',
            variant: 'danger',
            solid: true,
          });
        });
    },
    // 发表评论的评论或者回复评论的评论
    ccommentPost(index, author, ccommentID) {
      const comment = this.comments[index];
      this.ccomment.postID = this.post.postID;
      this.ccomment.pcommentID = comment.pcommentID;
      this.ccomment.userTelephone = this.userTelephone;
      this.ccomment.userTargetName = author;
      this.ccomment.ccommentID = ccommentID;
      this.postCcomment(this.ccomment).then(() => {
        this.$bvToast.toast('回复成功', {
          title: '系统提醒',
          variant: 'primary',
          solid: true,
        });
        setTimeout(() => {
          this.showcommentsindex = 0;
          this.nowReplyComment = '';
          this.replyshow = false;
          this.pcommentsShow();
          // 清空输入的内容
          this.ccomment.content = '';
          this.ccomment.ccommentID = 0;
        }, 1000);
      })
        .catch((err) => {
          this.$bvToast.toast(err.response.data.msg, {
            title: '回复失败',
            variant: 'danger',
            solid: true,
          });
        });
    },
    visibleSubComments(index) {
      if (this.comments[index].showAllReplies === true) {
        return this.comments[index].subComments;
      }
      return this.comments[index].subComments.slice(0, 5);
    },
    addEmojiToPcomment(emoji) {
      this.pcomment.content += emoji.native;
    },
    addEmojiToCcomment(emoji) {
      this.ccomment.content += emoji.native;
    },
    showEmojiStatus() {
      this.showEmoji = !this.showEmoji;
    },
  },
};
</script>

<style lass="scss" scoped>
@import '@/style/css/PostDetailsView.css';
#div_boxs_lnteado /deep/ .van-nav-bar__title {
  color: white;
  font-size: 0.45rem;
}
.thumbnail-container {
  display: flex;
  flex-wrap: wrap;
}
.thumbnail-container div {
  width: calc(100% / 3);
  padding: 10px;
  box-sizing: border-box;
}
@keyframes blink {
  0% {
    opacity: 1;
    background-color: transparent;
  }
  50% {
    opacity: 0.5;
    background-color: gray;
  }
  100% {
    opacity: 1;
    background-color: transparent;
  }
}
/* 使用更具体的选择器 */
.blink {
  animation-name: blink;
  animation-duration: 1.0s;
  animation-iteration-count: 3;
  background-color: transparent !important; /* 覆盖框架中的样式 */
}
.emoji-mart[data-v-7bc71df8] {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  height: 300px;
  color: #ffffff !important;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  background: #fff;
}
</style>
