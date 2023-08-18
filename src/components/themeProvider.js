import React from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  const theme = useSelector((state) => state.theme);

  const themeStyles = {
    light: {
      backgroundColor: "white",
      color: "black",
    },
    dark: {
      backgroundColor: "#333",
      color: "#2e679f",
    },
  };

  const themeProps = {
    theme,
    themeStyles: themeStyles[theme],
  };

  return <div style={{ ...themeProps.themeStyles, minHeight: "100vh" }}>{children}</div>;
};

export default ThemeProvider;
