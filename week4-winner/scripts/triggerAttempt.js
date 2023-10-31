const hre = require("hardhat");

const TRIGGER_CONTRACT_ADDRESS = "0x959F0cf18BAC009635F105D687d8A7E16057b602";
const WINNER_CONTRACT_ADDRESS = "0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502";

async function trigger() {
  const triggerContract = await hre.ethers.getContractAt(
    "TriggerContract",
    TRIGGER_CONTRACT_ADDRESS
  );

  const tx = await triggerContract.callWinner(WINNER_CONTRACT_ADDRESS);

  await tx.wait();
  console.log("tx", tx);
}

trigger().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
