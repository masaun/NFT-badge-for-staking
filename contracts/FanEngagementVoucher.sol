// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.7.1;

import { FanRegister } from "./FanRegister.sol";

contract FanEngagementVoucher {

    FanRegister public fanRegister;

    constructor(FanRegister _fanRegister) public {
        fanRegister = _fanRegister;
    }

    function mintVoucherForHomeTeamFan(bool resultOfGame) public returns (bool) {
        // [Todo]: Retrieve a result of game via Chainlink (in FE)

        // [Todo]: Check whether receiver is a fan (for home team) or not
        address[] memory _fans = _getFans();

        // [Todo]: Mint Voucher for fans of home team
    }


    //------------------
    // Private or internal methods
    //------------------
    function _getFans() internal view returns (address[] memory _fans) {
        return fanRegister.getFans();
    }
    

}
