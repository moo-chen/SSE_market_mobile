<!-- eslint-disable max-len -->
<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<!-- eslint-disable vuejs-accessibility/alt-text -->
<template>
  <div margin='0'>
    <van-nav-bar
      title="历史记录"
      left-text="返回"
      left-arrow
      @click-left="$router.push({name:'profile'})"
      fixed
      placeholder
      safe-area-inset-top
    />
    <div>
      <van-list
        v-for='post in posts'
        style='margin: 5px;box-shadow: 0 0 1px rgb(0,0,0,0.2);'
        :key='post.postID'
        :border='true'
        fit='cover'
        position='left'
        inset
        ref='totalGroup'
        @load="loadMorePosts"
      >
        <p v-html='line' @click='showDetail(post)'></p>
        <van-row justify='center' @click='showDetail(post)'>
          <div class="van-row--flex">
            <van-image :src="post.authorAvatar"
                       width="48"
                       height="48"
                       round class="mr-3"></van-image>
            <van-col>
              <div style='margin-top: 10px;margin-left: 5px;' class='username-container'>
                <span style='margin-top: 10px;' class='username'>{{ post.author }}</span>
              </div>
            </van-col>
          </div>
        </van-row>
        <van-row @click='showDetail(post)'>
          <van-row class="post_title">{{ post.title }}
          </van-row>
          <van-row class="post_content"
                   style="margin-bottom: 10px">
            {{ post.content }}
          </van-row>
        <div v-if="fileListGet(post).length > 0" class="photo-viewer van-row" style="margin-right: 20px">
          <div class="thumbnail-container">
            <template v-if="fileListGet(post).length === 4">
              <div>
                <img :src="fileListGet(post)[0]"
                     class="photo"
                     @click="handlePictureCardPreview(0)"
                     @keyup.enter="handlePictureCardPreview(0)"
                     @loadeddata="handlePictureCardPreview(0)"
                     alt="Post Photo" preview-text="Post Photo"
                     preview="1"/>
                <img :src="fileListGet(post)[1]"
                     class="photo"
                     style="margin-top:10px"
                     @click="handlePictureCardPreview(1)"
                     @keyup.enter="handlePictureCardPreview(1)"
                     @loadeddata="handlePictureCardPreview(1)"
                     alt="Post Photo"
                     preview/>
              </div>
              <div>
                <img :src="fileListGet(post)[2]"
                     class="photo"
                     @click="handlePictureCardPreview(2)"
                     @keyup.enter="handlePictureCardPreview(2)"
                     @loadeddata="handlePictureCardPreview(2)"
                     alt="Post Photo"
                     preview/>
                <img :src="fileListGet(post)[3]"
                     class="photo"
                     style="margin-top:10px"
                     @click="handlePictureCardPreview(3)"
                     @keyup.enter="handlePictureCardPreview(3)"
                     @loadeddata="handlePictureCardPreview(3)"
                     alt="Post Photo" preview/>
              </div>
            </template>
            <template v-else>
              <div v-for="(file, index) in fileListGet(post)" :key="index">
                <img :src="file"
                     class="photo"
                     @click="handlePictureCardPreview(index)"
                     @keyup.enter="handlePictureCardPreview(index)"
                     @loadeddata="handlePictureCardPreview(index)"
                     alt="Post Photo" preview/>
              </div>
            </template>
          </div>
        </div>
          <van-col span='24'>
            <van-cell :border='false' class='date'>
              <span style="font-size: x-small; ">
                {{ formatDate(post.postTime) }}
              </span>
            </van-cell>
            <div class="tag-group">
                <span class="tag-group__title"></span>
                <van-tag v-for="tag in post.tag" :key="tag.label" :type="tag.type"
                        effect="plain" size="mini">{{ tag.label }}
                </van-tag>
            </div>
          </van-col>
        </van-row>

        <van-row>
          <van-col span='6' style="margin-top:20px">
            <van-icon name='good-job-o' size='20' @click='like(post)' v-if='!post.isLiked' />
            <van-icon v-else color='red' name='good-job' size='20' @click='like(post)' />
            <span style="font-size: xx-small; ">
              {{ post.like }}
            </span>
          </van-col>

          <van-col span='6' @click='showDetail(post)' style="margin-top:20px">
            <van-icon name='eye-o' size='20' />
            <font size='1'>
              {{ post.browse }}
            </font>
          </van-col>

          <van-col span='6' @click='showDetail(post)' style="margin-top:20px">
            <van-icon name='chat-o' size='20' />
            <font size='1'>
              {{ post.comment }}
            </font>
          </van-col>

          <van-col span='6' style="margin-top:20px">
            <van-icon name='star-o' size='20' @click='save(post)' v-if='!post.isSaved' />
            <van-icon v-else color='rgb(255,220,0)' name='star' size='20' @click='save(post)' />
          </van-col>
        </van-row>
      </van-list>
      <van-row>
        <van-col offset='8' span='8' class='tips'>
          <van-cell
            :center='true'
            class='notice'
            v-if='this.currentPage * this.pageSize >= this.totalItems'
          >
            已划到底部
          </van-cell>
          <van-cell class='loading' v-else-if='loading'> 正在加载... </van-cell>
          <van-button v-else :border='false' block @click='loadMorePosts'> 加载更多 </van-button>
        </van-col>
        <p v-html='line'></p>
        <p v-html='line'></p>
        <p v-html='line'></p>
      </van-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      partition: '',
      totalItems: 0,
      pageSize: 5,
      currentPage: 1,
      posts: [],
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      userTelephone: '',
      postID: '',
      isSaved: '',
      isLiked: '',
      title: '',
      heat: '',
      browse: '',
      searchinfo: '',
      showDeleteModal: false,
      showReportModal: false,
      reportReason: '',
      toLogin: false,
      loading: false,
      line: '<br/>',
      cards: [
        {
          title: '日常吐槽',
          icon: 'smile',
        },
        {
          title: '打听求助',
          icon: 'question',
        },
        {
          title: '二手闲置',
          icon: 'gift',
        },
        {
          title: '恋爱交友',
          icon: 'like',
        },
        {
          title: '学习交流',
          icon: 'todo-list',
        },
        {
          title: '其他',
          icon: 'more',
        },
      ],
    };
  },
  created() {
    this.PostNum();
    this.partitionBrowse('');
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userModule.userInfo,
    }),
    tagTypeMap() {
      return {
        大厂: 'primary',
        高工资: 'success',
        实习: 'danger',
      };
    },
    fileListGet() {
      return (post) => {
        if (!post.photos || post.photos === '') return [];
        // console.error(post.photos.split('|'));
        return post.photos.split('|');
      };
    },
  },
  methods: {
    ...mapActions('postModule', { postBrowse: 'browse' }),
    ...mapActions('postModule', { getPostNum: 'getPostNum' }),
    ...mapActions('postModule', { postLike: 'like' }),
    ...mapActions('postModule', { updateLook: 'updatebrowse' }),
    ...mapActions('userModule', { postSave: 'save' }),

    goToPost() {
      this.$router.push({ path: '/post' });
    },

    showDetail(post) {
      console.error(post);
      this.updateLook({
        userTelephone: this.userInfo.phone,
        postID: post.id,
      })
        .then(() => {
          this.browse += 1;
        })
        .catch((err) => {
          console.error(err);
        });
      const routeLink = this.$router.resolve({
        name: 'postDetails',
        params: { partition: this.partition },
        query: {
          id: post.id, title: post.title, before: this.$route.name, partition: this.partition,
        },
      });
      window.open(routeLink.href, '_blank');
      // this.$router.push({
      //   name: 'postDetails',
      //   params: { id: post.id, partition: this.partition, before: 'home' },
      //   query: { id: post.id, before: 'home' },
      // });
    },
    // 查询满足要求的帖子数量
    async PostNum() {
      try {
        if (this.userInfo) {
          this.userTelephone = this.userInfo.phone;
        } else {
          // 游客访问
          this.userTelephone = '00000000000';
        }
        const { data } = await this.getPostNum({
          userTelephone: this.userTelephone,
          partition: this.partition,
          searchinfo: this.searchinfo,
          searchsort: 'history',
        });
        this.totalItems = data.Postcount;
      } catch (error) {
        console.error(error);
      }
    },
    async partitionBrowse(chosenPartition) {
      this.partition = chosenPartition;
      try {
        // 向后端发送请求并获取帖子列表
        const { data } = await this.postBrowse({
          userTelephone: this.userInfo.phone,
          partition: this.partition,
          searchinfo: this.searchinfo,
          searchsort: 'history',
          limit: this.pageSize,
          offset: (this.currentPage - 1) * this.pageSize,
        });
        // 将获取到的帖子列表数据赋值给 posts 变量
        this.posts = data
          .map((post) => ({
            id: post.PostID,
            author: post.UserName,
            authorTelephone: post.UserTelephone,
            authorAvatar: post.UserAvatar,
            title: post.Title,
            content: post.Content,
            like: post.Like,
            comment: post.Comment,
            postTime: post.PostTime,
            isSaved: post.IsSaved,
            isLiked: post.IsLiked,
            browse: post.Browse,
            heat: post.Heat,
            photos: post.Photos,
            tag: post.Tag
              ? post.Tag.split(',').map((tagText) => ({
                type: this.tagTypeMap[tagText.trim()], // 使用 this.tagTypeMap
                label: tagText.trim(),
              }))
              : [],
            showMenu: false,
          }))
          .sort((a, b) => new Date(b.postTime) - new Date(a.postTime));
      } catch (error) {
        console.error(error);
      }
    },

    handleScroll() {
      this.$nextTick(() => {
        const listGroup = this.$refs.totalGroup.$el;
        if (listGroup.getBoundingClientRect().bottom <= window.innerHeight) {
          this.loadMorePosts();
        }
      });
    },

    async loadMorePosts() {
      if (this.currentPage * this.pageSize >= this.totalItems) return;
      // window.removeEventListener('scroll', this.handleScroll);
      this.loading = true;
      // setTimeout(() => {
      this.currentPage += 1;
      // }, 500);
      console.log(this.currentPage);
      // window.addEventListener('scroll', this.handleScroll);
      // 下面再请求一次数据,加到原来的posts上
      try {
        const { data } = await this.postBrowse({
          userTelephone: this.userTelephone,
          partition: this.partition,
          searchinfo: this.searchinfo,
          searchsort: 'home',
          limit: this.pageSize,
          offset: (this.currentPage - 1) * this.pageSize,
        });
        if (data == null) return;
        const newPosts = data
          .map((post) => ({
            id: post.PostID,
            author: post.UserName,
            authorTelephone: post.UserTelephone,
            authorAvatar: post.UserAvatar,
            title: post.Title,
            content: post.Content,
            like: post.Like,
            comment: post.Comment,
            postTime: post.PostTime,
            isSaved: post.IsSaved,
            isLiked: post.IsLiked,
            browse: post.Browse,
            heat: post.Heat,
            photos: post.Photos,
            tag: post.Tag
              ? post.Tag.split(',')
                .map((tagText) => ({
                  type: this.tagTypeMap[tagText.trim()], // 使用 this.tagTypeMap
                  label: tagText.trim(),
                }))
              : [],
            showMenu: false,
          }))
          .sort((a, b) => new Date(b.postTime) - new Date(a.postTime));
        this.posts.push(...newPosts); // 将新的帖子列表合并到原有的 posts 数组中
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    formatDate(date) {
      // 格式化日期时间
      const d = new Date(date);
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${String(
        d.getHours(),
      ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(
        d.getSeconds(),
      ).padStart(2, '0')}`;
    },

    like(post) {
      console.error(this.userInfo);
      const updatedPost = { ...post, isLiked: !post.isLiked };
      updatedPost.like += post.isLiked ? -1 : 1;
      // 用更新后的 post 对象替换原先的 post 对象
      this.posts.splice(this.posts.indexOf(post), 1, updatedPost);
      this.userTelephone = this.userInfo.phone;
      this.postID = post.id;
      this.isLiked = post.isLiked;
      // 请求
      this.postLike({
        userTelephone: this.userTelephone,
        postID: this.postID,
        isLiked: this.isLiked,
      })
        .then(() => {})
        .catch((err) => {
          console.error(err);
        });
    },

    save(post) {
      // 切换收藏状态
      const updatedPost = { ...post, isSaved: !post.isSaved };
      // 用更新后的 post 对象替换原先的 post 对象
      this.posts.splice(this.posts.indexOf(post), 1, updatedPost);
      this.userTelephone = this.userInfo.phone;
      this.postID = post.id;
      this.isSaved = post.isSaved;
      // 请求
      this.postSave({
        userTelephone: this.userTelephone,
        postID: this.postID,
        isSaved: this.isSaved,
      })
        .then(() => {})
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style scoped>
@import '@/style/css/PostList.css';
</style>
