import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

async function enableMocking() {
  // if (!import.meta.env.DEV) {
  //   return;
  // }
  // const { worker } = await import("./mocks/browser");
  // // `worker.start()` returns a Promise that resolves
  // // once the Service Worker is up and ready to intercept requests.
  // return worker.start();
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>,
  );
});
