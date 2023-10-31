const hre = require("hardhat");

async function main() {
  const triggerContract = await hre.ethers.deployContract("TriggerContract");

  await triggerContract.waitForDeployment();
  console.log(
    `triggerContract was deployed to ${await triggerContract.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

