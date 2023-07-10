const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello animal toys");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
