const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const webpack = require('webpack')

const path = require('path')

const glob = require('glob-all')
const PurifyCSS = require('purifycss-webpack')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    plugins: [
        new CleanWebpackPlugin('./dist'),

        new PurifyCSS({
            paths: glob.sync([
                path.join(__dirname, '../src/view/*.html'),
                path.join(__dirname, '../src/js/*.js')
            ])
        }),


        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        new UglifyJsPlugin(),
    ]
}