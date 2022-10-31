import React from "react";

const PageButton = (props) => {
  return (
    // `btn` from bootstrap
    <div className="btn">
      <span className={props.isBold ? "pageButtonBold hoverBold" : "hoverBold"}>
        {props.name}
      </span>
    </div>
  );
};

export default PageButton;
