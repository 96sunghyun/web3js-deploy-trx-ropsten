require("dotenv").config();

const { abi } = require("./abi");
const { bin } = require("./byteCode");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const express = require("express");
const app = express();
const port = 8080;
const Web3 = require("web3");
const { RPC_PROVIDER, PRIVATE_KEY, FROM_ADDRESS, TO_ADDRESS, TOKEN_ADDRESS } =
  process.env;

const provider = new HDWalletProvider(PRIVATE_KEY, RPC_PROVIDER);
const web3 = new Web3(provider);

async function transfer(value) {
  try {
    value = web3.utils.toWei(value);
    const myContract = new web3.eth.Contract(abi, TOKEN_ADDRESS);
    const recipient = await myContract.methods
      .transfer(TO_ADDRESS, value)
      .send({
        from: FROM_ADDRESS,
        gas: 2000000,
        gasPrice: "1000000000000",
      });
    console.log(recipient);
    return recipient;
  } catch (e) {
    console.log(e);
    return e;
  }
}

app.get("/transfer", (req, res) => {
  transfer("30000000").then((result) => {
    res.send(result);
  });
});

app.listen(port, () => {
  console.log("Listening...");
});
