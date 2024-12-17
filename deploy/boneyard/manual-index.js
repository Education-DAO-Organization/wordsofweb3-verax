import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import dotenv from 'dotenv';

dotenv.config();

// Use the default configuration for Linea Sepolia

new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA, process.env.WALLET_PUBLIC_KEY, process.env.WALLET_KEY)

// Schema string and metadata
const SCHEMA = '(string term, string phonetic, string partOfSpeech, string category, string definition, string comments, address submitter)';
const schemaDetails = {
    name: "Words of Web3 Contribution",
    description: "Schema for contributions to wordsofweb3.eth.limo",
    context: "https://wordsofweb3.eth.limo",
    schemaString: SCHEMA
};

async function registerSchema() {
    try {
        console.log("Step 1: Precomputing schema ID from schema string...");

        // Precompute the schema ID for informational purposes
        const schemaId = await veraxSdk.schema.getIdFromSchemaString(SCHEMA);
        console.log(`Precomputed Schema ID: ${schemaId}`);

        console.log("Schema details:", schemaDetails);

        console.log("Step 2: Creating schema...");
        const createSchemaTxHash = await veraxSdk.schema.create(
            schemaDetails.name,
            schemaDetails.description,
            schemaDetails.context,
            schemaDetails.schemaString
        );

        console.log(`Schema registration transaction sent. TX Hash: ${createSchemaTxHash}`);

        // Wait for transaction confirmation
        const schemaReceipt = await veraxSdk.utils.waitForTransactionReceipt(createSchemaTxHash);
        const newSchemaId = schemaReceipt.logs[0].topics[1];
        console.log(`Schema registered with ID: ${newSchemaId}`);

        // Proceed to create a Portal
        console.log("Step 3: Deploying default portal...");
        const deployPortalTxHash = await veraxSdk.portal.deployDefaultPortal(
            [],
            "Tutorial Portal",
            "This Portal is used for the tutorial",
            true,
            "Verax Tutorial"
        );

        console.log(`Portal deployment transaction sent. TX Hash: ${deployPortalTxHash}`);

        // Wait for the portal deployment transaction confirmation
        const portalReceipt = await veraxSdk.utils.waitForTransactionReceipt(deployPortalTxHash);
        const decodedLogs = veraxSdk.utils.decodeEventLog({
            abi: veraxSdk.portal.abi,
            eventName: "PortalRegistered",
            receipt: portalReceipt
        });
        const portalId = decodedLogs.args.portalAddress;

        console.log(`Portal deployed with ID: ${portalId}`);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// Execute the registration function
registerSchema();
