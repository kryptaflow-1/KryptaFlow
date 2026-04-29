// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";

/**
 * @title KryptaFlowToken (KFL)
 * @notice ERC-20 with a fixed max supply (cap), OpenZeppelin-maintained primitives, and two-step ownership transfers.
 * @dev No public faucet / claim minting — that pattern is unsafe on real networks (spam + inflation gaming within cap).
 *      Extra supply after deployment is minted only by `owner()` until `cap()` is reached (typically multisig on mainnet).
 */
contract KryptaFlowToken is ERC20Capped, Ownable2Step {
    uint256 public constant INITIAL_SUPPLY = 600_000_000 * 10 ** 18;

    constructor(address initialTreasury)
        ERC20("KryptaFlow Token", "KFL")
        ERC20Capped(1_000_000_000 * 10 ** 18)
        Ownable(msg.sender)
    {
        require(initialTreasury != address(0), "KFL: zero treasury");
        _mint(initialTreasury, INITIAL_SUPPLY);
    }

    /// @notice Owner-only mint for treasury emissions / incentives until `cap()` is reached.
    function mint(address to, uint256 value) external onlyOwner {
        _mint(to, value);
    }
}
