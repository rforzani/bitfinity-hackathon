export const cloudPath = "http://localhost:8080";
export const chainId = 355113;
export const contract = "0xDcd11970405Cb18a1645C57941b2C79aA5F1d610";
export const contractAbi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "string",
                "name": "title",
                "type": "string"
            }
        ],
        "name": "CompetitionCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "competitions",
        "outputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "submissionLimit",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "prize",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "winner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "enum Competitions.CompetitionStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "submissionLimit",
                "type": "uint256"
            }
        ],
        "name": "createCompetition",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "competitionId",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "winner",
                "type": "address"
            }
        ],
        "name": "pickWinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "competitionId",
                "type": "uint256"
            }
        ],
        "name": "submitWork",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];