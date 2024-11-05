let secrets = require("secrets.js")
const bip39 = require('bip39');
const bs58 = require('bs58');


const stringToHex = (str) => {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex;
};

const hexToString = (hex) => {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
};



export const splitSeed = (seedPhrase) => {
    const hexSeedPhrase = stringToHex(seedPhrase);
    const shares = secrets.share(hexSeedPhrase, 6, 3)   
    // console.log(shares)
    return shares
};

export const recoverSeed = (shares) => {
    // Combine the shares to get the original hex seed phrase
    const hexSeedPhrase = secrets.combine(shares);
    const seedPhrase = hexToString(hexSeedPhrase);
    console.log("Recovered Seed Phrase:", seedPhrase);
    return seedPhrase;
};
