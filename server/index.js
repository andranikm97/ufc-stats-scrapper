const express = require('express');
const app = express();
const cheerio = require('cheerio');
const pretty = require('pretty');
const fetch = require('node-fetch');
const axios = require('axios');
const cors = require('cors');
app.use(cors());
const port = process.env.PORT || 3000;
// const url = "https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3";
const url = "http://ufcstats.com/statistics/fighters/search";
app.get('/', async (req, res) => {
  const { query } = req.query;
  const { data } = await axios.get(url, {
    params: {
      query
    }
  });
  const $ = cheerio.load(data);
  const fighterRows = $('.b-statistics__table-row');
  const fighters = [];

  fighterRows.each((rowIndex, row) => {
    if (rowIndex > 1) {
      const columns = $(row).find('td');
      const fighter = {};
      fighters.push(fighter);
      columns.each((colIndex, column) => {
        const $column = $(column);
        if ($column.html()) {
          const anchorTag = $column.find('a');
          if (anchorTag.length > 0) {
            fighter[colIndexToProperty[colIndex]] = $(anchorTag).text();
          } else {
            const columnValue = $column.text().replace('\n', '').trim();
            fighter[colIndexToProperty[colIndex]] = columnValue === '--' ? '' : columnValue
          }
        }
      });
    }
  })
  res.json({ data: fighters });
});

app.listen(port, () => {
  console.log(`Actively listnening on port ${port}`);
})

const colIndexToProperty = {
  0: 'firstname',
  1: 'lastname',
  2: 'nickname',
  3: 'height',
  4: 'weight',
  5: 'reach',
  6: 'stance',
  7: 'win',
  8: 'loss',
  9: 'draw',
  10: 'belt',
}