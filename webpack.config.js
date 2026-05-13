import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";

// ESM doesn't have __dirname — reconstruct it manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./src/index.js", // single entry point
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // wipe dist before each build
  },
  devtool: "eval-source-map", // maps errors back to your src files
  devServer: {
    static: path.resolve(__dirname, "dist"),
    watchFiles: ["./src/template.html"],
    port: 8080,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
