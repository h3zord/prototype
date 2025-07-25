import { useParams, useLocation } from "react-router-dom";
import { useGetCustomerById } from "../features/customers/api/hooks";
import { usePrinter } from "../features/customerPrinter/api/hooks";
import { BreadcrumbItem } from "../components/components/ui/breadcrumps";
import routes from "../routes/routes";
import { Customer } from "../types/models/customer";
import { Printer } from "../types/models/customerprinter";

export const useCustomerFlowBreadcrumbs = (): BreadcrumbItem[] => {
  const params = useParams<{
    idCustomer?: string;
    idPrinter?: string;
    idCylinder?: string;
  }>();
  const location = useLocation();
  const { idCustomer: idCustomerParam, idPrinter: idPrinterParam } = params;

  const customerId = idCustomerParam
    ? parseInt(idCustomerParam, 10)
    : undefined;
  const printerId = idPrinterParam ? parseInt(idPrinterParam, 10) : undefined;

  const { data: customerData, isLoading: isLoadingCustomer } =
    useGetCustomerById(customerId!, { enabled: !!customerId });

  const { data: printerData, isLoading: isLoadingPrinter } = usePrinter(
    { idCustomer: customerId!, idPrinter: printerId! },
    { enabled: !!customerId && !!printerId },
  );

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Clientes", href: routes.CUSTOMERS },
  ];

  if (customerId && idCustomerParam) {
    const customerName = isLoadingCustomer
      ? "Carregando..."
      : (customerData as Customer)?.fantasyName ||
        (customerData as Customer)?.name ||
        `Cliente ${idCustomerParam}`;

    const customerPrinterListPath = routes.CUSTOMER_PRINTER.replace(
      ":idCustomer",
      idCustomerParam,
    );

    breadcrumbs.push({ label: customerName, href: undefined });

    if (location.pathname === customerPrinterListPath) {
      breadcrumbs.push({ label: "Impressoras", href: customerPrinterListPath });
    } else if (idPrinterParam) {
      breadcrumbs.push({
        label: "Impressoras",
        href: customerPrinterListPath,
      });

      const printerName = isLoadingPrinter
        ? "Carregando..."
        : (printerData as Printer)?.name || `Impressora ${idPrinterParam}`;

      const printerProfilePath = routes.CUSTOMER_PROFILE.replace(
        ":idCustomer",
        idCustomerParam,
      ).replace(":idPrinter", idPrinterParam);
      const printerCylinderPath = routes.CUSTOMER_CYLINDER.replace(
        ":idCustomer",
        idCustomerParam,
      ).replace(":idPrinter", idPrinterParam);
      const printerDieCutBlockPath = params.idCylinder
        ? routes.CUSTOMER_DIE_CUT_BLOCK.replace(":idCustomer", idCustomerParam)
            .replace(":idPrinter", idPrinterParam)
            .replace(":idCylinder", params.idCylinder)
        : "";

      if (location.pathname.startsWith(printerProfilePath)) {
        breadcrumbs.push({ label: printerName, href: undefined });
        breadcrumbs.push({ label: "Perfis", href: undefined });
      } else if (
        params.idCylinder &&
        printerDieCutBlockPath &&
        location.pathname.startsWith(printerDieCutBlockPath)
      ) {
        breadcrumbs.push({ label: printerName, href: undefined });
        breadcrumbs.push({ label: "Cilindros", href: printerCylinderPath });
        const cylinderDetailPath =
          printerCylinderPath + "/" + params.idCylinder;
        breadcrumbs.push({
          label: `Cilindro ${params.idCylinder}`,
          href: cylinderDetailPath,
        });
        breadcrumbs.push({ label: "Bloco de Facas", href: undefined });
      } else if (location.pathname.startsWith(printerCylinderPath)) {
        breadcrumbs.push({ label: printerName, href: undefined });
        breadcrumbs.push({ label: "Cilindros", href: undefined });
      } else if (
        location.pathname ===
        customerPrinterListPath + "/" + idPrinterParam
      ) {
        breadcrumbs.push({ label: printerName, href: undefined });
      }
    }
  }
  return breadcrumbs;
};
