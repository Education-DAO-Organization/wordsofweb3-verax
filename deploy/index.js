import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import dotenv from "dotenv";
import { Interface } from "ethers";

// Allow access to .env file
dotenv.config();

// Initialize the Verax SDK with the default configuration for Linea Sepolia
const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA, process.env.WALLET_PUBLIC_KEY, process.env.WALLET_KEY); // Pass the public and private keys

// Function to deploy a default portal
async function deployDefaultPortal() {
  try {
    const portalName = "ExamplePortal";
    const portalDescription = "This Portal is used as an example";
    const isRevocable = true;
    const ownerName = "Verax";

    const { logs } = await veraxSdk.portal.deployDefaultPortal(
      [],
      portalName,
      portalDescription,
      isRevocable,
      ownerName,
      true
    );

    const eventAbi =       "event PortalRegistered(string name, string description, address portalAddress)";
    const iface = new Interface([eventAbi]);
    const eventTopic = "0x2b7df910f1bbb7a5c5b32de79907b6445d28b219a71bcb754b46d8d225d27e86"; // PortalRegistered event topic
    const portalLogs = logs.filter(log => log.topics[0] === eventTopic);
    const decodedLogs = iface.decodeEventLog("PortalRegistered", portalLogs[0].data, portalLogs[0].topics);
    const portalAddress = decodedLogs[2];

    console.log(`Default Portal deployed at address: ${portalAddress}`);
    return portalAddress; // Return the portal address for further use
  } catch (error) {
    console.error(`Failed to deploy default portal: ${error.message}`);
  }
}

// Function to deploy a new schema
async function deployNewSchema(portalAddress) {
  const schemaPayload = {
    name: "wordsofweb3 contribution",
    description: "Schema for contributions to wordsofweb3.eth.limo",
    context: "https://wordsofweb3.eth.limo", // Link to the shared vocabulary or ontology
    schemaString: "(string term, string phonetic, string partOfSpeech, string category, string definition, string comments, address submitter)"
  };

  try {
    // Log the portal address for confirmation
    console.log(`Deploying schema under portal: ${portalAddress}`);

    // Create the new schema and wait for transaction validation
    const { transactionHash, logs } = await veraxSdk.schema.create(
      schemaPayload.name,
      schemaPayload.description,
      schemaPayload.context,
      schemaPayload.schemaString,
      true // Wait for transaction validation
    );

    console.log(`Schema registration transaction sent. TX Hash: ${transactionHash}`);
    const newSchemaId = logs[0].topics[1];
    console.log(`Schema registered with ID: ${newSchemaId} under portal: ${portalAddress}`);
  } catch (error) {
    console.error(`Failed to create schema: ${error.message}`);
  }
}

// Main function to deploy portal and schema
async function main() {
  const portalAddress = await deployDefaultPortal();
  if (portalAddress) {
    await deployNewSchema(portalAddress);
  }
}

// Call the main function
main();
