document.addEventListener('DOMContentLoaded', () => {
    const contractAddress = '0x22eBb3e8faf00C59D9D3818B335bbF4bA8ab4821';
    const contractABI = [
        // The ABI of your contract goes here
        [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "name": "ReceiptGenerated",
                "type": "event"
            },
            {
                "inputs": [],
                "name": "generateReceipt",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "index",
                        "type": "uint256"
                    }
                ],
                "name": "getReceipt",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getReceiptCount",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "receipts",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
    ];

    let web3;
    let contract;
    let accounts;

    const connectWalletButton = document.getElementById('connectWallet');
    const generateReceiptButton = document.getElementById('generateReceipt');
    const receiptList = document.getElementById('receiptList');

    connectWalletButton.addEventListener('click', async () => {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            try {
                accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                contract = new web3.eth.Contract(contractABI, contractAddress);
                connectWalletButton.disabled = true;
                generateReceiptButton.disabled = false;
                console.log('Wallet connected:', accounts[0]);
            } catch (error) {
                console.error('User denied account access:', error);
            }
        } else {
            alert('No Ethereum browser extension detected. Install MetaMask.');
        }
    });

    generateReceiptButton.addEventListener('click', async () => {
        if (contract && accounts) {
            try {
                await contract.methods.generateReceipt().send({
                    from: accounts[0],
                    value: web3.utils.toWei('0.01', 'ether')
                });
                alert('Receipt generated successfully!');
                loadReceipts();
            } catch (error) {
                console.error('Error generating receipt:', error);
            }
        } else {
            alert('Please connect your wallet first.');
        }
    });

    async function loadReceipts() {
        receiptList.innerHTML = '';
        try {
            const receiptCount = await contract.methods.getReceiptCount().call();
            for (let i = 0; i < receiptCount; i++) {
                const receipt = await contract.methods.getReceipt(i).call();
                const listItem = document.createElement('li');
                listItem.textContent = `Sender: ${receipt[0]}, Amount: ${web3.utils.fromWei(receipt[1], 'ether')} ETH, Timestamp: ${new Date(receipt[2] * 1000).toLocaleString()}`;
                receiptList.appendChild(listItem);
            }
        } catch (error) {
            console.error('Error loading receipts:', error);
        }
    }
});