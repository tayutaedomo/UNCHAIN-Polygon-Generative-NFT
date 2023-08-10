async function main() {
  const baseTokenURI = process.env.BASE_TOKEN_URI;
  const [owner] = await hre.ethers.getSigners();
  const contractFactory = await hre.ethers.getContractFactory("NFTCollectible");
  const contract = await contractFactory.deploy(baseTokenURI);
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);

  const tokens = await contract.tokensOfOwner(owner.address);
  console.log("Owner has tokens:", tokens);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
