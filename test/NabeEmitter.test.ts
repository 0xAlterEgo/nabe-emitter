import { Contract } from "@ethersproject/contracts";
import { expect } from "chai";
import { waffle } from "hardhat";
import NabeArtifact from "../artifacts/contracts/Nabe.sol/Nabe.json";
import NabeEmitterArtifact from "../artifacts/contracts/NabeEmitter.sol/NabeEmitter.json";
import { Nabe } from "../typechain";
import { NabeEmitter } from "../typechain/NabeEmitter";
import { mine } from "./shared/utils/blockchain";

const { deployContract } = waffle;

describe("NabeEmitter", () => {

    let emitter: NabeEmitter;
    let token: Nabe;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    beforeEach(async () => {

        emitter = await deployContract(
            admin,
            NabeEmitterArtifact,
            [100, (await provider.getBlockNumber()) + 100]
        ) as NabeEmitter;

        token = (new Contract(await emitter.nabe(), NabeArtifact.abi, provider) as Nabe).connect(admin);
    })

    context("new Emitter", async () => {
        it("add", async () => {

            await expect(emitter.add(admin.address, 100))
                .to.emit(emitter, "Add")
                .withArgs(admin.address, 100)

            await mine(96)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(0)

            await mine(1)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(100)

            await mine(3)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(500)
        });

        it("add twice", async () => {

            await emitter.add(admin.address, 100);
            await emitter.add(other.address, 100);

            await mine(95)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(0)

            await mine(1)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(50)

            await mine(3)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(250)
        });

        it("set", async () => {

            await emitter.add(admin.address, 100);
            await emitter.add(other.address, 100);

            await mine(95)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(0)

            await mine(1)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(50)

            await expect(emitter.set(1, 200))
                .to.emit(emitter, "Set")
                .withArgs(1, 200)

            await mine(2)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(200)
        });
    })
})