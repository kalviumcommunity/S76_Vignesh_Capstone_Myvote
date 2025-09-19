const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const ABI_PATH = path.join(__dirname, 'Voting.abi.json');
const BIN_PATH = path.join(__dirname, 'Voting.bin');

// Helper to load compiled contract artefacts (ABI + bytecode). You need to compile Voting.sol separately
function loadArtifacts() {
  if (!fs.existsSync(ABI_PATH) || !fs.existsSync(BIN_PATH)) {
    throw new Error('Compiled contract artifacts not found. Compile Voting.sol to produce Voting.abi.json and Voting.bin');
  }
  const abi = JSON.parse(fs.readFileSync(ABI_PATH));
  const bin = fs.readFileSync(BIN_PATH).toString();
  return { abi, bin };
}

async function castVoteOnChain({ electionId, voterId, candidate }) {
  const providerUrl = process.env.BLOCKCHAIN_PROVIDER_URL; // e.g., http://127.0.0.1:8545
  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY; // private key of account to send tx
  const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS; // Optional: if predefined

  if (!providerUrl || !privateKey) {
    throw new Error('Blockchain provider URL or private key not configured in env (BLOCKCHAIN_PROVIDER_URL, BLOCKCHAIN_PRIVATE_KEY)');
  }

  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  // If contract address is provided, assume contract is already deployed
  if (contractAddress) {
    const abi = JSON.parse(fs.readFileSync(ABI_PATH));
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    const tx = await contract.castVote(electionId, voterId, candidate, { gasLimit: 300000 });
    const receipt = await tx.wait();
    return { receipt };
  }

  // Otherwise attempt to deploy fresh contract using compiled bin/abi
  const { abi, bin } = loadArtifacts();
  const factory = new ethers.ContractFactory(abi, bin, wallet);
  const contract = await factory.deploy();
  await contract.deployed();
  const tx = await contract.castVote(electionId, voterId, candidate, { gasLimit: 300000 });
  const receipt = await tx.wait();
  return { receipt, contractAddress: contract.address };
}

module.exports = { castVoteOnChain };
