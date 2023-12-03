import axios from 'axios';

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
                limit: 40,
            },
            headers: {
                'User-Agent': 'Comrade-Bot https://github.com/aCursedComrade/Comrade-Bot',
                Accept: 'application/json',
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
        .catch((e) => {
            console.error(e.message);
            return undefined;
        });
}
