import { toPng } from "html-to-image";
import { FC, useState } from "react";
import Tesseract from "tesseract.js";
import { runtime } from "webextension-polyfill";

export const Lens : FC = () =>
{
	const [showLens, setShowLens] = useState<boolean>(true);
	const [top, setTop] = useState<number>(0);
	const [left, setLeft] = useState<number>(0);
	const [width, setWidth] = useState<number>(200);
	const [height, setHeight] = useState<number>(200);

	const styles : {[element : string] : React.CSSProperties} =
	{
		div :
		{
			position : "absolute",
			top : `${top}px`,
			left : `${left}px`,
			width : `${width}px`,
			height : `${height}px`,
			backgroundColor : "hsla(0,0%,50%,0.5)",
			zIndex: 2147483647,
		},
	};

	const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => 
	{
		const initialMouseX = event.clientX;
		const initialMouseY = event.clientY;
	
		const handleMouseMove = (event: MouseEvent) => 
		{
			const distanceX = event.clientX - initialMouseX;
			const distanceY = event.clientY - initialMouseY;
			setTop(top + distanceY);
			setLeft(left + distanceX);
		};
	
		const handleMouseUp = () => 
		{
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			
		};
		
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const captureImage = () =>
	{
		setShowLens(false);
		toPng(document.body)
			.then
			(
				(dataUrl) =>
				{
					const cropImage = (image, t, l, w, h) =>
					{
						const canvas = document.createElement('canvas');
						canvas.width = w;
						canvas.height = h;
						const context = canvas.getContext('2d');
						context.drawImage(image, l, t, w, h, 0, 0, w, h);
						return canvas.toDataURL();
					};
					
					var img = new Image();
					img.src = dataUrl;
					var croppedImg = new Image();
					img.onload = () =>
					{
						let hf = img.naturalHeight/document.body.clientHeight;
						let wf = img.naturalWidth/document.body.clientWidth;
						croppedImg.src = cropImage(img, top*hf, left*wf, width*wf, height*hf);
						croppedImg.onload = () =>
						{
							Tesseract.recognize(croppedImg, "eng")
								.then
								(
									(result) =>
									{
										runtime.onMessage.addListener
										(
											(request) =>
											{
												if (request.message === "Textbox")
												{
													runtime.sendMessage({type : "Teseract Text", message : result.data.text});
												}
											}
										)
										
									}
								)
								.catch
								(
									(error) =>
									{
										console.log(error);
									}
								)
						}
					}
				}
			)
			.catch
			(
				(error) =>
				{
					console.log(error);
				}
			)
	}

	const lens = 
	<div style={styles.div} onMouseDown={handleMouseDown}>
		<button onClick={captureImage}>Capture</button>
	</div>
	return showLens && lens;
};
