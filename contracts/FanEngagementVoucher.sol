// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.7.1;

import { FanRegister } from "./FanRegister.sol";

contract FanEngagementVoucher {

    FanRegister public fanRegister;

    constructor(FanRegister _fanRegister) public {
        fanRegister = _fanRegister;
    }

    function mintVoucherForFan() public returns (bool) {
        // [Todo]: Check whether receiver is a fan (for home team) or not
        address[] memory _fans = fanRegister.getFans();

        // [Todo]: Retrieve a result of game via Chainlink

    }
    

}
