import axios from 'axios';

async function get_dadjoke() {
  let out = '';
  const response = await axios.get('https://icanhazdadjoke.com/', {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'My Bot (https://github.com/aCursedComrade/Comrade-Bot)',
    },
  });

  response.data?.joke ? out = response.data.joke : out = 'Something went wrong :(\nTry again?';
  return out;
}

export default get_dadjoke;
