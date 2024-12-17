import { SiweMessage } from 'https://cdn.jsdelivr.net/npm/siwe@latest/dist/siwe.umd.js';

const scheme = window.location.protocol.slice(0, -1);
const domain = window.location.host;
const origin = window.location.origin;
let provider;
let signer;
let veraxSdk;

// Initialize the provider
const initializeProvider = () => {
    console.log("Checking for Ethereum provider...");
    console.log("window.ethereum:", window.ethereum); // Log the provider

    if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        console.log("Ethereum provider found");
    } else {
        console.error("Please install MetaMask!");
        alert("MetaMask is not installed. Please install it to use this application.");
    }
};

// Create SIWE message
function createSiweMessage(address, statement) {
    const message = new SiweMessage({
        scheme,
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: '1'
    });
    return message.prepareMessage();
}

// Sign in with Ethereum
async function signInWithEthereum() {
    try {
        if (!provider) {
            console.error("Provider is not initialized. Please check MetaMask installation.");
            return;
        }
        signer = await provider.getSigner();
        const address = await signer.getAddress();
        const message = createSiweMessage(address, 'Sign in with Ethereum to the app.');
        const signature = await signer.signMessage(message);
        console.log(`Signed message: ${signature}`);
        document.getElementById('submitAttestation').disabled = false; // Enable the submit button after signing
    } catch (error) {
        console.error(`Failed to sign in with Ethereum: ${error.message}`);
    }
}

// Submit attestation
document.getElementById('submitAttestation').onclick = async () => {
    try {
        veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA, process.env.WALLET_PUBLIC_KEY, process.env.WALLET_KEY);
        
        const attestationData = {
            term: document.getElementById('term').value,
            phonetic: document.getElementById('phonetic').value,
            partOfSpeech: document.getElementById('partOfSpeech').value,
            category: document.getElementById('category').value,
            definition: document.getElementById('definition').value,
            comments: document.getElementById('comments').value,
            submitter: await signer.getAddress()
        };

        console.log("Submitting attestation:", attestationData);

        // Submit the attestation
        const tx = await veraxSdk.schema.submitAttestation(attestationData);
        console.log(`Attestation submitted. TX Hash: ${tx.transactionHash}`);
    } catch (error) {
        console.error(`Failed to submit attestation: ${error.message}`);
    }
};

// Button event listeners
document.getElementById('siweBtn').onclick = signInWithEthereum;

// Initialize provider on page load
window.onload = initializeProvider;
