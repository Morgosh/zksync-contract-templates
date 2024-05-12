import { expect } from 'chai';
import { Contract, Wallet } from "zksync-ethers";
import { deployContract, getRichWallets } from '../../deploy/utils';
import "@nomicfoundation/hardhat-ethers";
import * as ethers from "ethers";

describe("MyERC20Token", function () {
  let tokenContract: Contract;
  let ownerWallet: Wallet | any; // HardhatEthersSigner
  let userWallet: Wallet | any;; // HardhatEthersSigner

  before(async function () {
    const richWallets = await getRichWallets();
    ownerWallet = richWallets[0]
    userWallet = richWallets[1]

    tokenContract = await deployContract("MyERC20Token", [], { wallet: ownerWallet, doLog: false });
  });

  it("Should have correct initial supply", async function () {
    const initialSupply = await tokenContract.totalSupply();
    expect(initialSupply).to.equal(BigInt("1000000000000000000000000")); // 1 million tokens with 18 decimals
  });

  it("Should allow owner to burn tokens", async function () {
    const burnAmount = ethers.parseEther("10"); // Burn 10 tokens
    const tx = await tokenContract.burn(burnAmount);
    await tx.wait();
    const afterBurnSupply = await tokenContract.totalSupply();
    expect(afterBurnSupply).to.equal(BigInt("999990000000000000000000")); // 999,990 tokens remaining
  });

  it("Should allow user to transfer tokens", async function () {
    const transferAmount = ethers.parseEther("50"); // Transfer 50 tokens
    const tx = await tokenContract.transfer(userWallet.address, transferAmount);
    await tx.wait();
    const userBalance = await tokenContract.balanceOf(userWallet.address);
    expect(userBalance).to.equal(transferAmount);
  });

  it("Should fail when user tries to burn more tokens than they have", async function () {
    const userTokenContract = new Contract(await tokenContract.getAddress(), tokenContract.interface, userWallet);
    const burnAmount = ethers.parseEther("100"); // Try to burn 100 tokens
    try {
      await userTokenContract.burn(burnAmount);
      expect.fail("Expected burn to revert, but it didn't");
    } catch (error) {
      expect(error.message).to.include("burn amount exceeds balance");
    }
  });
});

