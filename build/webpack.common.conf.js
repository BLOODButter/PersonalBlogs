const productionConfig = require('./webpack.prod.conf.js')
const developmentConfig = require('./webpack.dev.conf.js')

const merge = require('webpack-merge')

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const webpack = require('webpack')

const path = require('path')

const glob = require('glob-all')
const PurifyCSS = require('purifycss-webpack')

// const CDN_URL = 'https://lifengjun.xin/cultureCenter'
const pageName = ['index','news','newsPage'];

const generateConfig = env => {
    var FontUrlLoaderPublicPath,
        ImgUrlLoaderPublicPath,
        outPublicPath;

    env === 'production'
        ? (FontUrlLoaderPublicPath = './', ImgUrlLoaderPublicPath = './dist', outPublicPath = '../', spritePath = './dist/assets/sprites')
        : (FontUrlLoaderPublicPath = '/', ImgUrlLoaderPublicPath = '', outPublicPath = '/', spritePath = './dist/assets/sprites')

    const extractSass = new ExtractTextPlugin({
        filename: "css/[name].[contenthash:8].css",
        publicPath: '/',
        disable: env === "development"
    });
    const htmlLoader = [
        {
            loader: 'html-loader',
            options: {
                attrs: ['img:src', 'img:data-src']
            }
        }]

    const scriptLoader = ['babel-loader']

    const cssLoaders = [{
        loader: "css-loader",
        options: {
            minimize: env === 'production',
            sourceMap: env === 'development'
        }
    },
        {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins: [
                    require('postcss-cssnext')()
                ]
            }
        },
        {
            loader: "sass-loader",
        }]


    const styleLoader = extractSass.extract({
        fallback: "style-loader",
        use: cssLoaders
    })

    const ImgUrlLoader = [{
        loader: "url-loader",
        options: {
            limit: 1024,
            name: "[name].[ext]",
            useRelativePath: true,
            publicPath: ImgUrlLoaderPublicPath,
            // uesRelativePath: true,
            outputPath: 'dist/'
        }
    }]


    const FontUrlLoader = [{
        loader: 'url-loader',
        options: {
            limit: 5000,
            name: "[name].[ext]",
            useRelativePath: true,
            publicPath: FontUrlLoaderPublicPath,
            outputPath: './font/'
        }
    }]

    return {
        entry: {
            'index': './src/js/index.js',
            'news': './src/js/news.js',
            'newsPage': './src/js/newsPage.js',
            'jquery': './src/js/lib/jquery-3.3.1.min.js'
        },

        output: {
            path: path.join(__dirname, 'dist'),
            // filename: './js/[name].[hash:8].js',
            filename: env === "development" ? './js/[name].[hash:8].js' : './js/[name].[chunkhash:8].js',
            publicPath: outPublicPath

        },

        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: htmlLoader
                },
                {
                    test: /\.(gif|jpg|jpeg|png|svg)$/,
                    use: ImgUrlLoader
                },
                {
                    test: /\.(eot|woff2|woff|ttf)$/,
                    use: FontUrlLoader
                },
                {
                    test: /\.scss$/,
                    use: styleLoader
                },
                {
                    test: /\.js$/,
                    exclude: '/node_modules/',
                    include: [path.resolve(__dirname, './src')],
                    use: scriptLoader,
                }]
        },

        plugins: [
            extractSass,

            new CopyWebpackPlugin([
                {from: './src/js/lib', to: './js/lib'},
                {from: './src/css/lib', to: './css/lib'}
            ]),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                minChunks: Infinity
            }),

            new webpack.optimize.CommonsChunkPlugin({
                name: 'jquery',
                minChunks: function (module) {
                    return module.context && module.context.includes("node_modules");
                },
                chunks: ['jquery'],
                filename: '/js/lib/jquery-3.3.1.min.js'
            }),

            new webpack.optimize.CommonsChunkPlugin({
                name: 'vue',
                minChunks: function (module) {
                    return module.context && module.context.includes("node_modules");
                },
                chunks: ['vue'],
                filename: '/js/lib/vue.js'
            })

        ],

    }
}

module.exports = env => {

    var config = env === 'production' ? productionConfig : developmentConfig;

    var finalConfig = merge(generateConfig(env), config);

    AddHTMLWebpackPlugin(pageName);

    function AddHTMLWebpackPlugin(names) {
        for (var i = 0; i < names.length; i++) {
            finalConfig.plugins.push(
                new HtmlWebpackPlugin({
                    filename: './view/' + names[i] + '.html',
                    template: './src/view/' + names[i] + '.html',
                    inject: true,
                    hash: true,
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true
                    },
                    chunks: ['manifest', names[i]]
                })
            );
        }
    }

    return finalConfig;

};
