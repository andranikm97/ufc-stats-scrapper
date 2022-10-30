const express = require('express');
const cors = require('cors');
const app = express();
const router = require("./router");

app.use(cors());
app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Actively listnening on port ${port}`);
});