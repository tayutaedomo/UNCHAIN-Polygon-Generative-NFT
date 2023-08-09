async function main() {
  const baseTokenURI = process.env.BASE_TOKEN_URI;
  const [owner] = await ethers.getSigners();
  const contractFactory = await ethers.getContractFactory("NFTCollectible");
  const contract = await contractFactory.deploy(baseTokenURI);
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);

  const txn = await contract.reserveNFTs();
  await txn.wait();
  console.log("10 NFTs have been reserved");

  const txn2 = await contract.mintNFTs(3, {
    value: hre.ethers.utils.parseEther("0.003"),
  });
  await txn2.wait();

  const tokens = await contract.tokensOfOwner(owner.address);
  console.log("Owner has tokens:", tokens);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
