import { useState } from "react";
import server from "./server";
import JSONbig from "json-bigint";
import { signMessage } from "./sign.helper";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils.js";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const message = { amount: Number(sendAmount), recipient };
    const signature = await signMessage(message, privateKey);
    const jsonSignature = JSONbig.stringify(signature);

    const transaction = { message, sender: address, signature: jsonSignature };
    try {
      const {
        data: { balance },
      } = await server.post(`send`, transaction);
      setBalance(balance);
    } catch (ex) {
      console.log(ex.response?.data?.message);
    }
  }

  const handleclick = async () => {
    // console.log("privateKey", privateKey);
    // console.log("privateKey toHex", toHex(privateKey));
    // const privateKey = secp256k1.utils.randomPrivateKey();
    // console.log("privateKey", privateKey);
    // console.log("privateKey toHex", toHex(privateKey));
    // console.log("address of private", secp256k1.getPublicKey(privateKey));
    // console.log(
    //   "address of private toHex",
    //   toHex(secp256k1.getPublicKey(privateKey))
    // );
    //   const msgBytes = utf8ToBytes("dsadasdasdas");
    //  keccak256(msgBytes);
    const msgBytes = utf8ToBytes("sadasdas");
    const hashedMsg = keccak256(msgBytes);
    // console.log("utf8ToBytes", msgBytes);
    // console.log("hashed with keccak", keccak256(msgBytes));
    // console.log(
    //   "signed",
    //   secp256k1.sign(
    //     msgBytes,
    //     "b73028a69ae1349b54123201c0d74510c1dae94c1aeca75c5df09d518a6a21a0"
    //   )
    // );
    const mysignature = await secp256k1.sign(
      hashedMsg,
      "b73028a69ae1349b54123201c0d74510c1dae94c1aeca75c5df09d518a6a21a0"
    );
    const myaddress = secp256k1.getPublicKey(
      "b73028a69ae1349b54123201c0d74510c1dae94c1aeca75c5df09d518a6a21a0"
    );
    const myisvalid = secp256k1.verify(mysignature, hashedMsg, myaddress);
    console.log("myisvalid", myisvalid);
  };

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <button type="button" onClick={handleclick}>
        test
      </button>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

