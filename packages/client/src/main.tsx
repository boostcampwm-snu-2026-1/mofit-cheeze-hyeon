import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import "./index.css";
import { AppRouter } from "./router";
import { AuthProvider } from "./lib/AuthProvider";
import { useAuthStore } from "./store/auth";

if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__demo = {
    switchToModel: () => useAuthStore.getState().loginAsMockModel(),
    switchToDesigner: () => useAuthStore.getState().loginAsMockDesigner(),
  };
}

function DevNavigationExposer() {
  const navigate = useNavigate();
  useEffect(() => {
    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__demo = {
        ...((window as unknown as Record<string, unknown>).__demo as object),
        navigate: (path: string) => {
            if ("startViewTransition" in document) {
              document.startViewTransition(() => navigate(path));
            } else {
              navigate(path);
            }
          },
      };
    }
  }, [navigate]);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {import.meta.env.DEV && <DevNavigationExposer />}
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
