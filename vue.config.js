const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        // 这里是你自己放公共样式的路径
        // __dirname 是当前文件的路径
        path.resolve(__dirname, './src/static/styles/base.less'),
      ],
    },
  },
  // 配置路径别名
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
});