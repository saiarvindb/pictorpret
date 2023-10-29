import { FC } from "react";
import { createRoot } from "react-dom/client";
import { Runtime, runtime }  from "webextension-polyfill";
import { CroppingTool } from "./croppingTool";

const main : () => void = () =>
{
	const root : HTMLDivElement = document.createElement("div");
	root.id = "pictorpret";
	root.style.position = "fixed";
	root.style.top = "0";
	root.style.left = "0";
	root.style.width = "100%";
	root.style.height = "100%";
	root.style.zIndex = "2147483647";
	
	const Ext : FC = () =>
	{
		const ext = <CroppingTool/>
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
