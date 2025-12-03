import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import "./styles/index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { CartInitializer } from "./providers/CartInitializer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CartInitializer>
          <App />
        </CartInitializer>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
