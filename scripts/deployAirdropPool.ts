import { BigNumber } from "@ethersproject/bignumber";
import hardhat, { ethers } from "hardhat";

async function main() {
  console.log("deploy start");

  const NabeEmitter = await hardhat.ethers.getContractFactory("NabeEmitter");
  const nabeEmitter = NabeEmitter.attach("0x30c7C748764Eed040377b1cc7D4e10A39C8Fd04B");

  const AirdropPool = await hardhat.ethers.getContractFactory("AirdropPool");
  const airdropPool = await AirdropPool.deploy(nabeEmitter.address, 2);
  await nabeEmitter.add(airdropPool.address, 900);
  await nabeEmitter.set(1, 0);
  console.log(`AirdropPool address: ${airdropPool.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
