const fetch = require("node-fetch");

exports.hasuraRequest = async function ({ query, variables }) {
	const result = await fetch(process.env.HASURA_URL, {
		method: "POST",
		headers: {
			"X-Hasura-Admin-Secret": process.env.SECRET_ADMIN,
		},
		body: JSON.stringify({ query, variables }),
	}).then((res) => res.json());

	if (!result || !result.data) {
		console.error(result);
		return [];
	}

	return result.data;
};
