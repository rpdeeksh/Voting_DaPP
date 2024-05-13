export const contractAddress = "your_deployed_contract"
export const abi = [
    {
        inputs: [
            { internalType: "string[]", name: "_candidateNames", type: "string[]" },
            { internalType: "uint256", name: "_hoursAfterVoting", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "_voter", type: "address" },
            { indexed: true, internalType: "uint256", name: "_candidateId", type: "uint256" },
        ],
        name: "Voted",
        type: "event",
    },
    {
        inputs: [],
        name: "canPublishResults",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "candidates",
        outputs: [
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "string", name: "name", type: "string" },
            { internalType: "uint256", name: "voteCount", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllCandidateDetails",
        outputs: [
            { internalType: "uint256[]", name: "", type: "uint256[]" },
            { internalType: "string[]", name: "", type: "string[]" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_candidateId", type: "uint256" }],
        name: "getCandidate",
        outputs: [
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "string", name: "", type: "string" },
            { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getRemainingTime",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "publishResults",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "publishTime",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_candidateId", type: "uint256" }],
        name: "vote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "voters",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
]
