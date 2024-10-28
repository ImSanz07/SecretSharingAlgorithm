//This function shall generate the keys when passed the password
import 'fast-text-encoding';
import CryptoJS from 'crypto-js';


export const generateKeys = (password:string) => {
    console.log(`Generating key pair...`);
    console.log(`Entered password is: ${password}`);

    const EC = require('elliptic').ec;
    const ec = new EC('secp256k1');
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    let keyPair = ec.keyFromPrivate(hashedPassword);

    const uncompressedPublicKeyHex = keyPair.getPublic().encode('hex');
    const x = uncompressedPublicKeyHex.slice(2, 66);

    // Identify the sign of the Y-coordinate.
    const yIsEven = parseInt(uncompressedPublicKeyHex.slice(-2), 16) % 2 === 0;
    const signByte = yIsEven ? '02' : '03';

    // Generate the compressed public key
    const compressedPublicKeyHex = signByte + x;

    const sk = keyPair.getPrivate('hex');
    const pk = compressedPublicKeyHex;

    return {sk, pk}
} 