const path = require('path');

function getRoutes(req, res) {
  res.sendFile(path.join(__dirname, 'routes.html'));
}

module.exports = {
  getRoutes
}