pragma solidity >=0.6.5 <0.9.0;

// SPDX-License-Identifier: MIT

abstract contract BotPrevent {

    function protect( address sender, address receiver, uint256 amount ) external virtual;

}