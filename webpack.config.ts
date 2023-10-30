import {Configuration} from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

const configuration : Configuration =
{
	mode : "production",
	entry : 
	{
		popup : `${__dirname}/src/popup/popup.tsx`,
		content : `${__dirname}/src/content/content.tsx`,
		serviceWorker : `${__dirname}/src/background/serviceWorker.ts`
	},
	output :
	{
		path : `${__dirname}/dist/`,
		filename : "[name].js",
	},
	module :
	{
		rules :
		[
			{
				test : /\.tsx?$/,
				use : "ts-loader",
				exclude : /node_modules/,
			},
		],
	},
	resolve :
	{
		extensions : [".tsx", ".js", ".ts", ".jsx"],
	},
	plugins :
	[
		new HtmlWebpackPlugin
		(
			{
				template : `${__dirname}/src/popup/popup.html`,
				path : `${__dirname}/dist/`,
				filename : "popup.html",
				chunks : ["popup"],
			},
		),
		new CopyWebpackPlugin
		(
			{
				patterns :
				[
					{
						from : `${__dirname}/src/firefox.manifest.json`,
						to : `${__dirname}/dist/firefox.manifest.json`,
					},
					{
						from : `${__dirname}/src/chrome.manifest.json`,
						to : `${__dirname}/dist/chrome.manifest.json`,
					},
				],
			},
		),
	],
}

export default configuration;
