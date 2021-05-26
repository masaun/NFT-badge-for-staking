// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("ethers");
const hre = require("hardhat");

const contracts = {
    localOracle: {
        ganache: '0x1cbe1D34901Cb6A9c456C2d78097037A64122c29',
        mumbai: '0x841E6A492eDc0EC6dAB8Cfa0D6173Ad56b8A136c',
        arbitrumTestnet: '0xca581e57726802037fF90cAE23e704b4Bb927C62',
        goerli: '0x697d96F5C2f3DFCC8A0361070f19BE6eFDDEC0f7'
    },
}

function computeTokenId(tokenId) {
    return ethers.BigNumber.from(tokenId).mul(ethers.BigNumber.from(2).pow(128)).add(ethers.BigNumber.from(2).pow(255));
}


async function main() {
    const LocalOracle = await hre.ethers.getContractFactory("LocalOracle");
    const address = contracts.localOracle[hre.network.name];
    const localOracle = await LocalOracle.attach(address);
    await localOracle.deployed();
    console.log("LocalOracle deployed to:", localOracle.address);

    const data = hre.ethers.BigNumber.from(42);
    const tokenId = computeTokenId('213');

    const [account0] = await hre.ethers.getSigners();
    console.log('account0', account0.address);

    localOracle.on('HelpMe', (event) => {
        console.log('Received event HelpMe', JSON.stringify(event))
    });

    const response = await localOracle.helpMe(1, account0.address, tokenId);
    const receipt = await response.wait();
    console.log('receipt', receipt.transactionHash, 'logs', JSON.stringify(receipt.logs));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });