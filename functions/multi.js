import axios from 'axios';

/**
 * @param {String} url
 * @returns {Promise<String>} URL
 */
export async function lengthen(url) {
  let out = '';
  try {
    const response = await axios.head(url);
    out = response.request.res.responseUrl;
  }
  catch (error) {
    out = 'That was an invalid URL or a server-side error, please try again.';
  }

  return out;
}

export function randomObj(object) {
  return Math.floor(Math.random() * object.length);
}
