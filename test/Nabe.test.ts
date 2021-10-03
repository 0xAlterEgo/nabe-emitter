import { expect } from "chai";
import { ecsign } from "ethereumjs-util";
import { BigNumber, constants } from "ethers";
import { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { waffle } from "hardhat";
import NabeArtifact from "../artifacts/contracts/Nabe.sol/Nabe.json";
import { Nabe } from "../typechain/Nabe";
import { expandTo18Decimals } from "./shared/utils/number";
import { getERC20ApprovalDigest } from "./shared/utils/standard";

const { deployContract } = waffle;

describe("Nabe", () => {
    let nabe: Nabe;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    const name = "Nabe";
    const symbol = "NABE";
    const version = "1";

    beforeEach(async () => {
        nabe = await deployContract(
            admin,
            NabeArtifact,
            []
        ) as Nabe;
    })

    context("new Nabe", async () => {
        it("has given data", async () => {
            expect(await nabe.totalSupply()).to.be.equal(expandTo18Decimals(3000))
            expect(await nabe.name()).to.be.equal(name)
            expect(await nabe.symbol()).to.be.equal(symbol)
            expect(await nabe.decimals()).to.be.equal(18)
            expect(await nabe.version()).to.be.equal(version)
        })

        it("check the deployer balance", async () => {
            expect(await nabe.balanceOf(admin.address)).to.be.equal(expandTo18Decimals(3000))
        })

        it("data for permit", async () => {
            expect(await nabe.DOMAIN_SEPARATOR()).to.eq(
                keccak256(
                    defaultAbiCoder.encode(
                        ["bytes32", "bytes32", "bytes32", "uint256", "address"],
                        [
                            keccak256(
                                toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")
                            ),
                            keccak256(toUtf8Bytes(name)),
                            keccak256(toUtf8Bytes(version)),
                            31337,
                            nabe.address
                        ]
                    )
                )
            )
            expect(await nabe.PERMIT_TYPEHASH()).to.eq(
                keccak256(toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"))
            )
        })

        it("permit", async () => {
            const value = expandTo18Decimals(10)

            const nonce = await nabe.nonces(admin.address)
            const deadline = constants.MaxUint256
            const digest = await getERC20ApprovalDigest(
                nabe,
                { owner: admin.address, spender: other.address, value },
                nonce,
                deadline
            )

            const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(admin.privateKey.slice(2), "hex"))

            await expect(nabe.permit(admin.address, other.address, value, deadline, v, hexlify(r), hexlify(s)))
                .to.emit(nabe, "Approval")
                .withArgs(admin.address, other.address, value)
            expect(await nabe.allowance(admin.address, other.address)).to.eq(value)
            expect(await nabe.nonces(admin.address)).to.eq(BigNumber.from(1))
        })
    })
})