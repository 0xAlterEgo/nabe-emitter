import { expect } from "chai";
import { waffle } from "hardhat";
import NabeArtifact from "../artifacts/contracts/Nabe.sol/Nabe.json";
import NabeEmitterArtifact from "../artifacts/contracts/NabeEmitter.sol/NabeEmitter.json";
import { Nabe } from "../typechain";
import { NabeEmitter } from "../typechain/NabeEmitter";
import { mine } from "./shared/utils/blockchain";
import { expandTo18Decimals } from "./shared/utils/number";

const { deployContract } = waffle;

describe("NabeEmitter", () => {

    let nabe: Nabe;
    let emitter: NabeEmitter;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    beforeEach(async () => {

        nabe = await deployContract(
            admin,
            NabeArtifact,
        ) as Nabe;

        emitter = await deployContract(
            admin,
            NabeEmitterArtifact,
            [nabe.address, 100, (await provider.getBlockNumber()) + 100]
        ) as NabeEmitter;
        
        await nabe.setEmitter(emitter.address);
    })

    context("new Emitter", async () => {
        it("add", async () => {

            await expect(emitter.add(admin.address, 100))
                .to.emit(emitter, "Add")
                .withArgs(admin.address, 100)

            await mine(96)
            await emitter.updatePool(0);
            expect(await nabe.balanceOf(admin.address)).to.equal(expandTo18Decimals(3000))

            await emitter.updatePool(0);
            expect(await nabe.balanceOf(admin.address)).to.equal(expandTo18Decimals(3000).add(100))

            await mine(3)
            await emitter.updatePool(0);
            expect(await nabe.balanceOf(admin.address)).to.equal(expandTo18Decimals(3000).add(500))
        });

        it("add twice", async () => {

            await emitter.add(admin.address, 100);
            await emitter.add(other.address, 100);

            await mine(95)
            await emitter.updatePool(0);
            expect(await nabe.balanceOf(admin.address)).to.equal(expandTo18Decimals(3000))

            await emitter.updatePool(0);
            expect(await nabe.balanceOf(admin.address)).to.equal(expandTo18Decimals(3000).add(50))

            await mine(3)
            await emitter.updatePool(0);
            expect(await nabe.balanceOf(admin.address)).to.equal(expandTo18Decimals(3000).add(250))
        });

        it("set", async () => {

            await emitter.add(admin.address, 100);
            await emitter.add(other.address, 100);

            await mine(95)
            await emitter.updatePool(0);
            expect(await nabe.balanceOf(admin.address)).to.equal(expandTo18Decimals(3000))

            await emitter.updatePool(0);
            expect(await nabe.balanceOf(admin.address)).to.equal(expandTo18Decimals(3000).add(50))

            await expect(emitter.set(1, 200))
                .to.emit(emitter, "Set")
                .withArgs(1, 200)

            await mine(2)
            await emitter.updatePool(0);
            expect(await nabe.balanceOf(admin.address)).to.equal(expandTo18Decimals(3000).add(200))
        });
    })
})