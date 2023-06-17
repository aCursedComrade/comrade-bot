import axios from 'axios';
import { randomObj } from './util.js';

/**
 * @returns {Promise<Object|undefined>} Meme URL
 */
export async function get_reddit() {
    // const subs = ['memes', 'meme', 'dankmemes', 'Animemes', 'Funnymemes'];
    return await axios.get('https://www.reddit.com/r/dankmemes/hot.json', {
        params: {
            g: 'GLOBAL',
            show: 'all',
            limit: 30,
        },
        headers: {
            'User-Agent': 'Comrade Bot',
        },
    }).then((res) => {
        const posts = res.data.data.children.map((post) => {
            if (post.data.post_hint == 'image') {
                return post.data;
            }
        }).filter((post) => !!post);
        return posts[randomObj(posts)];
    }).catch(e => {
        console.error(e.message);
        return undefined;
    });
}
