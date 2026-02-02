import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import AppSServiceProvider from "./providers/AppServiceProviders.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppSServiceProvider>
      <App />
    </AppSServiceProvider>
  </StrictMode>,
);
