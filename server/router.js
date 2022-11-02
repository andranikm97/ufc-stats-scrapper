const express = require('express');
const router = express.Router();
const { getRoutes } = require("./controllers");
const { searchFighter, getFighter } = require("./controllers/fighters");

router.get('/', getRoutes);
router.get('/search_fighter', searchFighter);
router.get('/fighter/:id', getFighter);

module.exports = router;