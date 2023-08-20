import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/HomeView.vue'),
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import('../views/welcome/WelcomeView.vue'),
  },
  {
    path: '/discover',
    name: 'discover',
    component: () => import('../views/discover/DiscoverView.vue'),
  },
  {
    path: '/notice',
    name: 'notice',
    component: () => import('../views/notice/NoticeView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/profile/ProfileView.vue'),
  },
  {
    path: '/logintest',
    name: 'logintest',
    component: () => import('../views/logintest/LoginTestView.vue'),
  },
  {
    path: '/postDetails',
    name: 'postDetails',
    meta: {
      auth: true,
    },
    component: () => import('../views/postDetails/PostDetailsView.vue'),
  },
  {
    path: '/post',
    name: 'post',
    component: () => import('../views/post/PostView.vue'),
  },
  {
    path: '/save',
    name: 'save',
    meta: {
      auth: true,
    },
    component: () => import('../views/save/SaveView.vue'),
  },
  {
    path: '/history',
    name: 'history',
    meta: {
      auth: true,
    },
    component: () => import('../views/history/HistoryView.vue'),
  },
  {
    path: '/feedback',
    name: 'feedback',
    meta: {
      auth: true,
    },
    component: () => import('../views/feedback/FeedbackView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/register/RegisterView.vue'),
  },
  {
    path: '/modifyPassword',
    name: 'modifyPassword',
    component: () => import('../views/modifyPassword/ModifyPasswordView.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
