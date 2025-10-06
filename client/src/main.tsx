import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./auth/context/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CurrentUserProvider } from "./auth/context/currentUser"; // ✅ import our new provider

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CurrentUserProvider>
          <App />
          <Toaster
            toastOptions={{
              className: "bg-darkbg text-white border border-primary",
              style: {
                background: "#1e1e1e",
                color: "#fff",
              },
              success: {
                iconTheme: {
                  primary: "#51ab91",
                  secondary: "#212121",
                },
              },
              error: {
                iconTheme: {
                  primary: "#f87171",
                  secondary: "#212121",
                },
              },
            }}
          />
        </CurrentUserProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
