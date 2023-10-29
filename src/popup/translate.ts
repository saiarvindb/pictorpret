import axios from "axios";

type Translation = 
{
	sentences: { trans?: string }[];
	translation: string;
};

export const translateText = (text: string, targetLang: string, sourceLang?: string): Promise<Translation> => 
{
	const url = `https://translate.google.com/translate_a/single?client=at&dt=t&dt=ld&dt=qca&dt=rm&dt=bd&dj=1&hl=${targetLang}&ie=UTF-8&oe=UTF-8&inputm=2&otf=2&iid=1dd3b944-fa62-4b55-b330-74909a99969e`;

	const data = 
	{
		sl : sourceLang || "auto",
		tl : targetLang,
		q : text,
	};

	const response = 
	axios
	.post
	(
		url,
		data,
		{
			headers :
			{
				"Content-Type" : "application/x-www-form-urlencoded;charset=utf-8",
				"User-Agent": "AndroidTranslate/5.3.0.RC02.130475354-53000263 5.1 phone TRANSLATE_OPM5_TEST_1",
			},
			responseType: "json",
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
			const newError = new Error("Couldn't retrieve a valid JSON response. Perhaps the API has changed.") as any;
			newError.data = data;
			newError.statusCode = error.response?.status;
			newError.url = url;
			newError.body = error.response?.data;
			throw newError;
		}
	);
	return response;
}
