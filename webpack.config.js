const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require('path');


module.exports = env => {
  const isProduction = env.production;
  const inlineMode = env.inline;

  const config = {
    // entry: './src/index.ts',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    resolve: {
      extensions: ['.ts', '.js' ]
    },
    output: {
      filename: 'js/main.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: false,
                sourceMap: true,
                importLoader: 2
              }
            },
            "postcss-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.(jpe?g|png|gif|svg|ico)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                // useRelativePath: true,
                publicPath: 'img/',
                outputPath: 'img/'
              }
            },
            'img-loader'
          ]
        },
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        // {
        //   test: /\.js$/,
        //   exclude: /node_modules/,
        //   use: {
        //     loader: "babel-loader"
        //   }
        // },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { 
                minimize: (isProduction === true ? true : false),
                interpolate: true
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
    ]
  };

  if (inlineMode) {
    config.plugins.push(
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html",
        // favicon: 'img/favicon.ico',
        inlineSource: '.(js|css)$' // embed all javascript and css inline
      })
    );
    config.plugins.push(
      new HtmlWebpackInlineSourcePlugin(), // Inline css and javascript
    );
  } else {
    config.plugins.push(
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        // favicon: 'src/img/favicon.ico',
        filename: "./index.html"
      })
    );

    // For multiple pages.
    // config.plugins.push(
    //   new HtmlWebPackPlugin({
    //     template: "./src/test.html",
    //     // favicon: 'src/img/favicon.ico',
    //     filename: "./test.html"
    //   })
    // );

    //For copy text injection (eg. languages).
    /*config.plugins.push(
      new HtmlWebPackPlugin({
        template: "./src/test-language.ejs",
        // favicon: 'src/img/favicon.ico',
        filename: "./test-en.html",
        templateParameters:require('./src/data/test-en.json')
      }),
      new HtmlWebPackPlugin({
        template: "./src/test-language.ejs",
        // favicon: 'src/img/favicon.ico',
        filename: "./test-es.html",
        templateParameters:require('./src/data/test-es.json')
      }),
      new HtmlWebPackPlugin({
        template: "./src/test-language.ejs",
        // favicon: 'src/img/favicon.ico',
        filename: "./test-zh.html",
        templateParameters:require('./src/data/test-zh.json')
      }),
      new HtmlWebPackPlugin({
        template: "./src/test-language.ejs",
        // favicon: 'src/img/favicon.ico',
        filename: "./test-ko.html",
        templateParameters:require('./src/data/test-ko.json')
      }),
      new HtmlWebPackPlugin({
        template: "./src/test-language.ejs",
        // favicon: 'src/img/favicon.ico',
        filename: "./test-vi.html",
        templateParameters:require('./src/data/test-vi.json')
      })
    );*/
  }

  return config;
}
