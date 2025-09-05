import AppRouter from "./routes/AppRouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";
import { ModalProvider } from "./context/ModalContext";
import { CodeProvider } from "./features/storage/code/context/CodeContext";
import { StockEntryProvider } from "./features/storage/entry/components/context/StockEntryContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CodeProvider>
        <StockEntryProvider>
          <ModalProvider>
            <AppRouter />
          </ModalProvider>
        </StockEntryProvider>
      </CodeProvider>
    </QueryClientProvider>
  );
}

export default App;
