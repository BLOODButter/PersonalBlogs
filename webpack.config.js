const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const webpack = require('webpack')

const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const glob = require('glob-all')
const PurifyCSS = require('purifycss-webpack')

const extractSass = new ExtractTextPlugin({
    filename: "css/[name].[contenthash].css",
    publicPath: '/',
    disable: process.env.NODE_ENV === "development"
});

const config = {
    entry: {
        'index': './src/js/index.js',

    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: './js/[name].[hash:8].js',
        publicPath:'/',
        // publicPath: 'https://lifengjun.xin/cultureCenter' //production
    },


    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: ['img:src', 'img:data-src']
                        }
                    },
                ]
            },
            {
                test:/\.(gif|jpg|jpeg|png|svg)$/,
                use:[
                    {
                        loader:"url-loader",
                        options:{
                            limit: 8192,
                            name: "[name].[ext]",
                            useRelativePath: true,
                            // publicPath: './', //production
                            outputPath: './img/'
                        }
                    },
                ]
            },
            {
                test:/\.(eot|woff2|woff|ttf|svg)$/,
                use:[
                    {
                        loader: 'url-loader',
                        options:{
                            limit: 5000,
                            name: "[name].[ext]",
                            useRelativePath: true,
                            // publicPath: './', //production
                            outputPath: './font/'
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                minimize: true //production
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    require('postcss-sprites')({
                                        spritePath: './dist/assets/imgs/sprites'
                                    }),
                                    require('postcss-cssnext')()
                                ]
                            }
                        },
                        {
                            loader: "sass-loader"
                        }],
                })
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                },
                exclude: '/node_modules/',
                include: [path.resolve(__dirname, './src')]
            }

        ]
    },

    plugins: [
        extractSass,

        new CopyWebpackPlugin([
            {from: './src/js/lib', to: './js/lib'},
            {from: './src/css/lib', to: './css/lib'}
        ]),


        new webpack.optimize.UglifyJsPlugin(),

        //提取公共代码
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'jquery',
            minChunks: function(module){
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
        }),

        new HtmlInlineChunkPlugin({
            inlineChunks: ['manifest']
        }),


        new PurifyCSS({
            paths: glob.sync([
                path.join(__dirname, './src/view/*.html'),
                path.join(__dirname, './src/js/*.js')
            ])
        })

        // new HtmlWebpackPlugin({
        // 	filename: './view/index.html',
        // 	template: './src/view/index.html',
        // 	inject: true,
        // 	hash: true,
        // 	minify: {
        // 		removeComments: true,
        // 		collapseWhitespace: false
        // 	},
        // 	chunks: ['manifest', 'index']
        // }),
    ],
}

const pageName = ['index'];
AddHTMLWebpackPlugin(pageName);

//开发环境
if(isDev){
    config.devtool =  "cheap-module-eval-source-map"
    config.devServer = {
        port: 8005,
        host: '0.0.0.0',
        inline:true,
        hot: true,
        contentBase: path.join(__dirname, "dist"),
        publicPath: '/',
        overlay:{
            errors:true,
        },
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}else{
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        new CleanWebpackPlugin('./dist')
    )
}

module.exports = config

function AddHTMLWebpackPlugin(names){
    for(var i = 0 ; i < names.length ; i++){
        config.plugins.push(
            new HtmlWebpackPlugin({
                filename: './view/' + names[i] + '.html',
                template: './src/view/' + names[i] + '.html',
                inject: true,
                hash: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                chunks: ['manifest',  names[i]]
            })
        )
    }
}