# pictorpret

(NOTE: This is still a WIP and therefore has limitations.)

Translate text in pictures while browsing the web.

### Requirements
	node version manager (nvm)

### Build Steps
	- nvm i
	- npm i
	- npm run build

The extension for chromium browsers can be found in `dist/chrome/`.  
The extension for firefox can be found in `dist/firefox/`.

### Limitations

- Does not work on some webpages with strict content security policies.
- It can perform OCR but cannot form sentences for vertical scripts.
