import CryptoJS from 'crypto-js';

// Function to generate encryption key by concatenating phone number and password
const generateEncryptionKey = (phoneNumber, password) => {
    return CryptoJS.SHA256(phoneNumber + password).toString();  // Using SHA-256 for a consistent key
};

// Encrypt the key part before storing
const storeKeyPartSecurely = (keyPart, phoneNumber, password, index) => {
    const secretKey = generateEncryptionKey(phoneNumber, password); // Generate encryption key
    const encryptedKeyPart = CryptoJS.AES.encrypt(keyPart, secretKey).toString();
    localStorage.setItem(`encryptedKeyPart_${index}`, encryptedKeyPart);  // Store with unique key name
};

// Function to store remaining parts
export const storeRemainingParts = async (keyParts, phoneNumber, password) => {
    try {
        await storeKeyPartSecurely(keyParts[0], phoneNumber, password, 1);
        await storeKeyPartSecurely(keyParts[1], phoneNumber, password, 2);

        console.log(`Stored remaining parts in browser`);

    } catch (error) {
        throw new Error(`Error storing remaining parts: ${error.message}`);
    }
};
