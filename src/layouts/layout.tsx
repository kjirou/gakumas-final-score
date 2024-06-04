import React from "react";
import "../../node_modules/normalize.css/normalize.css";
import "./layout.css";

type Props = {
  children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return children;
};

export default Layout;
