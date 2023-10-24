import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { utf8ToBytes } from "ethereum-cryptography/utils.js";

export const hashMessage = (message) => {
  if (typeof message !== "string") {
    message = JSON.stringify(message);
  }
  const msgBytes = utf8ToBytes(message);
  return keccak256(msgBytes);
};

export const signMessage = async (msg, privateKey) => {
  const hashedMsg = hashMessage(msg);
  return secp256k1.sign(hashedMsg, privateKey);
};

// b73028a69ae1349b54123201c0d74510c1dae94c1aeca75c5df09d518a6a21a0
// 021a4e004417f6b6b2a8ffb0f3c9ba569f59a00c31f75af180335a6bf7e3de0d0d

// ea5d0b8c247506468110d7c204ee658171e4664efdee31cb1d3c356493330de4
// 03797fc16ad33f29bbf884e3990fdfc396088c9403ec3137e3782b8b73d66a8338

// faf3dd3514aafea1e6981a63602351a883b972293a5a12de9da13eaaf19d1fd3
// 02adb9d1ba8412659a9098e0fd8c94a1b34baf4ddb53662aa179a91f567dc4e353
