import React from "react";
import stx from "./MobileSizeDiv.module.css";

function MobileSizeDiv({ children }) {
  return <section className={stx.MobileSizeDiv}>{children}</section>;
}

export default MobileSizeDiv;
