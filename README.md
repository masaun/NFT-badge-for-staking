# NFT Badge for staking

***
## 【Introduction of the NFT Badge for staking】
- This repo is the smart contract for NFT Badge for staking.
  - This smart contract give a staker a NFT depends on staking period (= `vesting period` ) which a staker chose.
    - Staking period that a staker can choose are 3 options: 3 months, 6 months, 1 year)
    - Each NFT works as a `proof of deposit` and represents staking period (= `vesting period` ) which a staker chose.
    - A staker can not unstake until chosen-period. 
      (When a staker try to unstake, smart contract check whether staking period is passed or not by a NFT which a staker has)

<br>

- This smart contract has been deployed on Polygon (mumbai).
  - By deploying on Polygon, a staker can reduce cost for each transactions and get a higher speed transaction.


&nbsp;

***

## 【Workflow】
- Diagram of workflow
![【Diagram】NFT Badge for staking](https://user-images.githubusercontent.com/19357502/120177973-ef667a00-c243-11eb-883d-f2720ff85818.jpg)

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

- ③ In advance, Please check `MATIC token balance` of `executor's (user's) wallet address` .
  - Idealy, MATIC tokens balance is more than `1 MATIC` .
  - Matic fancet: https://faucet.matic.network/ (Please select Mumbai network)

<br>

- ③ Execute script on `Polygon (Matic) mumbai testnet`
(※ This script uses deployed-contract addresses on Polygon mumbai)
```
npm run script:StakingManager
```

<br>

## 【Deployed-contract addresses】
- Smart contract addresses below are deployed on `Polygon mumbai` testnet: 
  - LP Token: 0xCB9e421b1bF2f20E3EEbd3d16A8F44D50B7f56ad
  - Reward Token: 0xD68cE6B14d4E5f8ed28F6eb9b92A63f48FFDc0a7
  - StakingNFTBadgeFor3Months: 0x19bC3A74BB8de091fE4a76af093b031395cE17f2
  - StakingNFTBadgeFor6Months: 0xe5273E5D1bf82e60125968B6C9c3476A70E1FCaF
  - StakingNFTBadgeFor1Year: 0xBF3463C0def89691d765aB95d456402463310Ef3
  - StakingPool: 0xB8faeCcdF3Ce5Dc470720B212b7056113dbA386f
  - StakingManager: 0x404735352a45fc40fb1d10316e037219e1ADe25B
  - Fancet: 0xB786Ee2f65C6fec7568CA565Be9958713Ac24C18

<br>

## 【Demo】
- Demo video that script above is executed  
https://youtu.be/tV8vjcEGEPQ 


<br>

***

## 【References】
- Polygon (Matic)
  - Website: https://polygon.technology/
  - Doc: https://docs.matic.network/docs/develop/getting-started 
  - MATIC fancet：https://faucet.matic.network/
  - Network setting for MetaMask：https://github.com/masaun/tokenized-carbon-credit-marketplace#setup-wallet-by-using-metamask
  - Polygon (Open Defi Hackathon)：https://gitcoin.co/issue/maticnetwork/matic-bounties/20/100025642
