import axios from 'axios';

/**
 * @param {String} url
 * @returns {Promise<String>} URL
 */
export async function lengthen(url) {
    try {
        const response = await axios.head(url);
        return response.request.res.responseUrl;
    } catch (error) {
        return 'That was an invalid URL or a server-side error, please try again.';
    }
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
