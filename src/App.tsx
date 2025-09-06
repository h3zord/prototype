import AppRouter from "./routes/AppRouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";
import { ModalProvider } from "./context/ModalContext";
import { CodeProvider } from "./features/storage/code/context/CodeContext";
import { StockEntryProvider } from "./features/storage/entry/components/context/StockEntryContext";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CodeProvider>
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
      </CodeProvider>
    </QueryClientProvider>
  );
}

export default App;
