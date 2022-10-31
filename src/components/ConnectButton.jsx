import React from "react";
import PageButton from "./../components/PageButton";

const ConnectButton = (props) => {
  const { isConnected, signerAddress, getSigner, provider } = props;
  const displayAddress = `${signerAddress?.substring(0, 10)}...`; // this is for grabbing first 10 characters of the address (if it exists) as actual address is very long

  return (
    <>
      {isConnected() ? (
        <div className="buttonContainer">
          <PageButton name={displayAddress} />
        </div>
      ) : (
        <div
          className="btn my-2 connectButton"
          onClick={() => getSigner(provider)}
        >
          Connect Wallet
        </div>
      )}
    </>
  );
};

export default ConnectButton;
