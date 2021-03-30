let path = require("path");

let conf = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "main.js",
    publicPath: '/dist/',
  },
  module: {
    rules: [
      { test: /\.svg$/, use: "svg-inline-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.js$/, use: "babel-loader", 
    //   exclude: '/node_modules/'
     },
    ],
  },
  devServer: {
    overlay: true,
    open: true
    }
};

module.exports = conf;
