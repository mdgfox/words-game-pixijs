const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: 'development',
    devServer: {
        contentBase: 'dist',
        port: 3000
    },
    entry: {
        index: {
            import: './src/index.ts',
            dependOn: 'shared'
        },
        shared: 'pixi.js'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "public", to: "public" }
            ]
        }),
        new HTMLWebpackPlugin({
            template: 'src/index.html',
            title: 'Words Game'
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: './tsconfig.json',
                extensions: ['.ts']
            })
        ],
    },
    output: {
        filename: '[name].application.js',
        path: path.resolve(__dirname, '../dist'),
        devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]'
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
        fallback: {
            "buffer": require.resolve("buffer/"),
        }
    },
    cache: {
        type: 'filesystem'
    }
}
