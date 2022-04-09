require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: `http://localhost:3000` }));

const fs = require("fs");

app.post("/api/contracts", (req, res) => {
  let contracts = req.body;
  try {
    let abi = {};
    contracts.forEach((contract) => {
      let rawdata = fs.readFileSync(
        `${__dirname}/abis/${contract}.json`,
        "utf8"
      );
      abi[contract] = JSON.parse(rawdata);
    });
    return res.status(200).send({ ...abi });
  } catch (error) {
    return res.status(400).send({ error: { message: "contract not found" } });
  }
});

app.listen(process.env.PORT, () => console.log("Server started..."));
