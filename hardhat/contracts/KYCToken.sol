// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KYCToken is ERC20 {
    uint256 public amountFaucet = 1000;
    mapping(address=>uint256) public lastFaucet;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // Mint 100 tokens to msg.sender
        // Similar to how
        // 1 dollar = 100 cents
        // 1 token = 1 * (10 ** decimals)
        _mint(msg.sender, 100 * 10 ** uint(decimals()));
    }

    function faucetToken() public {
        require(lastFaucet[msg.sender]==0 || block.timestamp- lastFaucet[msg.sender]>600 ,"It hasn't been long since you received Faucet.");
        _mint(msg.sender, amountFaucet);
        lastFaucet[msg.sender] = block.timestamp;
    }
}
