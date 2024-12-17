import { BrowserProvider } from 'ethers';
import { SiweMessage } from 'siwe';

const domain = window.location.host;
const origin = window.location.origin;
const provider = new BrowserProvider(window.ethereum);

function createSiweMessage(address, statement) {
    const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: '1'
    });
    return message.prepareMessage();
}

async function signInWithEthereum() {
    const signer = await provider.getSigner();
    const message = createSiweMessage(signer.address, 'Sign in with Ethereum to the app.');
    console.log(await signer.signMessage(message));
}

document.getElementById('siweBtn').onclick = signInWithEthereum;