const Web3 = require('web3').Web3;
const contractAbi = require('./NFT.json');
console.log(Web3)

// Create a web3 instance
const web3 = new Web3("https://celo-alfajores.infura.io/v3/0b80f6297319413b8125f1a1341ae5c7");

// Set up the contract address and account information
const contractAddress = '0x7023096aF1c13eDd4b4e5111EE462407d54173A6'; // Replace with your contract address
const privateKey = 'key'; // Replace with your private key

// Create an instance of the contract using the ABI and address
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Function to call the safeMint function
async function callSafeMint() {
  try {
    // Get the account address from the private key
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const { address } = account;

    // Estimate the gas required for the transaction
    const gasEstimate = await contract.methods.safeMint(
      address,
      ""
    ).estimateGas({ from: address });

    // Build the transaction object
    console.log("Using gas: ", gasEstimate)

    const gasPrice = web3.utils.fromWei(await web3.eth.getGasPrice(), 'wei');

    const txObject = {
      from: address,
      to: contractAddress,
      gas: gasEstimate,
      gasPrice,
      data: contract.methods.safeMint(
        address,
        ""
      ).encodeABI()
    };

    // Sign the transaction with the private key
    console.log("Signing transaction with private key");
    const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

    // Send the signed transaction
    console.log("Sending transaction");
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log('Transaction receipt:', receipt);
  } catch (error) {
    console.error('Error calling safeMint:', error);
  }
}

// Call the function to execute the transaction
callSafeMint();

