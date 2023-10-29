import { createRoot } from "react-dom/client";
import { FC, useState } from "react";
import { runtime } from  "webextension-polyfill";
import { Autocomplete, Button, TextField } from "@mui/material";
import { translateText } from "./translate";

const main = () =>
{
	const root : HTMLDivElement = document.createElement("div");
	root.style.width = "256px";
	root.style.height = "256px";
	root.style.overflow = "auto";
	root.id = "pictorpret"; 
	document.body.appendChild(root);

	const Popup : FC<any> = (props) =>
	{
		const [text, setText] = useState<string>("");
		const [translation, setTranslation] = useState<string>("");
		const options = ["ara", "ben", "eng", "fra", "hin", "jpn", "tam", "tel"];
		const handleLanguageChange = (event : React.SyntheticEvent<Element, Event>, value : any) =>
		{
			runtime.sendMessage({text : "Set Language", language : value});
		}
		const captureText = () =>
		{
			runtime.sendMessage({text : "Capture Text"});
		}
		const clear = () =>
		{
			runtime.sendMessage({text : "Clear"});
		}
		const getText = () =>
		{
			runtime.sendMessage({text : "Get Text"})
			.then
			(
				(response) =>
				{
					setText(response);
				}
			)
		}
		const captureTab = () =>
		{
			runtime.sendMessage({text : "Capture Visible Tab"})
			.then
			(
				(response) =>
				{
					let img = new Image();
					img.src = response;
				}
			)
		}
		const translate = () =>
		{
			translateText(text, "en")
			.then
			(
				(result) =>
				{
					setTranslation(result["translation"]);
				}
			)
		};

		const popup = 
		<div>
			<br/>
			<Autocomplete 
				options={options}
				defaultValue={props.languageID}
				onChange={handleLanguageChange}
				renderInput=
				{
					(params) =>
					{
						return <TextField {...params} label="Language"/>;
					}
				}
			/>
			<Button onClick={captureText}>Capture Text</Button>
			<Button onClick={clear}>Clear</Button>
			<Button onClick={getText}>Get Text</Button>
			<Button onClick={captureTab}>Capture Tab</Button>
			
			<TextField
				multiline
				rows={4}
				variant="outlined"
				InputProps={{readOnly: true}}
				label="Text"
				value={text}
			/>

			<Button onClick={translate}>Translate to English</Button>
			<TextField
				multiline
				rows={4}
				variant="outlined"
				InputProps={{readOnly: true}}
				label="Text"
				value={translation}
			/>
			<br/>
		</div>;
		return popup;
	}

	runtime.sendMessage({text : "Get Language"})
		.then
		(
			(response) =>
			{
				createRoot(root).render(<Popup languageID={response}/>);
			}
		)
	
	
};

main();
