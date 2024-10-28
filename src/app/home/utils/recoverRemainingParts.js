import CryptoJS from 'crypto-js';

// Function to generate encryption key by concatenating phone number and password
const generateEncryptionKey = (phoneNumber, password) => {
    return CryptoJS.SHA256(phoneNumber + password).toString();
};

// Function to retrieve and decrypt a key part
const retrieveKeyPart = (index, phoneNumber, password) => {
    const secretKey = generateEncryptionKey(phoneNumber, password); // Generate the encryption key
    const encryptedKeyPart = localStorage.getItem(`encryptedKeyPart_${index}`);
    if (!encryptedKeyPart) {
        console.log(`Key part ${index} not found`);
        return null;
    }
    const decryptedKeyPart = CryptoJS.AES.decrypt(encryptedKeyPart, secretKey).toString(CryptoJS.enc.Utf8);
    return decryptedKeyPart;
};


export const recoverRemainingParts = (phoneNumber, password) => {
    try {        
        const part1 = retrieveKeyPart(1, phoneNumber, password);
        const part2 = retrieveKeyPart(2, phoneNumber, password);

        if (!part1 || !part2) {
            throw new Error('Failed to retrieve one or more key parts.');
        }

        return {part1, part2};

    } catch (error) {
        throw new Error(`Error recovering key parts: ${error.message}`);
    }
};
