const path = require('path');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname,'./src/event-ts.ts'),
    output: {
        path: path.resolve(__dirname, './browser'),
        filename: 'event-ts.js',
        library: 'EVENTTS',
        libraryTarget: 'var',
        umdNamedDefine: true,
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {"configFile":"browser.config.json"}
            },
        ],
    },
}