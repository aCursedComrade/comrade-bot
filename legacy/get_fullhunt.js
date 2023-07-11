import axios from 'axios';
import 'dotenv/config';

async function get_fullhunt(method, target) {
    const basePath = 'https://fullhunt.io/api/v1';
    let response = null;
    switch (method) {
        case 'domain': {
            response = await axios.get(`${basePath}/domain/${target}/details`, {
                headers: {
                    'X-API-Key': `${process.env.FH_API}`,
                },
            });
            break;
        }
        case 'subdomains': {
            response = await axios.get(`${basePath}/domain/${target}/subdomains`, {
                headers: {
                    'X-API-Key': `${process.env.FH_API}`,
                },
            });
            break;
        }
        case 'host': {
            response = await axios.get(`${basePath}/host/${target}`, {
                headers: {
                    'X-API-Key': `${process.env.FH_API}`,
                },
            });
            break;
        }
    }
    return response.data;
}

export default get_fullhunt;
