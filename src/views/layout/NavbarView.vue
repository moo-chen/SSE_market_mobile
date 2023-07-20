<template>
  <div>
    <van-tabbar route>
      <van-tabbar-item
        replace to="/"
        :class="{ active: $route.path === '/' }"
        :icon="getIcon('wap-home-o', 'wap-home', '/')"
        >首页</van-tabbar-item
      >
      <van-tabbar-item
        replace to="/welcome"
        :class="{ active: $route.path === '/welcome' }"
        :icon="getIcon('point-gift-o', 'point-gift', '/welcome')"
        >迎新</van-tabbar-item
      >
      <van-tabbar-item
        replace to="/discover"
        :class="{ active: $route.path === '/discover' }"
        :icon="getIcon('search', 'search', '/discover')"
        >发现</van-tabbar-item
      >
      <van-tabbar-item
        replace to="/message"
        :class="{ active: $route.path === '/message' }"
        :icon="getIcon('chat-o', 'chat', '/message')"
        >消息</van-tabbar-item
      >
      <van-tabbar-item
        replace to="/profile"
        :class="{ active: $route.path === '/profile' }"
        :icon="getIcon('manager-o', 'manager', '/profile')"
        >我的</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
export default {
  methods: {
    getIcon(normalIcon, activeIcon, routePath) {
      return this.$route.path === routePath ? activeIcon : normalIcon;
    },
  },
};
</script>

<style>
@import '../../style/css/NavbarView.css';
</style>
