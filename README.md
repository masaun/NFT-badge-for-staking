# 0xHack - Chainlink on Polygon

***
## 【Introduction of the 0xHack - Chainlink on Polygon】
- This repo is the smart contract that

&nbsp;

***

## 【Workflow】
- Diagram of workflow

&nbsp;

***

## 【Remarks】
- Version
  - Solidity (Solc): v0.6.11
  - Truffle: v5.1.60
  - web3.js: v1.2.9
  - @openzeppelin/contracts: v3.4.0
  - ganache-cli: v6.9.1 (ganache-core: 2.10.2)


&nbsp;

***
## 【Setup】for Hardhat
```
npm run hardhat:node  (<--Instead of ganache-cli)
npm run hardhat-test:boson-x-chain

npm run hardhat-test:boson
```


<br>

## 【Setup】
### ① Install modules
- Install npm modules in the root directory
```
npm install
```

<br>

### ② Compile contracts
- on Polygon (Matic) mumbai testnet
```
npm run compile:polygon_mumbai
```

<br>

## 【Script for demo】on Polygon (Matic) mumbai testnet
- ① Get API-key from Infura  
https://infura.io/


- ② Add `.env` to the root directory.
  - Please reference how to write from `.env.example` . (Please write 3 things below into `.env` )
    - MNEMONIC (Mnemonic)  
    - INFURA_KEY (Infura key)  
    - DEPLOYER_ADDRESS (Deployer address)  
      https://github.com/masaun/Something-on-polygon/blob/main/.env.example

<br>

- ③ In advance, Please check `MATIC token balance` of `executor's wallet address` .
  - Idealy, MATIC tokens balance is more than `1 MATIC` .
  - Matic fancet: https://faucet.matic.network/ (Please select Mumbai network)

<br>

- ③ Execute script on `Polygon (Matic) mumbai testnet`
(※ This script include deployment of smart contracts on Polygon)
```
npm run script:Something
```

<br>

## 【Demo】
- Demo video that script above is executed  
https://youtu.be/nwyNV8b0XyI


<br>

***

## 【References】
- Polygon (Matic)
  - Website: https://polygon.technology/
  - Doc: https://docs.matic.network/docs/develop/getting-started 
  - MATIC fancet：https://faucet.matic.network/
  - Network setting for MetaMask：https://github.com/masaun/tokenized-carbon-credit-marketplace#setup-wallet-by-using-metamask
  - Polygon (Open Defi Hackathon)：https://gitcoin.co/issue/maticnetwork/matic-bounties/20/100025642
