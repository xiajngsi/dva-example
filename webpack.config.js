const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const HappyPack = require('happypack')

module.exports = (env, context) => {
  const postcssOpts = {
    ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
    plugins: () => [
      autoprefixer({
        browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      }),
    ],
    sourceMap: true,
  }
  const isBuild = context['optimize-minimize']

  const publicPath = path.join(__dirname, '/public')
  const pkgPath = path.join(process.cwd(), 'package.json')
  // eslint-disable-next-line
  const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {}

  let theme = {}
  if (pkg.theme && typeof pkg.theme === 'string') {
    let cfgPath = pkg.theme
    // relative path
    if (cfgPath.charAt(0) === '.') {
      cfgPath = path.resolve(process.cwd(), cfgPath)
    }
    // eslint-disable-next-line
    const getThemeConfig = require(cfgPath)
    theme = getThemeConfig()
  } else if (pkg.theme && typeof pkg.theme === 'object') {
    theme = pkg.theme
  }

  return {
    devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
    node: {
      net: 'empty',
    },
    entry: {
      app: ['./app/index.js'],
      vendor: [
        'react',
        'react-dom',
        'dva',
        'regenerator-runtime',
      ],
    },
    output: {
      path: publicPath,
      filename: isBuild ? '[name].[chunkhash].js' : '[name].js',
      chunkFilename: isBuild ? '[chunkhash].chunk.js' : '[id].chunk.js',
      publicPath: '/',
    },
    module: {
      loaders: [
        {
          test: /\.(scss)$/,
          include: [
            path.resolve(__dirname, 'app'),
          ],
          loader: 'style-loader!css-loader!sass-loader',
        },
        {
          test: /\.(less)$/,
          include: [
            path.resolve(__dirname, 'node_modules/antd'),
            path.resolve(__dirname, './app'),
          ],
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', options: { sourceMap: true } },
              { loader: 'postcss-loader', options: postcssOpts },
              { loader: 'less-loader', options: { sourceMap: true } },
            ],
          }),
        },
        // {
        //   test(filePath) {
        //     return /\.less$/.test(filePath) && !/\.module\.less$/.test(filePath)
        //   },
        //   loader: ExtractTextPlugin.extract(
        //     'css-loader?sourceMap&-autoprefixer!' +
        //     'postcss-loader!' +
        //     `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`),
        // },
        // {
        //   test: /\.module\.less$/,
        //   loader: ExtractTextPlugin.extract(
        //     'css-loader?sourceMap&modules&localIdentName=[local]___[hash:base64:5]&-autoprefixer!' +
        //     'postcss-loader!' +
        //     `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`),
        // },
        {
          test: /\.(css)$/,
          loader: 'style-loader!css-loader',
        },
        {
          test: /\.(jsx|js)?$/,
          include: [
            path.resolve(__dirname, 'app'),
            // path.resolve(__dirname, 'node_modules/@terminus-paas-ui'),
            // path.resolve(__dirname, 'node_modules/pinyin'),
          ],
          loader: [
            'happypack/loader?id=babel',
          ],
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
      ],
    },
    // resolve: {
    //   alias: {
        // common: path.resolve(__dirname, 'app/common'),
        // color: path.resolve(__dirname, 'app/styles/_color.scss'),
        // functions: path.resolve(__dirname, 'app/styles/_functions.scss'),
        // agent: path.resolve(__dirname, 'app/agent.js'),
        // overview: path.resolve(__dirname, 'app/overview'),
        // console: path.resolve(__dirname, 'app/console'),
    //   },
    //   extensions: ['.js', '.jsx', '.scss'],
    // },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV), // because webpack just do a string replace, so a pair of quotes is needed
        },
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
      }),
      new CopyWebpackPlugin([
        { from: './app/images', to: 'images' },
      ]),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './app/views/index.ejs',
      }),
      new HappyPack({
        id: 'babel',
        loaders: ['babel-loader'],
        threads: 4,
      }),
      new ExtractTextPlugin({
        filename: isBuild ? '[name].[chunkhash].css' : '[name].css',
        disable: false,
        allChunks: true,
      }),
    ],
  }
}
