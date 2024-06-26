import { expect } from 'chai';
import { Contract, Wallet } from "zksync-ethers";
import { deployContract, getRichWallets } from '../../deploy/utils';

describe("MyNFT", function () {
  let nftContract: Contract;
  let ownerWallet: Wallet | any; // HardhatEthersSigner
  let recipientWallet: Wallet | any;; // HardhatEthersSigner

  before(async function () {
    const richWallets = await getRichWallets();
    ownerWallet = richWallets[0]
    recipientWallet = richWallets[1]

    nftContract = await deployContract(
      "MyNFT",
      ["MyNFTName", "MNFT", "https://mybaseuri.com/token/"],
      { wallet: ownerWallet, doLog: false }
    );
  });

  it("Should mint a new NFT to the recipient", async function () {
    const tx = await nftContract.mint(recipientWallet.address);
    await tx.wait();
    const balance = await nftContract.balanceOf(recipientWallet.address);
    expect(balance).to.equal(BigInt("1"));
  });

  it("Should have correct token URI after minting", async function () {
    const tokenId = 1; // Assuming the first token minted has ID 1
    const tokenURI = await nftContract.tokenURI(tokenId);
    expect(tokenURI).to.equal("https://mybaseuri.com/token/1");
  });

  it("Should allow owner to mint multiple NFTs", async function () {
    const tx1 = await nftContract.mint(recipientWallet.address);
    await tx1.wait();
    const tx2 = await nftContract.mint(recipientWallet.address);
    await tx2.wait();
    const balance = await nftContract.balanceOf(recipientWallet.address);
    expect(balance).to.equal(BigInt("3")); // 1 initial nft + 2 minted
  });

  it("Should not allow non-owner to mint NFTs", async function () {
    try {
      const tx3 = await (nftContract.connect(recipientWallet) as Contract).mint(recipientWallet.address);
      await tx3.wait();
      expect.fail("Expected mint to revert, but it didn't");
    } catch (error) {
      expect(error.message).to.include("Ownable: caller is not the owner");
    }
  });
});
