// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Counters } from "@openzeppelin/contracts/utils/Counters.sol";

contract StakingNFTBadgeFor1Year is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(
        address to, 
        string memory tokenURI
    ) public ERC721("Synthetix Staking NFT Badge for 1 year", "SSNB-1Y") {
        mintBadge(to, tokenURI);  // First mint
    }

    function mintBadge(address to, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newBadgeId = _tokenIds.current();
        _mint(to, newBadgeId);
        _setTokenURI(newBadgeId, tokenURI);

        return newBadgeId;
    }
}
