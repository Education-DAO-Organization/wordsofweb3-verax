import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { schema } from './schemata/contribute.js';
import dotenv from 'dotenv';

dotenv.config();

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA, process.env.WALLET_KEY);

async function registerSchema() {
  try {
    console.log("Step 1: Precomputing schema ID from schema string...");

    // Precompute schema ID for informational purposes only
    const schemaId = await veraxSdk.schema.getIdFromSchemaString(schema.schemaString);
    console.log(`Precomputed Schema ID: ${schemaId}`);

    console.log("Schema details:");
    console.log(`Name: ${schema.name}`);
    console.log(`Description: ${schema.description}`);
    console.log(`Context: ${schema.context}`);
    console.log(`Schema String: ${schema.schemaString}`);

    console.log("Step 2: Creating schema...");

    // Register the schema on-chain
    const txHash = await veraxSdk.schema.create(
      schema.name,
      schema.description,
      schema.context,
      schema.schemaString
    );

    console.log(`Schema registration transaction sent. TX Hash: ${txHash}`);
    
    // Wait for transaction to confirm
    const receipt = await veraxSdk.utils.waitForTransactionReceipt(txHash);
    console.log("Transaction confirmed:", receipt);

    const newSchemaId = receipt.logs[0].topics[1];
    console.log(`Schema registered with ID: ${newSchemaId}`);

  } catch (error) {
    console.error(`Failed to register schema: ${error.message}`);
  }
}

// Run the schema registration process
registerSchema();
