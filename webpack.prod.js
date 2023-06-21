const { merge } = require("webpack-merge");
const CSSMinimizerPlugin = require("css-minimizer-webpack-plugin");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimizer: ["...", new CSSMinimizerPlugin()],
  },
});
