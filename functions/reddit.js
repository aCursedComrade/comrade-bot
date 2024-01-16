import axios from 'axios';

/**
 * @returns {Promise<Object|undefined>} Meme URL
 */
export async function get_reddit() {
    return await axios
        .get('https://www.reddit.com/r/memes/hot.json', {
            params: {
                g: 'GLOBAL',
                show: 'all',
                limit: 48,
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 Gecko/20100101 Firefox/120.0',
                Accept: 'text/html,application/xhtml+xml,application/xml,application/json',
                'Accept-Language': 'en-US,en',
                'Accept-Encoding': 'gzip,deflate,br',
                'Upgrade-Insecure-Requests': 1,
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
            return posts[Math.floor(Math.random() ^ posts.length)];
        })
        .catch((error) => {
            console.error(error.message);
            return undefined;
        });
}
