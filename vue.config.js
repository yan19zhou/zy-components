/*
 * @Description:
 * @Author: zhouy
 * @Date: 2021-08-02 09:34:05
 * @LastEditTime: 2022-03-06 21:45:40
 * @LastEditors: zhouy
 */
let webpack = require("webpack");
const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css", "woff", "ttf"];
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function resolve(dir) {
  return path.join(__dirname, dir);
}
let baseUrl = "http://192.168.3.16:8002"; //xm地址

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  parallel: true,
  publicPath: "./",
  devServer: {
    /*     proxy: {
      "/jzgl": {
        target: baseUrl,
        changeOrigin: true,
        logLevel: "debug",
        secure: false,
        pathRewrite: {
          "^/jzgl": "/",
        },
      },
    }, */
    overlay: {
      warnings: true,
      errors: true,
    },
    port: 8091,
    https: false,
    open: true,
  },
  chainWebpack: (config) => {
    config.plugins.delete("prefetch");
    config.resolve.alias.set("~", resolve("src")).set("assets", resolve("src/assets")).set("board", resolve("src/board"));
    config.plugin("cache").use(HardSourceWebpackPlugin);
  },
  configureWebpack: {
    plugins: [
      // 代码size分析
      //new BundleAnalyzerPlugin(),
      // 去除moment的s其他语言包
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja|it/),

      new webpack.ProvidePlugin({
        utils: [resolve("./src/utils/index.js"), "default"],
      }),
      // gzip
      new CompressionWebpackPlugin({
        algorithm: "gzip",
        test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
        threshold: 10240,
        minRatio: 0.8,
      }),
    ],
    devtool: "source-map",
  },
  css: {
    loaderOptions: {
      scss: {
        /* prependData: `
                    @import "@/assets/style/common.scss";
                    @import "@/assets/style/public.scss";
                `, */
      },
    },
  },
};
