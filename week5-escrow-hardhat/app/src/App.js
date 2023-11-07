import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import EscrowComp from "./Escrow";
import Escrow from "./artifacts/contracts/Escrow.sol/Escrow";

const provider = new ethers.BrowserProvider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

const approveAfterDeploy = async (signer) => {
  const ESCROW_ADDRESS_GOERLI = "0x169A591ce32C8b99A4f7B6d9472092170DDDc029";

  const deployedContract = await new ethers.Contract(
    ESCROW_ADDRESS_GOERLI,
    Escrow.abi,
    signer
  );

  const approveTx = await deployedContract.approve();
  await approveTx.wait();
};

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);
      const _signer = await provider.getSigner();
      setAccount(accounts[0]);
      setSigner(_signer);
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.parseEther(document.getElementById("etherVal").value);

    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on("Approved", () => {
          document.getElementById(escrowContract.address).className =
            "complete";
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Ether)
          <input type="text" id="etherVal" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>
      <div
        className="button"
        onClick={(e) => {
          e.preventDefault();
          approveAfterDeploy(signer);
        }}
      >
        Approve manual
      </div>
      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <EscrowComp key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
