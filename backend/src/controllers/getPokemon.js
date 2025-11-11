const createPokemonApiClient = require("./index");

/**
 * Get Pokemon data by name
 * @async
 * @function getPokemon
 * @param {Object} req
 * @param {Object} req.params
 * @param {string} req.params.name
 * @param {Object} res
 * @returns {Promise<void>}
 * @throws {Error}
 * @example
 */
const getPokemon = async (req, res) => {
    try {
        const { name } = req.params;
        const apiClient = createPokemonApiClient();
        const response = await apiClient.getByName(name);
        delete response.data.moves
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: `Server Error_${error}` });
        }
    }
};

module.exports = {
    getPokemon,
};
