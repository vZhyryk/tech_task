const axios = require("axios");

/**
 * @typedef {Object} PokemonListResponse
 * @property {number} count - Total number of Pokemon available
 * @property {string|null} next - URL for next page of results
 * @property {string|null} previous - URL for previous page of results
 * @property {Array<PokemonListItem>} results - List of Pokemon items
 */

/**
 * @typedef {Object} PokemonListItem
 * @property {string} name - Pokemon name
 * @property {string} url - URL for detailed Pokemon information
 */

/**
 * @typedef {Object} PokemonDetailResponse
 * @property {number} id - Pokemon ID
 * @property {string} name - Pokemon name
 * @property {number} height - Pokemon height
 * @property {number} weight - Pokemon weight
 * @property {number} base_experience - Base experience
 * @property {PokemonSprites} sprites - Pokemon sprites
 * @property {Array<PokemonType>} types - Pokemon types
 * @property {Array<PokemonAbility>} abilities - Pokemon abilities
 * @property {Array<PokemonStat>} stats - Pokemon base stats
 */

/**
 * @typedef {Object} PokemonSprites
 * @property {string|null} front_default - Default front sprite
 * @property {string|null} front_shiny - Shiny front sprite
 * @property {Object} other - Other sprite formats
 * @property {Object} other.['official-artwork'] - Official artwork
 * @property {string|null} other.['official-artwork'].front_default - Official artwork front sprite
 */

/**
 * @typedef {Object} PokemonType
 * @property {number} slot - Type slot
 * @property {Object} type - Type information
 * @property {string} type.name - Type name
 */

/**
 * @typedef {Object} PokemonAbility
 * @property {boolean} is_hidden - Whether ability is hidden
 * @property {number} slot - Ability slot
 * @property {Object} ability - Ability information
 * @property {string} ability.name - Ability name
 */

/**
 * @typedef {Object} PokemonStat
 * @property {number} base_stat - Base stat value
 * @property {number} effort - Effort value
 * @property {Object} stat - Stat information
 * @property {string} stat.name - Stat name
 */

/**
 * Axios client instance configured for PokeAPI
 * @type {import('axios').AxiosInstance}
 */
const apiClient = axios.create({
    baseURL: `${process.env.POKEAPI_BASE_URL}/pokemon`,
    method: "GET",
    timeout: 10000, // 10 seconds timeout
    headers: {
        "User-Agent": "PokiFinder/1.0.0",
    },
});

/**
 * @function createPokemonApiClient
 * @returns {function(Object): Promise<import('axios').AxiosResponse>}
 * @throws {Error}
 * @example
 */
function createPokemonApiClient() {
    if (!process.env.POKEAPI_BASE_URL) {
        throw new Error("POKEAPI_BASE_URL environment variable is required");
    }

    /**
     * @type {Object}
     * @property {number} limit
     */
    const defaultParams = {
        limit: 10000,
    };

    return {
        /**
         * @async
         * @function getList
         * @param {Object} [params={}]
         * @param {number} [params.offset]
         * @param {number} [params.limit]
         * @returns {Promise<import('axios').AxiosResponse<PokemonListResponse>>}
         * @throws {import('axios').AxiosError}
         */
        getList: (params = {}) =>
            apiClient.get("/", {
                params: { ...defaultParams, ...params },
            }),

        /**
         * @async
         * @function getByName
         * @param {string} name
         * @returns {Promise<import('axios').AxiosResponse<PokemonDetailResponse>>}
         * @throws {import('axios').AxiosError}
         */
        getByName: (name) => apiClient.get(`/${name.toLowerCase()}`),
    };
}

module.exports = createPokemonApiClient;
