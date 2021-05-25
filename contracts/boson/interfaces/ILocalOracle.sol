// SPDX-License-Identifier: LGPL-3.0-or-later

pragma solidity 0.7.1;

interface ILocalOracle {

    function helpMe(uint256 _quanityRemaining, address _account, uint256 _tokenId) external;

    function helpReceived(uint256 _eventData) external;

    function provideHelp(uint256 _tokenId) external;

}
