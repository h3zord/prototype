import { Outlet } from "react-router-dom";
import Layout from "../components/layout/Layout";

const ProtectedRoute = () => {
  return (
    <div className="flex flex-col h-full">
      <Layout>
        <main className="w-full mx-4 flex-1 overflow-x-auto flex flex-col">
          <Outlet />
        </main>
      </Layout>
    </div>
  );
};

export default ProtectedRoute;
