// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract KryptaFlowToken {
    string public constant name = "KryptaFlow Token";
    string public constant symbol = "KFL";
    uint8 public constant decimals = 18;

    uint256 public totalSupply;
    address public immutable owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256) public lastClaimAt;

    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;
    // Initial supply minted to the deployer (treasury). Remaining supply stays mintable,
    // so faucet + future distributions can work while keeping a hard cap at MAX_SUPPLY.
    uint256 public constant INITIAL_SUPPLY = 600_000_000 * 10 ** 18;
    uint256 public constant CLAIM_AMOUNT = 100 * 10 ** 18;
    uint256 public constant CLAIM_COOLDOWN_SECONDS = 60;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    error NotOwner();
    error InsufficientBalance();
    error InsufficientAllowance();
    error ZeroAddress();
    error ClaimTooSoon(uint256 nextAllowedAt);
    error MaxSupplyExceeded();

    constructor() {
        owner = msg.sender;
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function remainingMintableSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transfer(address to, uint256 value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed < value) revert InsufficientAllowance();
        if (allowed != type(uint256).max) {
            allowance[from][msg.sender] = allowed - value;
            emit Approval(from, msg.sender, allowance[from][msg.sender]);
        }
        _transfer(from, to, value);
        return true;
    }

    function mint(address to, uint256 value) external returns (bool) {
        if (msg.sender != owner) revert NotOwner();
        _mint(to, value);
        return true;
    }

    function claim() external returns (bool) {
        uint256 last = lastClaimAt[msg.sender];
        if (last != 0 && block.timestamp < last + CLAIM_COOLDOWN_SECONDS) {
            revert ClaimTooSoon(last + CLAIM_COOLDOWN_SECONDS);
        }
        lastClaimAt[msg.sender] = block.timestamp;
        _mint(msg.sender, CLAIM_AMOUNT);
        return true;
    }

    function _mint(address to, uint256 value) internal {
        if (to == address(0)) revert ZeroAddress();
        if (totalSupply + value > MAX_SUPPLY) revert MaxSupplyExceeded();
        totalSupply += value;
        balanceOf[to] += value;
        emit Transfer(address(0), to, value);
    }

    function _transfer(address from, address to, uint256 value) internal {
        if (to == address(0)) revert ZeroAddress();
        uint256 bal = balanceOf[from];
        if (bal < value) revert InsufficientBalance();
        unchecked {
            balanceOf[from] = bal - value;
            balanceOf[to] += value;
        }
        emit Transfer(from, to, value);
    }
}

