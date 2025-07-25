import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectRouter";
import routes from "./routes";
import UsersPage from "../features/users/components/UsersPage";
import CustomersPage from "../features/customers/components/CustomersPage";
import TransportPage from "../features/transport/components/TransportPage";
import CustomerPrinterPage from "../features/customerPrinter/components/CustomerPrinterPage";
import CustomerCylindersPage from "../features/customerCylinder/components/CustomerCylindersPage";
import CustomerprofilesPage from "../features/customerProfile/components/CustomerProfilesPage";
import CreateServiceOrder from "../features/serviceOrder/components/CreateServiceOrder";
import EditServiceOrder from "../features/serviceOrder/components/EditServiceOrder";
import ReuseServiceOrder from "../features/serviceOrder/components/ReuseServiceOrder";
import PCPPage from "../features/pcp/PCPPage";
import DeliveriesOfTheDayPage from "../features/deliveriesOfTheDay/deliveriesOfTheDayPage";
import InvoiceServiceOrderPage from "../features/serviceOrder/components/InvoiceServiceOrderPage";
import AlterServiceOrder from "../features/serviceOrder/components/AlterServiceOrder";
import InvoicePage from "../features/invoices/components/InvoicePage";
import PurchaseOrderPage from "../features/purchaseOrder/components/PurchaseOrderPage";
import DashboardPage from "../features/dashboard/components/DashboardPage";
import InvoicedServiceOrdersPage from "../features/invoicedServiceOrder/components/InvoicedServiceOrderPage";
import ReplacementsPage from "../features/replacements/components/ReplacementsPage";
import PermissionsPage from "../features/permissions/permissionsPage";
import ServiceOrderPage from "../features/serviceOrder/components/ServiceOrderPage";
import RecordingPage from "../features/storage/components/RecordingPage";

function AppRouter() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to={routes.DASHBOARD} replace />} />
        <Route path={routes.DASHBOARD} element={<DashboardPage />} />
        <Route path={routes.USERS} element={<UsersPage />} />
        <Route path={routes.CUSTOMERS} element={<CustomersPage />} />
        <Route path={routes.TRANSPORT} element={<TransportPage />} />
        <Route path={routes.SERVICE_ORDER} element={<ServiceOrderPage />} />
        <Route path={routes.PCP} element={<PCPPage />} />
        <Route path={routes.PURCHASE_ORDER} element={<PurchaseOrderPage />} />
        <Route path={routes.INVOICE} element={<InvoicePage />} />
        <Route path={routes.REPLACEMENTS} element={<ReplacementsPage />} />
        <Route path={routes.PERMISSIONS} element={<PermissionsPage />} />
        <Route path={routes.RECORDING} element={<RecordingPage />} />

        <Route
          path={routes.CUSTOMER_PRINTER}
          element={<CustomerPrinterPage />}
        />
        <Route
          path={routes.CUSTOMER_CYLINDER}
          element={<CustomerCylindersPage />}
        />
        <Route
          path={routes.CUSTOMER_PROFILE}
          element={<CustomerprofilesPage />}
        />
        <Route
          path={routes.CREATE_SERVICE_ORDER}
          element={<CreateServiceOrder />}
        />
        <Route
          path={routes.UPDATE_SERVICE_ORDER}
          element={<EditServiceOrder />}
        />
        <Route
          path={routes.UTILIZE_SERVICE_ORDER}
          element={<ReuseServiceOrder />}
        />
        <Route
          path={routes.ALTER_SERVICE_ORDER}
          element={<AlterServiceOrder />}
        />
        <Route
          path={routes.DELIVERIES_OF_THE_DAY}
          element={<DeliveriesOfTheDayPage />}
        />
        <Route
          path={routes.INVOICE_SERVICE_ORDER}
          element={<InvoiceServiceOrderPage />}
        />
        <Route
          path={routes.INVOICED_SERVICE_ORDER}
          element={<InvoicedServiceOrdersPage />}
        />
      </Route>
    </Routes>
  );
}

export default AppRouter;
