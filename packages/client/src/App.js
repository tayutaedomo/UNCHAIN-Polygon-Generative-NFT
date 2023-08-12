import { useEffect, useState } from "react";
import "./App.css";
import contract from "./contracts/NFTCollectible.json";
import { ethers } from "ethers";
import Header from "./components/Header";
import Footer from "./components/Footer";

const OPENSEA_LINK = process.env.REACT_APP_OPENSEA_LINK;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const abi = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [metamaskError, setMetamaskError] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    const network = await ethereum.request({ method: "eth_chainId" });

    if (accounts.length !== 0 && network.toString() === "0x13881") {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setMetamaskError(false);
      setCurrentAccount(account);
    } else {
      setMetamaskError(true);
      console.log("No authorized account found");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install MetaMask!");
    }

    try {
      const network = await ethereum.request({ method: "eth_chainId" });

      if (network.toString() !== "0x13881") {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Found an account! Address:", accounts[0]);
        setMetamaskError(false);
        setCurrentAccount(accounts[0]);
      } else {
        setMetamaskError(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        const nftTxn = await nftContract.mintNFTs(1, {
          value: ethers.utils.parseEther("0.01"),
        });
        console.log("Mining... please wait.");
        await nftTxn.wait();

        console.log(`Mined, see transaction: ${nftTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className="cta-button mint-nft-button">
        Mint NFT
      </button>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on("chainChanged", (_chainId) =>
        window.location.reload()
      );
    }
  }, []);

  return (
    <div className="main-app">
      {metamaskError && (
        <div className="metamask-error">
          Metamask から Polygon Testnet に接続してください!
        </div>
      )}
      <Header opensea={OPENSEA_LINK} />
      {metamaskError === false ? (
        <div>{currentAccount ? mintNftButton() : connectWalletButton()}</div>
      ) : null}
      <Footer address={contractAddress} />
    </div>
  );
}

export default App;
