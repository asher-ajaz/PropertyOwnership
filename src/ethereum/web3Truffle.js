const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const networkProvider = require('./config/networkProvider.json');
const mnemonic = require('./config/mnemonic.json');

// source: https://www.npmjs.com/package/@truffle/hdwallet-provider
const hdWalletProvider = new HDWalletProvider({
  mnemonic: { phrase: mnemonic.phrase },
  providerOrUrl: networkProvider.URL
});

module.exports = new Web3(hdWalletProvider);