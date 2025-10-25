const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPartialsPlugin = require("html-webpack-partials-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const fs = require("fs");

// Dynamically find all HTML files in project root
const htmlPages = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith(".html"));

module.exports = {
    context: path.resolve(__dirname),
    mode:process.env.NODE_ENV,
    entry: {
        index: './ts/index.ts',
        menu: './ts/menu.ts',
        login: './ts/login.ts',
        registration: './ts/registration.ts',
        shoppingCart: './ts/shoppingCart.ts',
    },
    output: {
        filename: '[name].bundle.js', // ✅ unique per entry (index.bundle.js, menu.bundle.js, etc.)
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    },

    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            "@scss": path.resolve(__dirname, "scss/"),
            "@assets": path.resolve(__dirname, "assets/"),
            "@ts": path.resolve(__dirname, "ts/"),
            "@partials": path.resolve(__dirname, "partials/"),
        },
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.s?css$/, // handles .css and .scss
                use: [
                    MiniCssExtractPlugin.loader, // extracts CSS into files
                    'css-loader',                // resolves @import and url()
                    'sass-loader',               // compiles SCSS to CSS (optional)
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {sources: false, minimize: false},
                    },
                ],
            },

            {
                test: /\.(png|jpg|jpeg|svg|gif|ico)$/i,
                type: "asset/resource",
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({ filename: "styles/[name].[contenthash].css" }),

        new CopyWebpackPlugin({
            patterns: [
                { from: "assets", to: "assets" },
                { from: "partials", to: "partials" },
            ],
        }),
        // Auto-create an HtmlWebpackPlugin instance for every HTML file found
        ...htmlPages.map(
            (filename) => {
                return new HtmlWebpackPlugin({
                    template: `./${filename}`,
                    filename, // same name in dist
                    inject: "body",
                    minify: false,
                })
            }
        ),

        // Add shared partials (header/footer)
        new HtmlWebpackPartialsPlugin({
            path: path.join(__dirname, "./partials/header.html"),
            location: "header",
            template_filename: htmlPages,
        }),
        new HtmlWebpackPartialsPlugin({
            path: path.join(__dirname, "./partials/contacts.html"),
            location: "footer",
            template_filename: htmlPages,
        }),
    ],

    performance: {
        maxAssetSize: 1024 * 1024, // 1MB limit instead of 244 KiB
        maxEntrypointSize: 1024 * 1024,
    },

    devServer: {
        static: [
            {
                directory: path.join(__dirname, 'dist'),
            },
            {
                directory: path.join(__dirname, 'partials'),
                publicPath: '/partials',
            },
            {
                directory: path.join(__dirname, 'assets'),
                publicPath: '/assets',
            },
        ],
        port: 3000,
        open: "index.html",
        hot: true,
    },
};
