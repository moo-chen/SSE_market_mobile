<template>
    <div>
    <van-search v-model="searchinfo" show-action
    placeholder="请输入搜索关键词" @search="onSearch">
    <template #action>
    <div @click="onSearch" @keydown.enter="onSearch" tabindex="0">搜索</div>
    </template>
    </van-search>
    </div>
</template>

<script>

export default {
  data() {
    return {
      searchinfo: '',
    };
  },
  methods: {
    onSearch() {
      this.$router.push({ name: 'home', query: { searchinfo: this.searchinfo } });
    //   this.$router.go(0);
    },
  },
};
</script>
