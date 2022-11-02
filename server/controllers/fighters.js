const { scrapePage } = require("./utils/async");

async function searchFighter(req, res) {
  const url = "http://ufcstats.com/statistics/fighters/search";
  const { query } = req.query;
  const $ = await scrapePage(url, { query });
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
};

async function getFighter(req, res) {
  const { id: fighterId } = req.params;
  const url = "http://ufcstats.com/fighter-details/" + fighterId;
  const $ = await scrapePage(url);
  const careerStatsContainer = $('.b-list__box-list.b-list__box-list_margin-top');
  const careerStats = {};
  careerStatsContainer.find('li').each((i, el) => {
    let [_, statName, statValue] = el.children;
    statName = formatText($(statName).text());
    statValue = formatText($(statValue).text());
    if (statName) {
      careerStats[statName] = statValue;
    }
  })

  const fightsContainer = $('table.b-fight-details__table tbody');
  const fights = [];
  fightsContainer.find('tr.b-fight-details__table-row').each((i, row) => {
    const fight = {};
    const columns = $(row).find('td');
    const W_L = $(columns[0]).find('i.b-flag__text').text();
    fight["W/L"] = W_L.toLowerCase() === 'loss' ? 'L' : 'W';
    console.log(W_L);
    const [fighter1, fighter2] = $(columns[1]).find('a');
    fight['fighters'] = [
      {
        name: formatText($(fighter1).text()),
        url: $(fighter1).attr('href'),
        id: $(fighter1).attr('href').split('/').pop()
      },
      {
        name: formatText($(fighter2).text()),
        url: $(fighter2).attr('href'),
        id: $(fighter2).attr('href').split('/').pop()
      }
    ]
    const KD = $(columns[2]);
    const STR = $(columns[3]);
    const TD = $(columns[4]);
    const SUB = $(columns[5]);

    fight['stats'] = {
      [fight['fighters'][0]['id']]: {
        KD: formatText($($(KD).find('p')[0]).text()),
        STR: formatText($($(STR).find('p')[0]).text()),
        TD: formatText($($(TD).find('p')[0]).text()),
        SUB: formatText($($(SUB).find('p')[0]).text()),
      },
      [fight['fighters'][1]['id']]: {
        KD: formatText($($(KD).find('p')[1]).text()),
        STR: formatText($($(STR).find('p')[1]).text()),
        TD: formatText($($(TD).find('p')[1]).text()),
        SUB: formatText($($(SUB).find('p')[1]).text()),
      },
    };

    const event = $(columns[6]);
    const eventLink = $(event).find('p a');
    const eventDate = $(event).find('p').last();
    fight['event'] = {
      header: formatText(eventLink.text()),
      link: eventLink.attr('href'),
      date: formatText($(eventDate).text()),
    }
    const method = $(columns[7]).find('p');
    const methodType = formatText($(method[0]).text());
    const methodDetails = formatText($(method[1]).text())
    fight['method'] = {
      type: methodType,
      details: methodDetails
    }
    const round = $(columns[8]).find('p');
    fight['round'] = formatText($(round[0]).text());
    const time = $(columns[9]).find('p');
    fight['time'] = formatText($(time[0]).text());
    fights.push(fight);
  });

  const physicalStats = $('.b-list__info-box').first();
  const DOBcontainer = $(physicalStats).find('li').toArray().pop();

  let [_, __, statValue] = DOBcontainer.children;
  const DOB = formatText($(statValue).text());
  res.send({ careerStats, fights, DOB });
};

function formatText(text) {
  return text.replaceAll('\n', '').trim();
}

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

module.exports = {
  getFighter,
  searchFighter
};