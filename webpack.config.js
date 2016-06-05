var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	entry: ['./src/Example'],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [{
			test: /\.css$/,
			loader: ExtractTextPlugin.extract("style-loader", "css-loader")
		}, {
			loader: 'babel-loader',
			exclude: /node_modules/,
			test: /\.jsx$/,
			query: {
				presets: ['es2015', 'react', 'stage-0'],
			},
		}]
	},
	plugins: [
		new ExtractTextPlugin("style.css", {
			allChunks: true
		})
	]
};
