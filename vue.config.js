const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
});
// 192.168.47.129

module.exports = {
  devServer: {
    host: '172.17.3.10',
    port: 8081,
  },
  configureWebpack: {
    module: {
      rules: [
        // ...其他加载器配置
        {
          test: /\.txt$/,
          use: 'raw-loader',
        },
      ],
    },
  },
};
