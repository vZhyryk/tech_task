import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

if (!BACKEND_URL) {
    throw new Error('There is no backend URL');
}

if (!API_KEY) {
    throw new Error('There is no Api key added');
}

/** @type {import('axios').AxiosInstance} */
const apiClient = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'X-API-Key': API_KEY,
    },
});

/**
 * * requestDataFromBackend
 * @param {Object} options
 * @param {string} [options.method='POST']
 * @param {string} [options.endpoint='/pokemon']
 * @param {any} [options.data=null]
 * @param {any} [options.params=null]
 * @returns {Promise<any>}
 */

export async function requestDataFromBackend({ method = 'POST', endpoint = '/pokemon', data = null, params = null } = {}) {
    const config = {
        method,
        url: endpoint,
        params,
        data,
    };

    const response = await apiClient(config);
    return response.data;
}
