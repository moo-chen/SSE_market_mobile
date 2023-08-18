const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
});
// 192.168.47.129

module.exports = {
  devServer: {
    host: '172.27.20.243',
    port: 8081,
  },
};
