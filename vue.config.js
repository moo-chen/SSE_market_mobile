const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
});
// 192.168.47.129

module.exports = {
  devServer: {
    host: '192.168.159.1',
    port: 8081,
  },
};
