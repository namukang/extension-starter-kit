const path = require("path");
const webpack = require("webpack");
const packageJson = require("./package.json");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");

// Regexes for style files
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

function getStyleLoaders({ cssOptions = {}, preProcessor } = {}) {
  const loaders = [
    // Turn CSS into JS modules that inject <style> tags
    "style-loader",
    {
      // Resolve paths in CSS files
      loader: "css-loader",
      options: cssOptions,
    },
    {
      // Run PostCSS actions
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [require("autoprefixer")],
        },
      },
    },
  ];
  if (preProcessor) {
    loaders.push({
      loader: preProcessor,
    });
  }
  return loaders;
}

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";
  return {
    entry: {
      background: "./src/background/background.ts",
      popup: "./src/components/Popup/index.tsx",
      options: "./src/components/Options/index.tsx",
      welcome: "./src/components/Welcome/index.tsx",
      example: "./src/contentScripts/example.ts",
    },

    // Use built-in optimizations based on mode
    // https://webpack.js.org/configuration/mode/
    mode: "development",

    // Source maps must be inline to work with TypeScript
    devtool: "cheap-module-inline-source-map",

    module: {
      rules: [
        // JS
        {
          test: /\.js(x?)$/,
          exclude: /node_modules/,
          use: ["babel-loader", "eslint-loader"],
        },

        // Typescript
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            { loader: "babel-loader" },
            {
              // ts-loader is used for transpiling to generate source maps
              loader: "ts-loader",
              options: {
                // Skip type checking while developing but enforce for production
                transpileOnly: isDev,
              },
            },
            { loader: "eslint-loader" },
          ],
        },

        // CSS
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getStyleLoaders(),
        },
        {
          test: cssModuleRegex,
          use: getStyleLoaders({ cssOptions: { modules: true } }),
        },
        {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: getStyleLoaders({ preProcessor: "sass-loader" }),
        },
        {
          test: sassModuleRegex,
          use: getStyleLoaders({
            cssOptions: { modules: true },
            preProcessor: "sass-loader",
          }),
        },

        // Assets
        {
          test: /\.(png|svg|mp4)$/,
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
          },
        },
        {
          test: /\.(woff|woff2)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
              esModule: false,
            },
          },
        },
      ],
    },

    resolve: {
      // Allow leaving off extensions when importing
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      // Allow importing directly from these directories
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },

    output: {
      path: path.resolve(__dirname, isDev ? "dist-dev" : "dist-prod"),
      filename: "[name].bundle.js",
    },

    devServer: {
      contentBase: path.join(__dirname, "dist-dev"),
      port: 3000,
      hot: true,
      // Display all files when navigating to /
      writeToDisk: true,
      // Allow live reloading / HMR when extension is loaded in Chrome
      disableHostCheck: true,
    },

    plugins: [
      new webpack.DefinePlugin({
        PLATFORM:
          env && env.platform === "firefox"
            ? JSON.stringify("firefox")
            : JSON.stringify("chrome"),
      }),

      // Clean build folder
      new CleanWebpackPlugin({
        // Prevent cleaning copied files since copy-webpack-plugin does not regenerate unchanged files
        cleanStaleWebpackAssets: false,
      }),

      // Copy manifest.json to build folder
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "src/manifest.json",
            transform: (content) => {
              const manifest = JSON.parse(content.toString());
              // Use fields from package.json for manifest
              const manifestFields = {
                description: packageJson.description,
                version: packageJson.version,
              };
              // Use 'unsafe-eval' to allow eval() generated by webpack in development mode
              manifestFields["content_security_policy"] = `script-src 'self' ${
                isDev ? "'unsafe-eval'" : ""
              }; object-src 'self'`;
              if (env && env.platform === "firefox") {
                // Incognito 'split' mode is not supported on Firefox
                if (manifest.incognito === "split") {
                  delete manifest.incognito;
                }
                // Assign an add-on ID to use storage.sync
                // https://extensionworkshop.com/documentation/develop/testing-persistent-and-restart-features/
                if (isDev) {
                  manifestFields.applications = {
                    gecko: {
                      id: "name@domain.com",
                    },
                  };
                }
              }
              // Add fields to the manifest file using package.json
              return Buffer.from(
                JSON.stringify({
                  ...manifestFields,
                  ...manifest,
                })
              );
            },
          },
        ],
      }),

      // Generate HTML files
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "index.html"),
        filename: "popup.html",
        chunks: ["popup"],
      }),

      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "index.html"),
        filename: "options.html",
        chunks: ["options"],
      }),

      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "index.html"),
        filename: "welcome.html",
        chunks: ["welcome"],
      }),

      !isDev &&
        new ZipPlugin({
          filename: `${packageJson.name}-v${packageJson.version}.zip`,
        }),
    ].filter((plugin) => !!plugin),
  };
};
