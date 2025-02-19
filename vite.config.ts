import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig
(
	{
		plugins :
		[
			viteStaticCopy
			(
				{
					targets :
					[
						{
							src: "./manifest.json",
							dest: "",
						}
					]
				}
			)
		],
		build :
		{
			rollupOptions :
			{
				input :
				{
					popup : "./popup.html",
					content: "./src/content/content.ts",
					background: "./src/background/background.ts"
				},
				output :
				{
					entryFileNames: "[name].js",
					assetFileNames: (assetInfo) => 
					{
						if (assetInfo.name === 'popup.html') {
						  return 'popup.html';
						}
						return '[name][extname]';
					}
				}
			}
		},
	}
);
