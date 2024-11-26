import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { schema } from './schemata/contribute.js';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

// Define the wallet using the private key from the .env file
const walletKey = process.env.WALLET_KEY;
const wallet = new ethers.Wallet(walletKey);
console.log(`Using wallet address: ${wallet.address}`);

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA, walletKey);

console.log("Full Schema Object:", schema);

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

    // Register the schema on-chain with account
    const txHash = await veraxSdk.schema.create({
      account: wallet.address,
      name: schema.name,
      description: schema.description,
      context: schema.context,
      schemaString: schema.schemaString
    });

    console.log(`Schema registration transaction sent. TX Hash: ${txHash}`);
    
    const receipt = await veraxSdk.utils.waitForTransactionReceipt(txHash);
    console.log("Transaction confirmed:", receipt);

    const newSchemaId = receipt.logs[0].topics[1];
    console.log(`Schema registered with ID: ${newSchemaId}`);

  } catch (error) {
    console.error(`Failed to register schema: ${error.message}`);
    console.error("Please check your WALLET_KEY and ensure the account has sufficient funds.");
  }
}

// Run the schema registration process
registerSchema();
