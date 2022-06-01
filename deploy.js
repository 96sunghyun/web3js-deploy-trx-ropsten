require("dotenv").config();

const { abi } = require("./abi");
const { bin } = require("./byteCode");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const express = require("express");
const app = express();
const port = 8080;
const Web3 = require("web3");
const { RPC_PROVIDER, PRIVATE_KEY, FROM_ADDRESS, TO_ADDRESS } = process.env;

const provider = new HDWalletProvider(PRIVATE_KEY, RPC_PROVIDER);
const web3 = new Web3(provider);

async function deployToken() {
  try {
    const myContract = new web3.eth.Contract(abi);
    const gasPrice = await web3.eth.getGasPrice();
    const recipient = await myContract
      .deploy({
        data: "0x" + bin,
        arguments: ["RopstenTestToken", "RTT"],
      })
      .send({
        from: FROM_ADDRESS,
        gas: 2000000,
        gasPrice,
      });
    console.log(recipient);
    return recipient;
  } catch (e) {
    console.log(e);
    return e;
  }
}

app.get("/deploy", (req, res) => {
  deployToken().then((result) => {
    res.send(result);
  });
});

app.listen(port, () => {
  console.log("Listening...");
});
