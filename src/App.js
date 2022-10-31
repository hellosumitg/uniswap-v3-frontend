import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import PageButton from "./components/PageButton";
import ConnectButton from "./components/ConnectButton";
import { GearFill } from "react-bootstrap-icons";
import ConfigModal from "./components/ConfigModal";
import CurrencyField from "./components/CurrencyField";

import BeatLoader from "react-spinners/BeatLoader";

import {
  getWethContract,
  getUniContract,
  getPrice,
  runSwap,
} from "./AlphaRouterService";

function App() {
  const [provider, setProvider] = useState(undefined); // `provider` holds our object for interacting with the Blockchain and it performs the `Read` only works
  const [signer, setSigner] = useState(undefined); // `signer` lets us actually write to the Blockchain, so that we can `Swap` or `Push` transaction on behalf of your wallet.
  const [signerAddress, setSignerAddress] = useState(undefined); // `signerAddress` helps us in checking the quantity of different crypto currencies present in the wallet right now and then display in the UI

  const [slippageAmount, setSlippageAmount] = useState(2); // Slippage Amount : is how much of a price change we're willing to accept if there's not enough liquidity in the Uniswap Pool
  const [deadlineMinutes, setDeadlineMinutes] = useState(10);
  const [showModal, setShowModal] = useState(undefined);

  const [inputAmount, setInputAmount] = useState(undefined);
  const [outputAmount, setOutputAmount] = useState(undefined);
  const [transaction, setTransaction] = useState(undefined);
  const [loading, setLoading] = useState(undefined);
  const [ratio, setRatio] = useState(undefined);
  const [wethContract, setWethContract] = useState(undefined);
  const [uniContract, setUniContract] = useState(undefined);
  const [wethAmount, setWethAmount] = useState(undefined);
  const [uniAmount, setUniAmount] = useState(undefined);

  // below useEffect() runs when the app loads
  useEffect(() => {
    const onLoad = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Initializing the `wethContract` and `uniContract`
      const wethContract = getWethContract();
      setWethContract(wethContract);

      const uniContract = getUniContract();
      setUniContract(uniContract);
    };
    onLoad();
  }, []);

  // below function allows us to connect with the Blockchain using wallets
  const getSigner = async (provider) => {
    provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner(); // this `getSigner()` method is from ethers.js and is different from the above, (i.e our declared one)
    setSigner(signer);
  };
  const isConnected = () => signer !== undefined; // checks wallet is currently connected (i.e by checking signer is not undefined)
  const getWalletAddress = () => {
    // below `.getAddress()` is a ethers.js method on `signer` for getting address
    signer.getAddress().then((address) => {
      setSignerAddress(address); // for storing the address

      // Connecting `weth` and `uni` contracts using various `ether.js` functions as shown below
      wethContract.balanceOf(address).then((res) => {
        setWethAmount(Number(ethers.utils.formatEther(res)));
      });
      uniContract.balanceOf(address).then((res) => {
        setUniAmount(Number(ethers.utils.formatEther(res)));
      });
    });
  };

  if (signer !== undefined) {
    getWalletAddress();
  }

  const getSwapPrice = (inputAmount) => {
    setLoading(true);
    setInputAmount(inputAmount);

    const swap = getPrice(
      inputAmount,
      slippageAmount,
      Math.floor(Date.now() / 1000 + deadlineMinutes * 60),
      signerAddress
    ).then((data) => {
      setTransaction(data[0]); // As data is returning an array and the first element is ye
      setOutputAmount(data[1]); // amount that we gte back of the second token from the swap
      setRatio(data[2]); // price ratio between first and second token
      setLoading(false); // as at this point we've already gotten our data back from Uniswap
    });
  };

  return (
    <div className="App">
      <div className="appNav">
        <div className="my-2 buttonContainer buttonContainerTop">
          <PageButton name={"Swap"} isBold={true} />
          <PageButton name={"Pool"} />
          <PageButton name={"Vote"} />
          <PageButton name={"Charts"} />
        </div>

        <div className="rightNav">
          <div className="connectButtonContainer">
            <ConnectButton
              // `ConnectButton` component with some `props` such as:
              provider={provider}
              isConnected={isConnected} // this calls `isConnected()` for checking the wallet address connected or not
              signerAddress={signerAddress} // for displaying address that is connected
              getSigner={getSigner} // so that we can call `getSigner()` to connect our wallet when we click
            />
          </div>
          <div className="my-2 buttonContainer">
            <PageButton name={"..."} isBold={true} />
          </div>
        </div>
      </div>

      <div className="appBody">
        <div className="swapContainer">
          <div className="swapHeader">
            <span className="swapText">Swap</span>
            <span className="gearContainer" onClick={() => setShowModal(true)}>
              <GearFill />
            </span>
            {showModal && (
              <ConfigModal
                onClose={() => setShowModal(false)}
                slippageAmount={slippageAmount}
                setSlippageAmount={setSlippageAmount}
                deadlineMinutes={deadlineMinutes}
                setDeadlineMinutes={setDeadlineMinutes}
              />
            )}
          </div>

          <div className="swapBody">
            <CurrencyField
              field="input"
              tokenName="WETH"
              getSwapPrice={getSwapPrice}
              signer={signer}
              balance={wethAmount}
            />
            <CurrencyField
              field="output"
              tokenName="UNI"
              value={outputAmount}
              signer={signer}
              balance={uniAmount}
              spinner={BeatLoader}
              loading={loading}
            />
          </div>

          <div className="ratioContainer">
            {ratio && <>{`1 UNI = ${ratio} WETH`}</>}
          </div>

          <div className="swapButtonContainer">
            {isConnected() ? (
              <div
                onClick={() => runSwap(transaction, signer)}
                className="swapButton"
              >
                Swap
              </div>
            ) : (
              <div onClick={() => getSigner(provider)} className="swapButton">
                Connect Wallet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
