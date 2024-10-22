// Import Verax SDK 
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
// Import the contribution schema
import { schema } from './schemata/contribute.js';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Set up provider (using Infura and environment variables)
const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

// Use your private key from the .env file
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Create an instance of the Verax SDK, using your connected wallet as the signer
const veraxSdk = new VeraxSdk({ signer: wallet, provider });

async function registerSchema() {
  try {
    const response = await veraxSdk.schema.create(
      schema.name,
      schema.description,
      schema.context,
      schema.schemaString
    );
    console.log(`Schema registered! Transaction ID: ${response.txId}`);

    const schemaId = await veraxSdk.schema.getIdFromSchemaString(schema.schemaString);
    console.log(`Schema ID: ${schemaId}`);
    
  } catch (error) {
    console.error(`Failed to register schema: ${error.message}`);
  }
}

registerSchema();
