const axios = require("axios");
const createPokemonApiClient = require("./index");

/**
 * @param {import('express').Request} req
 * @param {Object} req.body
 * @param {string} [req.body.filterValue]
 * @param {Object} [req.body.pagination]
 * @param {number} [req.body.pagination.page=1]
 * @param {number} [req.body.pagination.pageSize=20]
 * @param {boolean} [req.body.addImage=false]
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
const getPokemonList = async (req, res) => {
    try {
        const { body } = req;
        const apiClient = createPokemonApiClient();

        const offset = Number(body?.pagination?.page) || 1;
        const limit = Number(body?.pagination?.pageSize) || 20;

        const params = body?.filterValue?.length === 0 ? { offset, limit } : {};

        const response = await apiClient.getList(params);
        let results = response?.data?.results || [];

        let count = response?.data.count || 0;

        if (typeof body?.filterValue === "string" && body.filterValue.trim().length > 0) {
            const filterValue = body.filterValue.toLowerCase();

            const filteredSortedList = results.filter((pokemon) => pokemon.name?.toLowerCase().includes(filterValue)).sort((a, b) => a.name.localeCompare(b.name));
            count = filteredSortedList.length;
            const startIndex = (offset - 1) * limit;
            results = filteredSortedList.slice(startIndex, startIndex + limit);
        }

        if (body?.addImage === true) {
            results = await handleGetPokemonInfo(results);
        }

        res.json({ ...response?.data, count, results });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: `Server Error_${error}` });
        }
    }
};

/**
 * @async
 * @function handleGetPokemonInfo
 * @param {Array<{url: string, name: string}>} pokeList
 * @returns {Promise<Array<{name: string, imageUrl: string | null, description: string | null}>>}
 */
async function handleGetPokemonInfo(pokeList) {
    return await Promise.all(
        pokeList.map(async (pokemon) => {
            const imageUrl = await handleGetPokemonImage(pokemon.url);
            const description = await handleGetPokemonDescription(pokemon.name);

            return { name: pokemon.name, imageUrl, description };
        })
    );
}

/**
 * @async
 * @function handleGetPokemonImage
 * @param {string} url
 * @returns {Promise<string | null>}
 */
async function handleGetPokemonImage(url) {
    try {
        const detailResponse = await axios.get(url);
        const details = detailResponse.data;
        return details?.sprites?.other?.["official-artwork"]?.front_default || details?.sprites?.front_default || null;
    } catch {
        return "There is no image";
    }
}

/**
 * @async
 * @function handleGetPokemonDescription
 * @param {string} pokemonName
 * @returns {Promise<string | null>}
 */
async function handleGetPokemonDescription(pokemonName) {
    try {
        const descriptionUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
        const descriptionResponse = await axios.get(descriptionUrl);
        const descriptionDetails = descriptionResponse.data;
        return descriptionDetails.flavor_text_entries?.find((entry) => entry.language?.name === "en")?.flavor_text;
    } catch {
        return "There is no english description";
    }
}

module.exports = {
    getPokemonList,
};
