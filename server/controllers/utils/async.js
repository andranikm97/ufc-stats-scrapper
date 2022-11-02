const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePage(url, params) {
  const { data } = await axios.get(url, { params });
  return cheerio.load(data);
}
module.exports = {
  scrapePage
}