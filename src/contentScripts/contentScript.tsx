import { FC } from "react";
import { createRoot } from "react-dom/client";
import { Lens } from "./lens";
import {runtime}  from "webextension-polyfill";

const root : HTMLDivElement = document.createElement("div");
root.id = "pictorpret";
root.style.position = "absolute";
root.style.top = "0";
root.style.left = "0";
root.style.width = "100%";
root.style.height = "100%";

runtime.onMessage.addListener
(
	(request) =>
	{
		if (request.message === "Get Text")
		{
			document.body.appendChild(root);
			const Ext : FC = () =>
			{
				const ext = <Lens />;
				return ext;
			}

			createRoot(root).render(<Ext/>);
		}
		else if (request.message === "Clear")
		{
			document.body.removeChild(root);
		}
	}
);
