import hardhat, { ethers } from "hardhat";
import { expandTo18Decimals } from "./shared/utils/number";

async function main() {
  console.log("deploy start");

  const emitPerBlock = expandTo18Decimals(1);
  const startBlock = (await ethers.provider.getBlockNumber()) + 10;

  const NabeEmitter = await hardhat.ethers.getContractFactory("NabeEmitter");
  const nabeEmitter = await NabeEmitter.deploy(emitPerBlock, startBlock);
  console.log(`NabeEmitter address: ${nabeEmitter.address}`);
  console.log(`emitPerBlock: ${emitPerBlock.toString()}`);
  console.log(`startBlock: ${startBlock}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
