import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

// Use the wallet's private key from the .env file
const walletKey = process.env.WALLET_KEY;
let walletPublicKey = process.env.WALLET_PUBLIC_KEY;

// Log the wallet key to check for formatting issues
console.log(`Wallet Key: '${walletKey}'`);

// Check the length of the wallet key
if (walletKey.length !== 64) {
  throw new Error("The WALLET_KEY must be a 64-character hexadecimal string.");
}

// Validate the wallet key independently
let wallet;
try {
  wallet = new ethers.Wallet(walletKey);
  console.log(`Validated wallet address: ${wallet.address}`);
} catch (err) {
  console.error("Failed to initialize wallet:", err.message);
  process.exit(1);
}

// Derive public key if not provided
if (!walletPublicKey) {
  walletPublicKey = wallet.address;
  console.log(`Derived Public Key: ${walletPublicKey}`);
}

// Debugging logs
console.log(`Wallet Key (raw): ${walletKey}`);
console.log(`Wallet Public Key: ${walletPublicKey}`);

// Initialize the Verax SDK
const veraxSdk = new VeraxSdk(
  VeraxSdk.DEFAULT_LINEA_SEPOLIA,
  walletPublicKey,
  walletKey // Pass the raw private key string
);

// Schema definition
const schema = {
  name: "Smart Contract Audit Attestation",
  description: "Attestation for a smart contract audit",
  context: "https://example.com/smart-contract-audit",
  schemaString: "{string commitHash, string repoUrl, address contractAddress}"
};

async function registerSchema() {
  try {
    console.log("Step 1: Precomputing schema ID from schema string...");
    const schemaId = await veraxSdk.schema.getIdFromSchemaString(schema.schemaString);
    console.log(`Precomputed Schema ID: ${schemaId}`);

    console.log("Schema details:");
    console.log(`Name: ${schema.name}`);
    console.log(`Description: ${schema.description}`);
    console.log(`Context: ${schema.context}`);
    console.log(`Schema String: ${schema.schemaString}`);

    console.log("Step 2: Creating schema...");
    const { transactionHash, logs } = await veraxSdk.schema.create(
      schema.name,
      schema.description,
      schema.context,
      schema.schemaString,
      true
    );

    console.log(`Schema registration transaction sent. TX Hash: ${transactionHash}`);
    const newSchemaId = logs[0].topics[1];
    console.log(`Schema registered with ID: ${newSchemaId}`);
  } catch (error) {
    console.error(`Failed to register schema: ${error.message}`);
    console.error("Please check your WALLET_KEY and ensure the account has sufficient funds.");
  }
}

// Run the schema registration process
registerSchema();
