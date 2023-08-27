<!-- eslint-disable max-len -->
<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<!-- eslint-disable vuejs-accessibility/alt-text -->
<template>
  <div style="margin-bottom: 115px">
    <div class='container'>
      <h2>SSE_market</h2>
      <div class='icon-container'>
        <van-icon size='27' name='add' @click='goToPost'/>
      </div>
      <div class='search-container'>
        <van-search
          v-model='searchinfo'
          show-action
          show-action-slot
          placeholder='搜索  支持标签和内容'
          @search='onSearch'
          shape='round'
        >
          <template #action>
            <div
              class='custom-search-button'
              @click='onSearch'
              @keydown.enter='onSearch'
              tabindex='0'
            >
              搜索
            </div>
          </template>
        </van-search>
      </div>
    </div>
    <div class='list'>
      <div
        class='item'
        v-for='(card, index) in cards'
        :key='index'
        @click='partitionBrowse(card.title)'
      >
        <!-- <van-icon
          :name='card.icon'
          color='white'
        /> -->
        <div>
          <svg class='icon' aria-hidden='true'>
            <use v-bind:xlink:href='getGoodsHref(card.icon)'></use>
          </svg>
        </div>

        <!-- <p v-html='line'></p> -->
        <div class='title'>
          {{ card.title }}
        </div>
      </div>
    </div>

    <div v-if="posts.length > 0" style="display: flex; flex-direction: column; gap: 2px;">
      <van-list
        v-for='post in posts'
        :key='post.postID'
        :border='true'
        style='margin: 5px;box-shadow: 0 0 1px rgb(0,0,0,0.2);'
        fit='cover'
        position='left'
        inset
        ref='totalGroup'
        @load="loadMorePosts"
      >
        <van-row @click='showDetail(post)'>
          <van-col span='24' class='avatar-username-row'>
            <div class='horizontal-container'>
              <div class='avatarContainer' style="margin-top:20px">
                <van-image
                  round
                  class="avatar"
                  fit='cover'
                  position='left'
                  :src='post.authorAvatar'
                ></van-image>
              </div>
              <div style='margin-top: 40px;margin-left: -5px;' class='username-container'>
                <div class='author_box'>
                  <span style='margin-top: 10px;' class='username'>{{ post.author }}</span>
                </div>
              </div>
            </div>
          </van-col>

          <van-col span='24' class='post-content-row' style="margin-top: -15px">
            <van-cell :border='false' class='post_title'>
              {{ post.title }}
            </van-cell>
          </van-col>

          <van-col span='24' class='post-content-row'>
            <van-cell :border='false' class='post_content' style="margin-top: -10px">
              {{ post.content }}
            </van-cell>
          </van-col>
          <div v-if="fileListGet(post).length > 0" class="photo-viewer van-row"
               style="margin-right: 20px">
            <div class="thumbnail-container">
              <template v-if="fileListGet(post).length === 4">
                <div>
                  <img :src="fileListGet(post)[0]"
                       class="photo"
                       @click="handlePictureCardPreview(fileListGet(post)[0])"
                       @keyup.enter="handlePictureCardPreview(fileListGet(post)[0])"
                       @loadeddata="handlePictureCardPreview(fileListGet(post)[0])"
                       alt="Post Photo"/>
                  <img :src="fileListGet(post)[1]"
                       class="photo"
                       style="margin-top:10px"
                       @click="handlePictureCardPreview(fileListGet(post)[1])"
                       @keyup.enter="handlePictureCardPreview(fileListGet(post)[1])"
                       @loadeddata="handlePictureCardPreview(fileListGet(post)[1])"
                       alt="Post Photo"/>
                </div>
                <div>
                  <img :src="fileListGet(post)[2]"
                       class="photo"
                       @click="handlePictureCardPreview(fileListGet(post)[2])"
                       @keyup.enter="handlePictureCardPreview(fileListGet(post)[2])"
                       @loadeddata="handlePictureCardPreview(fileListGet(post)[2])"
                       alt="Post Photo"/>
                  <img :src="fileListGet(post)[3]"
                       class="photo"
                       style="margin-top:10px"
                       @click="handlePictureCardPreview(fileListGet(post)[3])"
                       @keyup.enter="handlePictureCardPreview(fileListGet(post)[3])"
                       @loadeddata="handlePictureCardPreview(fileListGet(post)[3])"
                       alt="Post Photo"/>
                </div>
              </template>
              <template v-else>
                <div v-for="(file, index) in fileListGet(post)" :key="index">
                  <img :src="file"
                       class="photo"
                       @click="handlePictureCardPreview(file)"
                       @keyup.enter="handlePictureCardPreview(file)"
                       @loadeddata="handlePictureCardPreview(file)"
                       alt="Post Photo"/>
                </div>
              </template>
            </div>
          </div>
          <div style="font-size:small;float: left;margin-left: 15px;">
            <small class='text-muted'>{{ formatDate(post.postTime) }}</small>
          </div>
          <div class="tag-group">
            <span class="tag-group__title"></span>
            <van-tag v-for="tag in post.tag" :key="tag.label" :type="tag.type"
                     effect="plain" size="mini">{{ tag.label }}
            </van-tag>
          </div>
        </van-row>

        <van-row>
          <van-col span='6'>
            <van-icon name='good-job-o' size='20' @click='like(post)' v-if='!post.isLiked'/>
            <van-icon v-else color='red' name='good-job' size='20' @click='like(post)'/>
            <font size='1'>
              {{ post.like }}
            </font>
          </van-col>

          <van-col span='6' @click='showDetail(post)'>
            <van-icon name='eye-o' size='20'/>
            <font size='1'>
              {{ post.browse }}
            </font>
          </van-col>

          <van-col span='6' @click='showDetail(post)'>
            <van-icon name='chat-o' size='20'/>
            <font size='1'>
              {{ post.comment }}
            </font>
          </van-col>

          <van-col span='6'>
            <van-icon name='star-o' size='20' @click='save(post)' v-if='!post.isSaved'/>
            <van-icon v-else color='rgb(255,220,0)' name='star' size='20' @click='save(post)'/>
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
          <van-cell class='loading' v-else-if='loading'> 正在加载...</van-cell>
          <van-button v-else :border='false' block @click='loadMorePosts'> 加载更多</van-button>
        </van-col>
        <p v-html='line'></p>
        <p v-html='line'></p>
        <p v-html='line'></p>
      </van-row>
    </div>
    <div v-else>
      <van-empty description="没有符合要求的帖子哦"></van-empty>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { ImagePreview } from 'vant';

export default {
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
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
          title: '全部',
          icon: 'quanbu',
        },
        {
          title: '求职',
          icon: 'a-bianzu90',
        },
        {
          title: '日常吐槽',
          icon: 'pinglunqu',
        },
        {
          title: '打听求助',
          icon: 'wenhao',
        },
        {
          title: '二手闲置',
          icon: 'a-gouwugouwudai',
        },
        {
          title: '恋爱交友',
          icon: 'xin-qinglv',
        },
        {
          title: '学习交流',
          icon: 'wodexuexi',
        },
        {
          title: '其他',
          icon: 'qita',
        },
      ],
    };
  },
  created() {
    this.PostNum();
    if (this.$route.query.partition) this.partitionBrowse(this.$route.query.partition);
    else this.partitionBrowse('');
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
    getImage(url) {
      const replacedUrl = url.replace('resized', 'uploads');
      return replacedUrl;
    },
    getGoodsHref(iconName) {
      return `#icon-${iconName}`;
    },
    goToPost() {
      this.$router.push({ path: '/post' });
    },
    onSearch() {
      // 记得在进行切换加载操作的时候currentPage要恢复为1
      this.currentPage = 1;
      this.partitionBrowse('');
      this.searchinfo = '';
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
          id: post.id,
          title: post.title,
          before: this.$route.name,
          partition: this.partition,
        },
      });
      window.open(routeLink.href, '_blank');
      // this.$router.push({
      //   name: 'postDetails',
      //   params: {
      //     id: post.id,
      //     partition: this.partition,
      //     before: 'home',
      //   },
      //   query: {
      //     id: post.id,
      //     before: 'home',
      //   },
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
          searchsort: 'home',
        });
        this.totalItems = data.Postcount;
      } catch (error) {
        console.error(error);
      }
    },
    handlePictureCardPreview(url) {
      console.log(url);
      // 主页不显示略缩图
      // ImagePreview({
      //   images: [this.getImage(url)],
      //   closeable: true,
      // });
    },
    // 我担心这个分页加载会出问题，就是在返回了第一页之后如果有人发了新帖子
    // 经测试似乎没有明显的问题
    async partitionBrowse(chosenPartition) {
      // 如果分区并没有变化，那么不需要执行下面的东西
      if (this.partition === chosenPartition && this.currentPage > 1) return;
      if (chosenPartition === '全部') {
        this.partition = '';
      } else {
        this.partition = chosenPartition;
      }
      this.currentPage = 1; // 恢复页数
      try {
        // 向后端发送请求并获取帖子列表
        const { data } = await this.postBrowse({
          userTelephone: this.userTelephone,
          partition: this.partition,
          searchinfo: this.searchinfo,
          searchsort: 'home',
          limit: this.pageSize,
          offset: (this.currentPage - 1) * this.pageSize,
        });
        // 将获取到的帖子列表数据赋值给 posts 变量
        console.error(data);
        if (data && data.length > 0) {
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
                ? post.Tag.split(',')
                  .map((tagText) => ({
                    type: this.tagTypeMap[tagText.trim()], // 使用 this.tagTypeMap
                    label: tagText.trim(),
                  }))
                : [],
              showMenu: false,
            }))
            .sort((a, b) => new Date(b.postTime) - new Date(a.postTime));
          console.error(this.posts);
        } else {
          this.posts = [];
        }
      } catch (error) {
        console.error(error);
      }
    },

    // handleScroll() {
    //   this.$nextTick(() => {
    //     const listGroup = this.$refs.totalGroup.$el;
    //     if (listGroup.getBoundingClientRect().bottom <= window.innerHeight) {
    //       this.loadMorePosts();
    //     }
    //   });
    // },
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
      )
        .padStart(2, '0')}:${String(d.getMinutes())
        .padStart(2, '0')}:${String(
        d.getSeconds(),
      )
        .padStart(2, '0')}`;
    },

    like(post) {
      console.error(this.userInfo);
      const updatedPost = {
        ...post,
        isLiked: !post.isLiked,
      };
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
        .then(() => {
        })
        .catch((err) => {
          console.error(err);
        });
    },

    save(post) {
      // 切换收藏状态
      const updatedPost = {
        ...post,
        isSaved: !post.isSaved,
      };
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
        .then(() => {
        })
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
