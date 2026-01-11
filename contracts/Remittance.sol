// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Remittance is Ownable {
    struct Transfer {
        address sender;
        address recipient;
        uint256 amount;         // In Wei (ETH)
        uint256 fxRate;         // e.g., 11345 represents 113.45
        string sourceCurrency;  // e.g., "USD"
        string targetCurrency;  // e.g., "NGN"
        bool withdrawn;
    }

    uint256 public transferCount;
    mapping(uint256 => Transfer) public transfers;
    
    // Compliance Mappings
    mapping(address => bool) public kycVerified;

    event TransferInitiated(
        uint256 indexed transferId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 fxRate,
        string sourceCurrency,
        string targetCurrency
    );

    event Withdrawn(uint256 indexed transferId, address indexed recipient, uint256 amount);
    event KYCStatusUpdated(address indexed user, bool status);

    constructor() Ownable(msg.sender) {}

    modifier onlyVerified() {
        require(kycVerified[msg.sender], "User not KYC verified");
        _;
    }

    /// @notice Admin function to approve/reject KYC
    function setKycStatus(address user, bool status) external onlyOwner {
        kycVerified[user] = status;
        emit KYCStatusUpdated(user, status);
    }

    /// @notice Sends ETH to a recipient wallet (requires KYC)
    function sendRemittance(
        address recipient,
        uint256 fxRate,
        string calldata sourceCurrency,
        string calldata targetCurrency
    ) external payable onlyVerified {
        require(msg.value > 0, "Amount must be > 0");

        // Record transfer
        uint256 id = transferCount++;
        transfers[id] = Transfer({
            sender: msg.sender,
            recipient: recipient,
            amount: msg.value,
            fxRate: fxRate,
            sourceCurrency: sourceCurrency,
            targetCurrency: targetCurrency,
            withdrawn: false
        });

        emit TransferInitiated(id, msg.sender, recipient, msg.value, fxRate, sourceCurrency, targetCurrency);
    }

    /// @notice Allows recipient to withdraw their funds
    function withdraw(uint256 transferId) external {
        Transfer storage t = transfers[transferId];

        require(msg.sender == t.recipient, "Not the recipient");
        require(!t.withdrawn, "Already withdrawn");

        t.withdrawn = true;
        
        // Transfer ETH
        (bool success, ) = payable(t.recipient).call{value: t.amount}("");
        require(success, "Withdrawal failed");

        emit Withdrawn(transferId, t.recipient, t.amount);
    }

    function getTransfer(uint256 transferId) external view returns (Transfer memory) {
        return transfers[transferId];
    }
}