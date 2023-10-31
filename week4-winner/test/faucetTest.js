const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Faucet", function () {
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy({
      value: ethers.parseEther("5"),
    });

    const [owner, otherAccount] = await ethers.getSigners();

    let withdrawAmount = ethers.parseUnits("1", "ether");
    return { faucet, owner, withdrawAmount, otherAccount };
  }

  it("should deploy and set the owner correctly", async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it("should not allow withdrawals above .1 ETH at a time", async function () {
    const { faucet, withdrawAmount } = await loadFixture(
      deployContractAndSetVariables
    );
    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it("should not allow withdrawAll if sender is not owner", async function () {
    const { faucet, otherAccount } = await loadFixture(
      deployContractAndSetVariables
    );
    await expect(faucet.connect(otherAccount).withdrawAll()).to.be.reverted;
  });

  it("should not allow destroyFaucet if sender is not owner", async function () {
    const { faucet, otherAccount } = await loadFixture(
      deployContractAndSetVariables
    );
    await expect(faucet.connect(otherAccount).destroyFaucet()).to.be.reverted;
  });

  it("should send all balance to owner", async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);
    const faucetAddress = await faucet.getAddress();
    const contractBalance = await ethers.provider.getBalance(faucetAddress);

    await expect(faucet.withdrawAll()).to.changeEtherBalances(
      [faucet, owner],
      [-contractBalance, contractBalance]
    );
  });

  it("should selfdestruct successfully", async function () {
    const { faucet } = await loadFixture(deployContractAndSetVariables);
    const faucetAddress = await faucet.getAddress();
    await faucet.destroyFaucet();
    const code = await ethers.provider.getCode(faucetAddress);

    expect(code).to.equal("0x");
  });
});
