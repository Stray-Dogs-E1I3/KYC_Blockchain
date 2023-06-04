const { expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { network } = require("hardhat");

describe("Contract", function () {
  async function deployStaking() {
    /*
      Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
      Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

      Account #1: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 (10000 ETH)
      Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
    */
    const [signer, otherAccount] = await ethers.getSigners();

    const KYCToken = await ethers.getContractFactory("KYCToken");
    const kycToken = await KYCToken.deploy("KYC Token", "KYC");

    const Stake = await ethers.getContractFactory("StakingRewards");
    const stake = await Stake.deploy(kycToken.address, kycToken.address);

    return { signer, otherAccount, stake, kycToken };
  }

  describe("Deploy Contract", async function () {
    it("Should be set the right owner", async function () {
      const { signer, stake } = await deployStaking();

      expect(await stake.owner()).to.be.equal(signer.address);
    });
  });

  describe("Deploy KYC Token", async function () {
    it("Should be mint Token", async function () {
      const { signer, kycToken } = await deployStaking();
      const balance = await kycToken.balanceOf(signer.address);
      console.log(balance);
    });

    it("Should be transfer", async function () {
      const { otherAccount, kycToken } = await deployStaking();
      await kycToken.transfer(otherAccount.address, 555);
      const balance = await kycToken.balanceOf(otherAccount.address);
      console.log(balance);
    });

    it("Should be Faucet", async function () {
      const { otherAccount, kycToken } = await deployStaking();
      await kycToken.connect(otherAccount).faucetToken();
      const balance = await kycToken.balanceOf(otherAccount.address);
      console.log(balance);
    });
  });

  describe("Deploy Staking Reward Contract", async function () {
    it("Should be stake Token", async function () {
      let balance;
      let kycBalance;
      const { signer, kycToken, otherAccount, stake } = await deployStaking();

      await kycToken.approve(stake.address, 10000000);
      await kycToken.transfer(stake.address, 1000000);
      await stake.setRewardsDuration(432000);
      await stake.notifyRewardAmount(1000000);

      await kycToken.connect(otherAccount).faucetToken();
      await kycToken.connect(otherAccount).approve(stake.address, 1000);
      balance = await stake.balanceOf(otherAccount.address);
      console.log(balance);
      await stake.connect(otherAccount).stake(100);
      balance = await stake.balanceOf(otherAccount.address);
      console.log(balance);
      kycBalance = await kycToken.balanceOf(otherAccount.address);
      console.log("kycBalance", kycBalance);
      await network.provider.send("evm_increaseTime", [1100]);
      await network.provider.send("evm_mine");
      await stake.connect(otherAccount).withdraw(50);
      balance = await stake.balanceOf(otherAccount.address);
      await stake.connect(otherAccount).getReward();
      kycBalance = await kycToken.balanceOf(otherAccount.address);
      console.log("kycBalance", kycBalance);
      console.log(balance);
    });

    // it("Should transfer", async function () {
    //   const { otherAccount, stake } = await deployStaking();
    //   await stake.transfer(otherAccount.address, 1000);
    //   const balance = await stake.balanceOf(otherAccount.address);
    // });
  });
});
