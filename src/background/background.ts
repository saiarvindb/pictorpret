import { Runtime, runtime, storage, tabs } from "webextension-polyfill";

const main : () => void = () =>
{
	let language = "eng";
	let text = "";
	const handleMessage : (message: any, sender: Runtime.MessageSender, sendResponse: (response? : any) => void) => true | void | Promise<any>  = (message : any, sender : Runtime.MessageSender, sendResponse : (response? : any) => void) =>
	{
		if (message["text"] === "Get Language")
		{
			storage.local.get("language")
				.then
				(
					(result) =>
					{
						sendResponse({language : result["language"]})
					}
				)
			return true;
		}
		else if (message["text"] === "Set Language")
		{
			language = message["language"];
			storage.local.set({language : language});
		}
		else if (message["text"] === "Capture Text" || message["text"] === "Clear")
		{
			tabs.query({ active: true, currentWindow: true })
				.then
				(
					(activeTabs) =>
					{
						tabs.sendMessage(activeTabs[0].id, {text : message["text"]});
					}
				);
		}
		else if (message["text"] === "Send Text")
		{
			text = message["data"];
		}
		else if (message["text"] === "Get Text")
		{
			sendResponse(text);
		}
	}

	storage.local.set({language : language})
		.then
		(
			() =>
			{
				runtime.onMessage.addListener(handleMessage);
			}
		)
	return;
};

main();
