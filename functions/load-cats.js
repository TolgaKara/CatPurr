const fetch = require("node-fetch");

exports.handler = async () => {
	const cats = await fetch("https://api.thecatapi.com/v1/breeds").then((res) => res.json());

	// const cats = [];
	return {
		statusCode: 200,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(cats),
	};
};
