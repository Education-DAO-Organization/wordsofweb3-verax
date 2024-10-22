// Import Verax SDK 
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
// Import the contribution schema
import { schema } from './schemata/contribute.js';
import { ethers } from 'ethers';  // For connecting the wallet

// Set up provider (this assumes you have a provider like Infura or Alchemy set up)
const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_PROJECT_ID');

// Use your private key (testnet, don't expose it in production!) or connect with a wallet
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

// Create an instance of the Verax SDK, using your connected wallet as the signer
const veraxSdk = new VeraxSdk({ signer: wallet, provider });

async function registerSchema() {
  try {
    // Register the schema
    const response = await veraxSdk.schema.create(
      schema.name,
      schema.description,
      schema.context,
      schema.schemaString
    );
    console.log(`Schema registered! Transaction ID: ${response.txId}`);

    // Optional: Get schema ID from schema string
    const schemaId = await veraxSdk.schema.getIdFromSchemaString(schema.schemaString);
    console.log(`Schema ID: ${schemaId}`);

    // Now create an attestation (this would typically be done after user submission)
    await createAttestation(schemaId);
    
  } catch (error) {
    console.error(`Failed to register schema: ${error.message}`);
  }
}

async function createAttestation(schemaId) {
  try {
    const attestationPayload = {
      schemaId: schemaId,  // Use the registered schema ID
      expirationDate: Math.floor(Date.now() / 1000) + 31536000,  // 1 year expiration
      subject: wallet.address,  // Use the contributor's wallet address
      attestationData: [{
        term: "decentralization",
        phonetic: "/dɪˌsɛntrəlɪˈzeɪʃən/",
        partOfSpeech: "noun",
        category: "blockchain",
        definition: "The process of distributing control...",
        comments: "This term is fundamental to web3...",
        submitter: wallet.address
      }]
    };

    const response = await veraxSdk.portal.attest(
      "0xYourPortalAddress",  // Replace with your actual portal address
      attestationPayload,
      []  // No validation payloads in this case
    );
    
    console.log(`Attestation created! Transaction ID: ${response.txId}`);
  } catch (error) {
    console.error(`Failed to create attestation: ${error.message}`);
  }
}

// Run the schema registration process when the script is executed
registerSchema();