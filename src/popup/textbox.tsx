import { FC, useEffect, useState } from "react";
import { runtime, tabs } from "webextension-polyfill";

export const Textbox : FC = () =>
{
	const [text, setText] = useState<string>("");
	const [getText, setGetText] = useState<boolean>(false);
	runtime.onMessage.addListener
	(
		(request) =>
		{
			if ("type" in request && request.type === "Teseract Text")
			{
				setText(request.message);
			}
		}
	)
	const handleClick = () =>
	{
		setGetText(true);
	}
	useEffect
	(
		() =>
		{
			if (getText === true)
			{
				setGetText(false);
				tabs.query({ active: true, currentWindow: true })
				.then
				(
					(activeTabs) =>
					{
						tabs.sendMessage(activeTabs[0].id, {message : "Textbox"});
					}
				);
			}
		},
		[getText]
	)

	const textbox = 
	<div>
		<button onClick={handleClick}>Get Text</button>{'\n'}
		<input type = "text" value={text} readOnly />
	</div>;

	return textbox;
}
