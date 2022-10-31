import React from "react";
const CurrencyField = (props) => {
  const getPrice = (value) => {
    props.getSwapPrice(value);
  };

  return (
    <div className="row currencyInput">
      {/* {Going to use 6 columns out of the total 12 columns from `bootstrap` with `numberContainer`} */}
      <div className="col-md-6 numberContainer">
        {props.loading ? (
          <div className="spinnerContainer">
            <props.spinner />
          </div>
        ) : (
          // if `props.loading...` is `false` that means that a value has already been returned from `Uniswap` so we can display it...
          <input
            className="currencyInputField"
            placeholder="0.0"
            value={props.value}
            // below `onBlur` runs when we'll click outside of the `currencyInputField`
            onBlur={(e) =>
              props.field === "input" ? getPrice(e.target.value) : null
            }
          />
        )}
      </div>
      {/* {Going to use the remaining 6 columns out of the total 12 columns from `bootstrap` with `tokenContainer`} */}
      <div className="col-md-6 tokenContainer">
        <span className="tokenName">{props.tokenName}</span>
        <div className="balanceContainer">
          <span className="balanceAmount">
            Balance: {props.balance?.toFixed(3)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurrencyField;
