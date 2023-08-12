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
  const [mineStatus, setMineStatus] = useState(null);

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
    console.log("Trying to connect wallet...");
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install MetaMask!");
    }

    try {
      const network = await ethereum.request({ method: "eth_chainId" });

      if (network.toString() === "0x13881") {
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
      setMineStatus("mining");

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

        setMineStatus("success");
        console.log(`Mined, see transaction: ${nftTxn.hash}`);
      } else {
        setMineStatus("error");
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      setMineStatus("error");
      console.log(error);
    }
  };

  useEffect(() => {
    checkWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on("chainChanged", (_chainId) =>
        window.location.reload()
      );
    }
  }, []);

  const ConnectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  const MintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className="cta-button mint-nft-button">
        Mint NFT
      </button>
    );
  };

  const MineStatusSuccess = () => {
    return (
      <div className="success">
        <p>NFT minting successfully!</p>
        <p className="success-link">
          <a
            href={`https://testnets.opensea.io/${currentAccount}`}
            target="_blank"
            rel="noreferrer"
          >
            Click here
          </a>
          &nbsp;
          <span>to view your NFT on OpenSea.</span>
        </p>
      </div>
    );
  };

  const MineStatusMining = () => {
    return (
      <div className="mining">
        <div className="loader" />
        <span>Transaction is mining</span>
      </div>
    );
  };

  const MineStatusError = () => {
    return (
      <div className="error">
        <p>
          Transaction failed. Make sure you have at least 0.001 MATIC in your
          MetaMak wallet and try again.
        </p>
      </div>
    );
  };

  const MainActions = ({ mineStatus, currentAccount }) => {
    return (
      <div className="mine-submission">
        {mineStatus === "success" && (
          <MineStatusSuccess account={currentAccount} />
        )}
        {mineStatus === "mining" && <MineStatusMining />}
        {mineStatus === "error" && <MineStatusError />}
      </div>
    );
  };

  return (
    <div className="main-app">
      {metamaskError && (
        <div className="metamask-error">
          Metamask から Polygon Testnet に接続してください!
        </div>
      )}
      <Header opensea={OPENSEA_LINK} />

      {metamaskError === true ? (
        !currentAccount && !mineStatus && <ConnectWalletButton />
      ) : (
        <>
          {currentAccount && mineStatus !== "mining" && <MintNftButton />}
          <MainActions
            mineStatus={mineStatus}
            currentAccount={currentAccount}
          />
          {currentAccount && (
            <div className="show-user-address">
              <p>
                Your address being connected: <br />
                <span>
                  <a className="user-address" target="_blank" rel="noreferrer">
                    {currentAccount}
                  </a>
                </span>
              </p>
            </div>
          )}
        </>
      )}

      <Footer address={contractAddress} />
    </div>
  );
}

export default App;
