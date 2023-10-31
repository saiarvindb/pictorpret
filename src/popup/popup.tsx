import { createRoot } from "react-dom/client";
import { FC, useState } from "react";
import { runtime } from  "webextension-polyfill";
import { Autocomplete, Button, TextField, Typography } from "@mui/material";
import { translateText } from "./translate";
import { tesseractLanguages } from "./language";

const main = () =>
{
	const root : HTMLDivElement = document.createElement("div");
	root.style.width = "256px";
	root.style.height = "512px";
	root.style.overflow = "auto";
	root.id = "pictorpret";
	document.body.appendChild(root);

	const Popup : FC<any> = (props) =>
	{
		const [text, setText] = useState<string>("");
		const [translation, setTranslation] = useState<string>("");
		const handleLanguageChange = (event : React.SyntheticEvent<Element, Event>, value : any) =>
		{
			runtime.sendMessage({text : "Set Language", language : tesseractLanguages[value]});
		}
		const captureText = () =>
		{
			runtime.sendMessage({text : "Capture Text"});
		}
		const clear = () =>
		{
			runtime.sendMessage({text : "Clear"});
			setText("");
			setTranslation("");
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

		const styles : any =
		{
			Button :
			{
				backgroundColor : "hsla(216, 100%, 50%, 1)",
				color : "white",
				margin : "4px",
			},
			TextField :
			{
				width : "100%",
				boxSizing : "content-box"
			}
		}

		const popup = 
		<div>
			<Typography color="hsla(137, 60%, 30%, 1)" variant="h4" align="center">Pictorpret</Typography>
			<br/>
			<Autocomplete 
				options={Object.keys(tesseractLanguages)}
				defaultValue={props["language"]}
				onChange={handleLanguageChange}
				renderInput=
				{
					(params) =>
					{
						return <TextField {...params} label="Language"/>;
					}
				}
			/>
			<Button style={styles.Button} onClick={captureText}>Capture Text</Button>
			<Button style={styles.Button} onClick={clear}>Clear</Button>
			<Button style={styles.Button} onClick={getText}>Get Text</Button>
			<TextField
				multiline
				style={styles.TextField}
				rows={4}
				variant="outlined"
				InputProps={{readOnly: true}}
				label="Text"
				value={text}
			/>
			<br/>
			<Button style={styles.Button} onClick={translate}>Translate to English</Button>
			<br/>
			<TextField
				multiline
				style={styles.TextField}
				rows={4}
				variant="outlined"
				InputProps={{readOnly: true}}
				label="Translation"
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
			let language = Object.keys(tesseractLanguages).find((key) => tesseractLanguages[key] === response);
			createRoot(root).render(<Popup language={language}/>);
		}
	)
	
};

main();
