const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'production',
    entry: ['./src/tbaiguard.ts'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'tbai.guards.js',
        library: 'tbaiguards',
        libraryTarget: 'umd'
    },
});
