import { FC } from "react";
import { createRoot } from "react-dom/client";
import { Lens } from "./lens";
import { Runtime, runtime }  from "webextension-polyfill";

const main : () => void = () =>
{
	const root : HTMLDivElement = document.createElement("div");
	root.id = "pictorpret";
	root.style.position = "absolute";
	root.style.top = "0";
	root.style.left = "0";
	root.style.width = "100%";
	root.style.height = "100%";
	
	const Ext : FC = () =>
	{
		const ext = <Lens/>
		return ext;
	}
	
	const handleMessage : (message: any, sender: Runtime.MessageSender, sendResponse: (response? : any) => void) => true | void | Promise<any>  = (message : any, sender : Runtime.MessageSender, sendResponse : (response? : any) => void) =>
	{
		if (message.text === "Capture Text")
		{
			document.body.appendChild(root);
			createRoot(root).render(<Ext/>);
		}
		else if (message.text === "Clear")
		{
			document.body.removeChild(root);
		}
	}
	runtime.onMessage.addListener(handleMessage);
};

main();
