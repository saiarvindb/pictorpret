import {Configuration} from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

const configuration : Configuration =
{
	mode : "production",
	entry : 
	{
		popup : `${__dirname}/src/popup/popup.tsx`,
		contentScript : `${__dirname}/src/contentScripts/contentScript.tsx`,
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
						from : `${__dirname}/src/manifest.json`,
						to : `${__dirname}/dist/`,
					},
				],
			},
		),
	],
}

export default configuration;
