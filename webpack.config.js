var Webpack = require('webpack'),
    path = require('path'),
    nodeModulesPath = path.resolve(__dirname, 'node_modules'),
    srcPath = path.resolve(__dirname, 'src', 'js', 'main.js'),
    distPath = path.resolve(__dirname, 'src'),
    CSS_LOADER = 'style-loader!css-loader',
    config;

config = {
    devtool: 'eval',
    entry: [
        'webpack/hot/dev-server',
        srcPath
    ],
    output: {
        path: distPath,
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js(x?)$/,
            exclude: [nodeModulesPath],
            loaders: ['babel-loader']
        }, {
            test: /\.css$/,
            loader: CSS_LOADER
        }]
    }
};

module.exports = config;