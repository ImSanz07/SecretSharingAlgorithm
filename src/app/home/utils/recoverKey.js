let secrets = require("secrets.js");

export const recoverKey = (keyParts) => {
    try {
        const recoveredKey = secrets.combine(keyParts);
        return recoveredKey;
    } catch (error) {
        console.log(`Recovery Error ${error.message}`);
        
        throw new Error(`Recovery failed due to an invalid share (${error.message})`);
    }
}
