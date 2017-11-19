var path = require('path');//路径
var buildConfig = require('../config/buildConfig');//打包配置
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
var ZipPlugin = require('zip-webpack-plugin');//生成zip文件包
var CopyWebpackPlugin = require('copy-webpack-plugin');//copy没有打包的文件

var ROOT_PATH = path.resolve(__dirname);//使用__dirname变量获取当前模块文件所在目录的完整绝对路径。
var APP_PATH = path.resolve(ROOT_PATH, 'src'); //__dirname 中的src目录，以此类推
var APP_FILE = path.resolve(APP_PATH, 'App.jsx'); //根目录文件app.jsx地址
var BUILD_PATH = path.resolve(ROOT_PATH, '/dist'); //发布文件所存放的目录

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        app: APP_FILE
    },
    output: {
        publicPath: '/dist/', //编译好的文件，在服务器的路径,这是静态资源引用路径
        path: BUILD_PATH, //编译到当前目录
        filename: '[name].js', //编译后的文件名字
        chunkFilename: '[name].[chunkhash:5].min.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /^node_modules$/,
            loader: 'babel',
            include: [APP_PATH]
        }, {
            test: /\.css$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer']),
            include: [APP_PATH]
        }, {
            test: /\.less$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer', 'less']),
            include: [APP_PATH]
        }, {
            test: /\.scss$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer', 'sass']),
            include: [APP_PATH]
        }, {
            test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
            exclude: /^node_modules$/,
            loader: 'file-loader?name=[name].[ext]',
            include: [APP_PATH]
        }, {
            test: /\.(png|jpg)$/,
            exclude: /^node_modules$/,
            loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
            //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            include: [APP_PATH]
        },{//代码检查
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'react-hot!babel'
          },
          {//代码检查
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'eslint-loader'
          },
         {
            test: /\.jsx$/,
            exclude: /^node_modules$/,
            loaders: ['jsx', 'babel'],
            include: [APP_PATH]
        }]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from:path.join(__dirname, '../CubeModule.json'), to: path.join(__dirname, '../dist/CubeModule.json') },
          ]),
        new webpack.ProvidePlugin({//全局服务注册
            '$configGlobal': path.resolve(__dirname, '../config/configGlobal.js'),
            //'$common': path.resolve(__dirname, '../src/js/service/common.js'),
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development') //定义编译环境
            }
        }),
        new HtmlWebpackPlugin({  //根据模板插入css/js等生成最终HTML
            filename: '../index.html', //生成的html存放路径，相对于 path
            template: './src/template/index.html', //html模板路径
            hash: false,
        }),
        new ExtractTextPlugin('[name].css'),
        new ZipPlugin({//生成zip文件包
            path: path.join(__dirname, '../'),
            filename: buildConfig.buildTest.zipName,
          }),
    ],
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.scss', '.css'], //后缀名自动补全
    }
};