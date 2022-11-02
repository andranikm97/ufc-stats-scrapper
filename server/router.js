const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'routes.html'));
});

router.get('/search_fighter', async (req, res) => {
  const url = "http://ufcstats.com/statistics/fighters/search";
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
            if (!fighter['url']) {
              fighter['url'] = $(anchorTag).attr('href');
              fighter['id'] = fighter['url'].split('/').pop();
            };
          } else {
            const columnValue = $column.text().replace('\n', '').trim();
            fighter[colIndexToProperty[colIndex]] = columnValue === '--' ? '' : columnValue
          }
        }
      });
    }
  })
  res.json(fighters);
});

router.get('/fighter/:id', async (req, res) => {
  const { id: fighterId } = req.params;
  const url = "http://ufcstats.com/fighter-details/" + fighterId;
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);
  const careerStatsContainer = $('.b-list__box-list.b-list__box-list_margin-top');
  const careerStats = {};
  careerStatsContainer.find('li').each((i, el) => {
    let [_, statName, statValue] = el.children;
    statName = $(statName).text().replaceAll('\n', '').trim();
    statValue = $(statValue).text().replaceAll('\n', '').trim()
    if (statName) {
      careerStats[statName] = statValue;
    }
  })
  res.send({ careerStats });
});

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

module.exports = router;