const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
require('dotenv-expand')(require('dotenv').config());
const getHostName = (hostUrl) => {
    if (!hostUrl) {
        return;
    }
    const hostName = hostUrl.split('/').filter(Boolean).slice(-1)[0];
    return hostName;
};
const normaliseHostUrl = (hostUrl) => {
    if (!hostUrl) {
        return;
    }
    // Remove trailing slash from url
    return hostUrl.replace(/\/$/, '');
};
module.exports = (env, options) => {
    const port = process.env.PORT ?? 8080;
    const hostUrl = normaliseHostUrl(process.env.HOST_URL) ?? `http://localhost:${port}`;
    return {
        devServer: {
            contentBase: path.resolve(__dirname, 'dist'),
            hot: false,
            port,
            public: getHostName(process.env.HOST_URL),
        },
        entry: path.resolve(__dirname, 'js/main.js'),
        externals: { fdc3: 'fdc3', fin: 'fin' },
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'app.json'),
                        transform(buffer) {
                            const json = JSON.parse(buffer.toString());
                            json.platform.defaultWindowOptions.url = `${hostUrl}${json.platform.defaultWindowOptions.url}`;
                            return JSON.stringify(json, null, 2);
                        },
                    },
                ],
            }),
            new CopyWebpackPlugin({
                patterns: [{ from: path.resolve(__dirname, "data/OpenFinBBGPOC_Data.xlsx") }]
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'index.html'),
            }),
        ],
        resolve: {
            extensions: ['.js'],
        },
    };
};