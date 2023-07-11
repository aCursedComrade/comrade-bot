import axios from 'axios';
import { randomObj } from './util.js';

/**
 * @returns {Promise<Object|undefined>} Meme URL
 */
export async function get_reddit() {
    // const subs = ['memes', 'meme', 'dankmemes', 'Animemes', 'Funnymemes'];
    return await axios
        .get('https://www.reddit.com/r/dankmemes/hot.json', {
            params: {
                g: 'GLOBAL',
                show: 'all',
                limit: 30,
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0 Bot',
                Accept: 'application/json',
                'Upgrade-Insecure-Requests': '1',
                Referer: 'https://www.google.com',
            },
        })
        .then((res) => {
            const posts = res.data.data.children
                .map((post) => {
                    if (post.data.post_hint == 'image') {
                        return post.data;
                    }
                })
                .filter((post) => !!post);
            return posts[randomObj(posts)];
        })
        .catch((e) => {
            console.error(e.message);
            return undefined;
        });
}
