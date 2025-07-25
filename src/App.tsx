import AppRouter from "./routes/AppRouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";
import { ModalProvider } from "./context/ModalContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <AppRouter />
      </ModalProvider>
    </QueryClientProvider>
  );
}

export default App;
