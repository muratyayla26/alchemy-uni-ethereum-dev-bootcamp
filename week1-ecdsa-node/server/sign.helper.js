const { keccak256 } = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const hashMessage = (message) => {
  if (typeof message !== "string") {
    message = JSON.stringify(message);
  }
  const msgBytes = utf8ToBytes(message);
  return keccak256(msgBytes);
};

const verifySign = (signature, message, sender) =>
  secp256k1.verify(signature, hashMessage(message), sender);

module.exports = { hashMessage, verifySign };
