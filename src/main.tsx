/** @format */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PolkadotProvider } from "./context/use-polkadot.tsx";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")!).render(
  <SnackbarProvider maxSnack={4}>
    <PolkadotProvider>
      <App />
    </PolkadotProvider>
  </SnackbarProvider>
);
