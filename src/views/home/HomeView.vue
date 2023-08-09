// 此页面都是测试时乱写的
<template>
  <div>
    <h2>SSE_market</h2>
    <div class="banner"></div>
    <div class="list">
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style scoped>
.banner{
  width: 750px;
  height: 304px;
  background: pink;
}
.list {
  padding: 20px;
  display: flex;
  justify-content: space-around;
}
.list .item {
  width: 136px;
  height: 138px;
  background: skyblue;
}
</style>
