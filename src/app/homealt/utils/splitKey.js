let secrets = require("secrets.js")

export const splitKey = (privateKey) => {
    const shares = secrets.share(privateKey, 5, 3)
    console.log(shares)
    return shares
}