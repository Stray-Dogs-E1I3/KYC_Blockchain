const { artifacts, ethers } = require("hardhat");
const hardhat = require("hardhat");
const fs = require("fs");

const makeDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

const checkUndefinedContract = (
  name: string,
  contract: any,
  dir: string,
  artifacts: any
) => {
  if (contract === undefined) {
    fs.writeFileSync(
      `${dir}/${name}.json`,
      JSON.stringify({ ...artifacts }, undefined, 4)
    );
    return;
  }
};

const writeFile = (name: string, contract: any, artifact: any, dir: string) => {
  fs.writeFileSync(
    `${dir}/${name}.json`,
    JSON.stringify(
      { contractAddress: contract.address, ...artifact },
      undefined,
      4
    )
  );
};

function saveJsonFilesToClientFolder(name: string, contract: any) {
  const { DIR_NAME } = process.env;
  const eventDir = `${__dirname}/${DIR_NAME}`;

  makeDir(eventDir);

  const contractArtifact = artifacts.readArtifactSync(name);
  checkUndefinedContract(name, contract, eventDir, contractArtifact);
  writeFile(name, contract, contractArtifact, eventDir);
}

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const KYCToken = await ethers.getContractFactory("KYCToken");
  const kycToken = await KYCToken.deploy("KYC Token", "KYC");
  console.log("KYCToken contract address : ", kycToken.address);

  const Stake = await ethers.getContractFactory("StakingRewards");
  const stake = await Stake.deploy(kycToken.address, kycToken.address);
  console.log("Stake contract address : ", stake.address);

  saveJsonFilesToClientFolder("KYCToken", kycToken);
  saveJsonFilesToClientFolder("StakingRewards", stake);

  await kycToken.approve(stake.address, 10000000);
  console.log("approve token");
  await kycToken.transfer(stake.address, 10000000);
  console.log("transfer token");
  await stake.setRewardsDuration(432000);
  console.log("set duration");
  await stake.notifyRewardAmount(1000000);
  console.log("notify reward amount");

  console.log("update json file done");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run --network mumbai scripts/deploy.ts
