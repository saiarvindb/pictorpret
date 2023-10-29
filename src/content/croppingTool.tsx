import { FC, useEffect, useRef } from "react";
import { runtime } from "webextension-polyfill";
import { recognize } from "tesseract.js";

export const CroppingTool : FC = () =>
{
	const canvasRef = useRef(null);
	useEffect
	(
		() => 
		{
			const canvas : HTMLCanvasElement = canvasRef.current;
			const ctx : CanvasRenderingContext2D = canvas.getContext('2d');
			ctx.fillStyle = "hsla(0, 0%, 0%, 0.5)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			let isDrawing = false;
			let startX = 0;
			let startY = 0;
			let width = 0;
			let height = 0;

			const handleMouseDown = (event) => 
			{
				isDrawing = true;
				startX = event.clientX;
				startY = event.clientY;
			};
		
			const handleMouseMove = (event) => 
			{
				if (!isDrawing) return
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				width = event.clientX - startX;
				height = event.clientY - startY;
				ctx.strokeRect(startX, startY, width, height)
				ctx.clearRect(startX, startY, width, height);
			}
		
			const handleMouseUp = () =>
			{
				isDrawing = false;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				runtime.sendMessage({text : "Capture Visible Tab"})
				.then
				(
					(dataUrl) =>
					{
							const cropImageURL = (image, t, l, w, h) =>
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
							img.onload = () =>
							{
								let hf = img.naturalHeight/window.innerHeight;
								let wf = img.naturalWidth/window.innerWidth;
								let croppedImageSrc = cropImageURL(img, startY*hf, startX*wf, width*wf, height*hf);
								runtime.sendMessage({text : "Get Language"})
								.then
								(
									(response) =>
									{
										recognize(croppedImageSrc, response)
										.then
										(
											(result) =>
											{
												runtime.sendMessage({text : "Tesseract Text", value : result["data"]["text"]});
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
								);
								document.body.removeChild(document.getElementById("pictorpret"));
							}
					} 
				)
			}
		
			canvas.addEventListener('mousedown', handleMouseDown);
			canvas.addEventListener('mousemove', handleMouseMove);
			canvas.addEventListener('mouseup', handleMouseUp);
		
			const cleanup = () =>
			{
				canvas.removeEventListener('mousedown', handleMouseDown);
				canvas.removeEventListener('mousemove', handleMouseMove);
				canvas.removeEventListener('mouseup', handleMouseUp);
			};
			
			return cleanup;
		},
		[]
	);
	const croppingTool =
	<div>
		<canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} style={{cursor: "crosshair"}}></canvas>
	</div>;
	return croppingTool;
}