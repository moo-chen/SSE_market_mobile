module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 75, // 设计稿宽度 / 10，假设设计稿宽度为750px
      propList: ['*'],
      selectorBlackList: [],
    },
  },
};
