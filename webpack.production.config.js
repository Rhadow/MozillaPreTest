var Webpack = require('webpack'),
    path = require('path'),
    nodeModulesPath = path.resolve(__dirname, 'node_modules'),
    srcPath = path.resolve(__dirname, 'src', 'js', 'main.js'),
    distPath = path.resolve(__dirname, 'src', 'js'),
    config;

config = {
    devtool: 'source-map',
    entry: srcPath,
    output: {
        path: distPath,
        publicPath: __dirname,
        filename: 'main.min.js'
    },
    module: {
        loaders: [{
            test: /\.js(x?)$/,
            exclude: [nodeModulesPath],
            loader: 'babel'
        }]
    }
};

module.exports = config;
