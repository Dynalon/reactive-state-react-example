var path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
    entry: "./src/index",
    output: {
        path: path.resolve(__dirname, "wwwroot/"),
        filename: "app.js",
        library: "App",
        libraryTarget: "umd"
    },
    resolve: {
        modules: [
            "node_modules"
        ],
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            }
        ]
    },
    plugins: [
        new CheckerPlugin()
    ],
    node: {
        Buffer: false
    },
    devtool: "source-map",
    context: __dirname,
    target: "web",

    devServer: {
        contentBase: path.join(__dirname, "wwwroot"),
        compress: true,
        port: 8080
    }
}
