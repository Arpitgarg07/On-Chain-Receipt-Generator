// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OnChainReceiptGenerator {
    // Event to emit when a receipt is generated
    event ReceiptGenerated(address indexed sender, uint256 amount, uint256 timestamp);

    // Struct to store receipt details
    struct Receipt {
        address sender;
        uint256 amount;
        uint256 timestamp;
    }

    // Array to store all receipts
    Receipt[] public receipts;

    // Function to generate a receipt
    function generateReceipt() external payable {
        // Create a new receipt
        Receipt memory newReceipt = Receipt({
            sender: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        });

        // Store the receipt in the array
        receipts.push(newReceipt);

        // Emit the receipt generated event
        emit ReceiptGenerated(msg.sender, msg.value, block.timestamp);
    }

    // Function to get the number of receipts
    function getReceiptCount() external view returns (uint256) {
        return receipts.length;
    }

    // Function to get a specific receipt by index
    function getReceipt(uint256 index) external view returns (address, uint256, uint256) {
        require(index < receipts.length, "Invalid index");
        Receipt memory receipt = receipts[index];
        return (receipt.sender, receipt.amount, receipt.timestamp);
    }
}
