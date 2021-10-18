import "./index.css";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import LoadingIndicator from "shared/ui-kit/LoadingIndicator/LoadingIndicator";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <LoadingIndicator />
  </React.StrictMode>,
  document.getElementById("root")
);
