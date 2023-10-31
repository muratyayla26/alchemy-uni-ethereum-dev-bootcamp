const hre = require("hardhat");

async function main() {
  const faucet = await hre.ethers.deployContract("Faucet", {
    value: hre.ethers.parseEther("10"),
  });

  await faucet.waitForDeployment();
  console.log(`Faucet was deployed to ${await faucet.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
