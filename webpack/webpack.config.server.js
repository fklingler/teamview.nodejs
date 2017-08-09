import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import webpackNodeExternals from 'webpack-node-externals';
import { isProductionBuild, fromRoot } from './environment';
import agnosticConfig from './webpack.config.agnostic';

const ENV_AGNOSTIC_CONFIG = {
    target: 'node',

    externals: [webpackNodeExternals()],

    entry: {
        main: fromRoot('server/main.ts'),
        cli: fromRoot('server/cli/index.ts')
    },

    output: {
        path: fromRoot('dist/server'),
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].bundle.map',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false
        }),
        new webpack.DefinePlugin({
            // The server uses the .env file or real env vars, but we'll override
            // process.env.NODE_ENV to match the mode in which the server is built.
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
    ],

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'tslint-loader',
                options: { configFile: fromRoot('tslint.json') }
            },
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: [fromRoot('node_modules')]
    },

    node: {
        global: true,
        crypto: 'empty',
        __dirname: false,  // false, to avoid the variable replacement by Webpack,
        __filename: false, // and keep the original Node __dirname/__filename globals.
        process: true,
        Buffer: true,
        clearImmediate: true,
        setImmediate: true
    }
};

const DEVELOPMENT_CONFIG = {
    devtool: 'source-map'
};

const PRODUCTION_CONFIG = {};

export default webpackMerge(
    agnosticConfig,
    ENV_AGNOSTIC_CONFIG,
    isProductionBuild ? PRODUCTION_CONFIG : DEVELOPMENT_CONFIG
);
