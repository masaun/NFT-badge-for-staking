// SPDX-License-Identifier: LGPL-3.0-or-later

pragma solidity 0.7.1;

import "./ERC1155ERC721.sol";
import "./interfaces/ILocalOracle.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract LocalOracle is ILocalOracle {

    using SafeMath for uint256;

    // reference for ERC1155ERC721 contract
    ERC1155ERC721 erc1155erc721;

    // the event which will be emitted when help is needed from other blockchains
    event HelpMe(uint256 tokenId);
    // the event which will be emitted once help is received
    event HelpReceived(uint256 indexed tokenId, address indexed owner, uint256 indexed amount);
    // the event which will be emitted once a contract has burned their supply to help and proven 
    // smart contract are indeed very generous
    event ProvideHelp(uint256 eventData);
 
    // set the ERC1155 address
    function setERC1155(address _erc1155) external {
        erc1155erc721 = ERC1155ERC721(_erc1155);
    }

    /**
        function which is callled when ERC115 quantity is burned
     */
    function helpMe(uint256 _quantityRemaining, address _account, uint256 _tokenId) external override {
        if(_quantityRemaining < 2) {
            emit HelpMe(_tokenId);
        }
    }

    /**
    function which is called by an external party to confirm that help is received
    */
    function helpReceived(uint256 _eventData) external override {
        (uint256 tokenId, uint256 quantity) = decodeData(_eventData);
        address owner = retrieveOwner(tokenId);
        erc1155erc721.mint(owner, tokenId, quantity, "");
        emit HelpReceived(tokenId, owner, quantity);
    }

    /**
        function to provide help to a contract in need
     */
    function provideHelp(uint256 _tokenId) external override {

        address owner = retrieveOwner(_tokenId);
        // check quantity
        uint balance = erc1155erc721.balanceOf(owner, _tokenId);
        
        //burn
        if (balance > 2) {
            uint256 helpQuantity = balance.sub(2);
            erc1155erc721.burn(owner, _tokenId, helpQuantity);
            uint256 eventData = encodeData(_tokenId, helpQuantity);
            emit ProvideHelp(eventData);
        }
    }

    function decodeData(uint256 _data) pure internal returns (uint256 tokenId, uint256 quantity) {
        quantity = (2**128 - 1) & _data;
        tokenId = _data.sub(quantity);
    }

    function encodeData(uint256 _tokenId, uint256 _quantity) pure internal returns (uint256) {
        return _tokenId.add(_quantity);
    }

    function retrieveOwner(uint256 _tokenId) internal returns (address) {
        return erc1155erc721.ownerOf(_tokenId);
    }

}
