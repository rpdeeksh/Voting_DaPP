const ethers = require("ethers");
const fs = require("fs-extra");


async function main() {
    const provider = new ethers.JsonRpcProvider(
      "your_alchemy_rpc_url"
    );

    const wallet = new ethers.Wallet(
      "metamask_private_key",
      provider
    );

    const abi = fs.readFileSync("./output-directory/_voting_sol_VotingSystem.abi", "utf8"); 
    const binary = fs.readFileSync("./output-directory/_voting_sol_VotingSystem.bin", "utf8"); 

    const candidateNames = ["Aniket", "Deekshith", "Mohith"]; // Example candidate names
    const hoursAfterVoting = 10; // Example duration in minutes

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Contract is deploying...");

    const contract = await contractFactory.deploy(candidateNames, hoursAfterVoting);
    const addr1 = await contract.getAddress();
    console.log("Contract deployed at ", addr1);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
