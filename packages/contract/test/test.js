const hre = require("hardhat");
const { expect } = require("chai");

describe("Generative-NFT", () => {
  it("mint is succeeded", async () => {
    const baseTokenURI = process.env.BASE_TOKEN_URI;
    const [owner] = await hre.ethers.getSigners();
    const contractFactory = await hre.ethers.getContractFactory(
      "NFTCollectible"
    );
    const contract = await contractFactory.deploy(baseTokenURI);
    await contract.deployed();

    const txn = await contract.reserveNFTs();
    await txn.wait();
    const tokens = await contract.tokensOfOwner(owner.address);
    expect(tokens.length).to.equal(10);

    const tnx2 = await contract.mintNFTs(3, {
      value: hre.ethers.utils.parseEther("0.03"),
    });
    await tnx2.wait();
    const tokens2 = await contract.tokensOfOwner(owner.address);
    expect(tokens2.length).to.equal(13);
  });
});
