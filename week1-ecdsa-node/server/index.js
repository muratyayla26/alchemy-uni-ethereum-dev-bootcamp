const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const JSONbig = require("json-bigint")({ useNativeBigInt: true });
const { verifySign } = require("./sign.helper");

app.use(cors());
app.use(express.json());

const balances = {
  "021a4e004417f6b6b2a8ffb0f3c9ba569f59a00c31f75af180335a6bf7e3de0d0d": 100,
  "03797fc16ad33f29bbf884e3990fdfc396088c9403ec3137e3782b8b73d66a8338": 50,
  "02adb9d1ba8412659a9098e0fd8c94a1b34baf4ddb53662aa179a91f567dc4e353": 25,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, message, signature } = req.body;
  const { recipient, amount } = message;
  const signatureParsed = JSONbig.parse(signature);

  const isValidSign = verifySign(signatureParsed, message, sender);

  if (!isValidSign) {
    res.status(400).send({ message: "Signature is not valid" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

