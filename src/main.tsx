import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import router from "./route/index.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./app/store.ts";
import { injectStore } from "./lib/api.ts";
import { PersistGate } from "redux-persist/integration/react";
injectStore(store);
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
         <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </PersistGate>
    </Provider></ThemeProvider>
  </StrictMode>,
);
