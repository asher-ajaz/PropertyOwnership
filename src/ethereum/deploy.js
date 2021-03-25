const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const fs = require('fs-extra');
const path = require("path");
const addressesOfDeployedContracts = require("./config/deployedAddress.json");
const networkProvider = require('./config/networkProvider.json');
const mnemonic = require('./config/mnemonic.json');
const compiledContract = require('./build/PropertyOwnership.json');

// source: https://www.npmjs.com/package/@truffle/hdwallet-provider
const hdWalletProvider = new HDWalletProvider({
  mnemonic: { phrase: mnemonic.phrase },
  providerOrUrl: networkProvider.URL
});

const web3 = new Web3(hdWalletProvider);

async function deploy() {
  try {
    const accounts = await web3.eth.getAccounts();
    const fromAccount = accounts[1];

    console.log('Attempting to deploy from account', fromAccount);

    // source https://web3js.readthedocs.io/en/v1.3.4/web3-eth-contract.html?highlight=deploy#deploy
    const contractInstance = new web3.eth.Contract(compiledContract.abi);

    const result = await contractInstance
      .deploy({ data: compiledContract.evm.bytecode.object })
      .send({ gas: '3600000', from: fromAccount });


    addressesOfDeployedContracts.unshift(result.options.address);

    fs.outputJSONSync(
      path.join(__dirname, "config", "deployedAddress.json"),
      addressesOfDeployedContracts,
    );

    console.log('Contract deployed to', result.options.address);
  }
  catch (err) {
    console.log(err);
  }
};

deploy();
