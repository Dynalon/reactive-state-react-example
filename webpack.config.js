var path = require('path');

module.exports = {
    entry: "./dist/index",
    output: {
        path: path.resolve(__dirname, "wwwroot/bundles/"),
        filename: "app.js",
        library: "App",
        libraryTarget: "umd"
    },
    resolve: {
        modules: [
            "node_modules"
        ],
        extensions: [".ts", ".js"],
    },
    module: {
        loaders: [
        ]
    },
    plugins: [
    ],
    node: {
        Buffer: false
    },
    context: __dirname,
    target: "web"
}
