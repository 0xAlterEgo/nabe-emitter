import { BigNumber } from "@ethersproject/bignumber";
import hardhat, { ethers } from "hardhat";

async function main() {
  console.log("deploy start");

  const DevFundToken = await hardhat.ethers.getContractFactory("DevFundToken");
  const devFundToken = await DevFundToken.deploy();
  console.log(`DevFundToken address: ${devFundToken.address}`);

  const emitPerBlock = BigNumber.from(1).mul(BigNumber.from(10).pow(16));
  const startBlock = (await ethers.provider.getBlockNumber()) + 450;

  const NabeEmitter = await hardhat.ethers.getContractFactory("NabeEmitter");
  const nabeEmitter = await NabeEmitter.deploy(emitPerBlock, startBlock);
  console.log(`NabeEmitter address: ${nabeEmitter.address}`);
  console.log(`emitPerBlock: ${emitPerBlock.toString()}`);
  console.log(`startBlock: ${startBlock}`);
  
  console.log(`Nabe address: ${await nabeEmitter.nabe()}`);

  const ERC20Staker = await hardhat.ethers.getContractFactory("ERC20Staker");
  const devFundStaker = await ERC20Staker.deploy(nabeEmitter.address, 0, devFundToken.address);
  await nabeEmitter.add(devFundStaker.address, 100);
  console.log(`DevFundStaker address: ${devFundStaker.address}`);

  const BurnPool = await hardhat.ethers.getContractFactory("BurnPool");
  const burnPool = await BurnPool.deploy(nabeEmitter.address, 1);
  await nabeEmitter.add(burnPool.address, 900);
  console.log(`BurnPool address: ${burnPool.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
