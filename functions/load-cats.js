const fetch = require("node-fetch");
const { hasuraRequest } = require("./util/hasura");

exports.handler = async () => {
	const cats = await fetch("https://api.thecatapi.com/v1/breeds").then((res) => res.json());

	const hasuraPromise = hasuraRequest({
		query: `
      mutation InsertOrUpdateBoops($cats: [boops_insert_input!]!) {
        boops: insert_boops(objects: $cats, on_conflict: {constraint: boops_pkey, update_columns: id}) {
          returning {
            id
            count
          }
        }
      }
    `,
		variables: {
			cats: cats.map(({ id }) => ({ id, count: 0 })),
		},
	});

	const [hasuraData] = await Promise.all([hasuraPromise]);

	const completeData = cats.map((cat) => {
		const boops = hasuraData.boops.returning.find((b) => b.id === cat.id);
		return {
			...cat,
			boops: boops.count,
		};
	});

	// const cats = [];
	return {
		statusCode: 200,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(completeData),
	};
};
