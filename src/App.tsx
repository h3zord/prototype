import AppRouter from "./routes/AppRouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";
import { ModalProvider } from "./context/ModalContext";
import { CodeProvider } from "./features/storage/code/context/CodeContext";
import { StockEntryProvider } from "./features/storage/entry/context/StockEntryContext";
import { ToastContainer } from "react-toastify";
import { PreEntryProvider } from "./features/storage/pre-entry/context/PreEntryContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CodeProvider>
        <PreEntryProvider>
          <StockEntryProvider>
            <ModalProvider>
              <AppRouter />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="text-gray-900 font-lato"
                toastClassName="bg-gray-700 text-white rounded-md shadow-md"
              />
            </ModalProvider>
          </StockEntryProvider>
        </PreEntryProvider>
      </CodeProvider>
    </QueryClientProvider>
  );
}

export default App;
