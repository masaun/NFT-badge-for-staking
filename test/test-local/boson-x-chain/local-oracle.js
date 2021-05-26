// import "@nomiclabs/hardhat-waffle";
const { expect } = require("chai");
const { utils, BigNumber } = require("ethers");
const hre = require("hardhat")
const ethers = hre.ethers;
// import { expect } from "chai";

function computeTokenId(tokenId) {
    return BigNumber.from(tokenId).mul(BigNumber.from(2).pow(128)).add(BigNumber.from(2).pow(255));
}

describe("LocalOracle", async() => {


    let erc1155;
    let localOracle;
    let account0;
    let account1;

    beforeEach(async() => {
        const addresses = await ethers.getSigners();
        [account0, account1] = addresses;
        const LocalOracle = await ethers.getContractFactory("LocalOracle");
        const ERC1155 = await ethers.getContractFactory("ERC1155ERC721")
        erc1155 = await (await ERC1155.deploy()).deployed()
        localOracle = await (await LocalOracle.deploy()).deployed();
        await localOracle.setERC1155(erc1155.address);
        await erc1155.setLocalOracleAddress(localOracle.address)

        // mint token
        const tokenId = computeTokenId('213');
        await erc1155.tmint(account1.address, tokenId, "4", []);

    })


    it("should call helpme and check emitted event", async() => {
        const tokenId = computeTokenId('123456');
        await expect(localOracle.helpMe("1", account1.address, tokenId.toString()))
            .to.be.emit(localOracle, "HelpMe").withArgs(tokenId.toString())
    });

    it("should call provideHelp", async() => {
        const expectedQuantity = 2;
        const tokenId = computeTokenId('213');
        const expectedEventData = tokenId.add(expectedQuantity);
        await expect(localOracle.provideHelp(tokenId.toString())).to.be.emit(localOracle, "ProvideHelp").withArgs(expectedEventData.toString())
    })

    it("should call helpReceived", async() => {
        const expectedQuantity = 2;
        const tokenId = computeTokenId('213');
        const eventData = tokenId.add(expectedQuantity);
        await expect(localOracle.helpReceived(eventData)).to.be.emit(localOracle, "HelpReceived").withArgs(tokenId.toString(), account1.address, expectedQuantity.toString())
    })

    it("should call help me when supply is low", async() => {
        const tokenId = computeTokenId('213');
        await expect(erc1155.tburn(account1.address, tokenId, "3")).to.be.emit(localOracle, "HelpMe").withArgs(tokenId.toString())
    })

    it("should provide help when help can be provided", async() => {
        const expectedQuantity = 3;
        const tokenId = computeTokenId('213');
        const expectedEventData = tokenId.add(expectedQuantity);
        // burn supply
        await expect(erc1155.tburn(account1.address, tokenId, "3")).to.be.emit(localOracle, "HelpMe").withArgs(tokenId.toString())
            // mint 4 more to help
        await erc1155.tmint(account1.address, tokenId, "4", []);
        // initiate provide help
        await expect(localOracle.provideHelp(tokenId)).to.be.emit(localOracle, "ProvideHelp").withArgs(expectedEventData.toString())
            // help received on other chain
        await expect(localOracle.helpReceived(expectedEventData)).to.be.emit(localOracle, "HelpReceived").withArgs(tokenId.toString(), account1.address, expectedQuantity.toString())

    })



});