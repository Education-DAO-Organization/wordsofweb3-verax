import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import dotenv from "dotenv";

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

    const portalAddress = await veraxSdk.portal.deployDefaultPortal(
      [],
      portalName,
      portalDescription,
      isRevocable,
      ownerName
    );

    console.log(`Default Portal deployed at address: ${portalAddress}`);
    return portalAddress; // Return the portal address for further use
  } catch (error) {
    console.error(`Failed to deploy default portal: ${error.message}`);
  }
}

// Function to deploy a new schema
async function deployNewSchema(portalAddress) {
  const schemaPayload = {
    name: "My New Schema",
    description: "This is a description of my new schema.",
    context: "https://example.com/my-new-schema",
    schemaString: "{string exampleField}",
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
