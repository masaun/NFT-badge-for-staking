// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.7.1;

contract FanRegister {

    address[] public fans;

    constructor() public {}

    function registerAsFan() public returns (bool) {
        fans.push(msg.sender);
    }

    //-----------------
    // Getter methods
    //-----------------
    function getFans() public view returns (address[] memory _fans) {
        return fans;
    }

}
