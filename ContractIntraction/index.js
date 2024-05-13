import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const votingContainer = document.getElementById("votingContainer");
const connectButton = document.getElementById("connectButton");
const voteButton = document.getElementById("voteButton");
const resultsDiv = document.getElementById("results");
const countdownDiv = document.getElementById("countdown");
const candidateIdInput = document.getElementById("candidateIdInput");
const getCandidateButton = document.getElementById("getCandidateButton");
const candidateInfoDiv = document.getElementById("candidateInfo");
const intro = document.getElementById("intro");


let signer;
let contract;
let countdownInterval;

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" });
            signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
            contract = new ethers.Contract(contractAddress, abi, signer);
            connectButton.innerHTML = "Connected";
            const hasVoted = await contract.voters(signer.getAddress());
            if(hasVoted){
                voteButton.innerHTML = "You have already voted"
            }
            else {
                voteButton.disabled = false;
            }
            intro.style.display = 'none';
            displayCandidates();
            const remainingTime = await contract.getRemainingTime();
            updateCountdown(remainingTime);
            votingContainer.style.display = "flex"; // Show the container after successful connection
        } catch (error) {
            console.log(error);
        }
    } else {
        connectButton.innerHTML = "Please install MetaMask";
    }
}
async function vote(candidateId) {
    console.log(`Voting for candidate ID: ${candidateId}`);
    if (signer && contract) {
        try {
            const hasVoted = await contract.voters(signer.getAddress());
            if (hasVoted) {
                alert("You have already voted for a candidate.");
            } else {
                const transactionResponse = await contract.vote(candidateId);
                await listenForTransactionMine(transactionResponse);
                alert(`Sucessfuly casted vote to ${candidateId}`);
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        voteButton.innerHTML = "Please connect first";
    }
}

async function displayCandidates() {
    if (contract) {
        try {
            const [ids, names] = await contract.getAllCandidateDetails();
            const candidates = ids.map((id, index) => ({ id, name: names[index] }));

            resultsDiv.innerHTML = "<h3>Candidates:</h3>";
            candidates.forEach((candidate) => {
                resultsDiv.innerHTML += `<div>ID: ${candidate.id}, Name: ${candidate.name}</div>`;
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        resultsDiv.innerHTML = "Please connect first";
    }
}

async function displayCandidateInfo(candidateId) {
    if (contract) {
        try {
            const [id, name, voteCount] = await contract.getCandidate(candidateId);
            const hasVoted = await contract.voters(signer.getAddress());
            if(hasVoted){
            candidateInfoDiv.innerHTML = `<h3>Candidate Info:</h3>
                <div>ID: ${id}, Name: ${name}, Vote Count: ${voteCount}</div>`;}
            else {
                candidateInfoDiv.innerHTML = `<h3>Candidate Info:</h3>
                <div>ID: ${id}, Name: ${name}</div>`;}               
            
        } catch (error) {
            // console.log(error);
            if (error.message.includes("reverted")) {
                const reason = error.message.split("reverted with reason string ")[1];
                console.log("Transaction reverted with reason:", reason);
                candidateInfoDiv.innerHTML = `Invalid Candidate ID`
            } else {
                console.log("Transaction failed:", error.message);
                candidateInfoDiv.innerHTML = `Transaction failed try later`
            }
        }
    } else {
        candidateInfoDiv.innerHTML = "Please connect first";
    }
}

// function startCountdown() {
//     countdownInterval = setInterval(async () => {
//         if (contract) {
//             const remainingTime = await contract.getRemainingTime();
//             if (remainingTime > 0) {
//                 const hours = Math.floor(remainingTime / 3600);
//                 const minutes = Math.floor((remainingTime % 3600) / 60);
//                 const seconds = remainingTime % 60;
//                 countdownDiv.innerHTML = `Remaining Time: ${hours}:${minutes}:${seconds}`;
//             } else {
//                 clearInterval(countdownInterval);
//                 countdownDiv.innerHTML = "Results can now be published!";
//             }
//         } else {
//             clearInterval(countdownInterval);
//             countdownDiv.innerHTML = "Please connect first";
//         }
//     }, 1000); // Update every second
// }

function listenForTransactionMine(transactionResponse) {
    console.log(`Mining ${transactionResponse.hash}`);
    return new Promise((resolve, reject) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations.`
            );
            resolve();
        });
    });
}

connectButton.onclick = connect;
voteButton.onclick = () => {
    const candidateId = parseInt(prompt("Enter the candidate ID you want to vote for:"));
    if (!isNaN(candidateId) && candidateId > 0) {
        vote(candidateId);
    } else {
        alert("Invalid candidate ID. Please enter a valid positive integer.");
    }
};

getCandidateButton.onclick = () => {
    const candidateId = parseInt(candidateIdInput.value);
    if (!isNaN(candidateId) && candidateId > 0) {
        displayCandidateInfo(candidateId);
    } else {
        alert("Invalid candidate ID. Please enter a valid positive integer.");
    }
};
function updateCountdown(timeInSeconds) {
    const countdownElement = document.getElementById("countdown");

    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    countdownElement.textContent = `Countdown: ${hours}h ${minutes}m ${seconds}s`;
    setTimeout(() => {
        if (timeInSeconds > 0) {
            updateCountdown(timeInSeconds - 1);
        }
    }, 1000);
}