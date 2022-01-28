import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./components/contexts/AuthContext";
import { FirestoreContextProvider } from "./components/contexts/FirestoreContext";

ReactDOM.render(
  <BrowserRouter>
    <FirestoreContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </FirestoreContextProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
