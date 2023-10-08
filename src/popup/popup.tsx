import { createRoot } from "react-dom/client";
import { FC } from "react";
import {tabs} from  "webextension-polyfill";
import { Textbox } from "./textbox";

const root : HTMLDivElement = document.createElement("div");
root.id = "pictorpret";
document.body.appendChild(root);

const Popup : FC = () =>
{
	const getText = () =>
	{
		tabs.query({ active: true, currentWindow: true })
			.then
			(
				(activeTabs) =>
				{
					tabs.sendMessage(activeTabs[0].id, {message : "Get Text"});
				}
			);
	};
	const clear = () =>
	{
		tabs.query({ active: true, currentWindow: true })
			.then
			(
				(activeTabs) =>
				{
					tabs.sendMessage(activeTabs[0].id, {message : "Clear"});
				}
			);
	};
	const popup = 
	<div>
		<button onClick={getText}>
			Capture Image
		</button>{'\n'}
		<button onClick={clear}>
			Clear
		</button>{'\n'}
		<Textbox/>
	</div>
	return popup;
};

createRoot(root).render(<Popup/>);
