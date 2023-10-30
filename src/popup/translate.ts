import axios from "axios";

type Translation = 
{
	sentences: { trans?: string }[];
	translation: string;
};

export const translateText = (text: string, targetLang: string, sourceLang?: string): Promise<Translation> => 
{
	const response = 
	axios
	.post
	(
		`https://translate.google.com/translate_a/single?client=at&dt=t&dt=ld&dt=qca&dt=rm&dt=bd&dj=1&hl=${targetLang}&ie=UTF-8&oe=UTF-8&inputm=2&otf=2&iid=1dd3b944-fa62-4b55-b330-74909a99969e`,
		{
			sl : sourceLang || "auto",
			tl : targetLang,
			q : text,
		},
		{
			headers :
			{
				"Content-Type" : "application/x-www-form-urlencoded;charset=utf-8",
			},
		},
	)
	.then
	(
		(response) => 
		{
			const json = response.data;
			const translation = 
			{
				sentences: json.sentences,
				translation: json.sentences.reduce((combined: string, trans: { trans?: string }) => combined + (trans.trans || ""), ""),
			};
			return translation;
		}
	)
	.catch
	(
		(error) => 
		{
			throw error;
		}
	);
	return response;
};
