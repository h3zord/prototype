import { Button, Modal } from "../../../components";
import { getLabelFromValue } from "../../../helpers/options/getOptionFromValue";
import flexograv from "../../../assets/images/logo_flexograv_cinza.png";
import { formatPrice } from "../../../helpers/formatter";
import { getProductTypeOptions } from "../api/helpers";

import {
  ServiceOrderProductType,
  DieCutBlockOrigin,
  ServiceOrderProduct,
} from "../../../types/models/serviceorder";

export const MeasuresRowSimplified = ({ serviceOrder }: any) => {
  const isNewAlterationReassemblyOrReplacement =
    serviceOrder?.productType === ServiceOrderProductType.NEW ||
    serviceOrder?.productType === ServiceOrderProductType.ALTERATION ||
    serviceOrder?.productType === ServiceOrderProductType.REPLACEMENT ||
    serviceOrder?.productType === ServiceOrderProductType.REPRINT ||
    serviceOrder?.productType === ServiceOrderProductType.REASSEMBLY;
  // const isReform = serviceOrder?.productType === ServiceOrderProductType.REFORM;
  const isRepair = serviceOrder?.productType === ServiceOrderProductType.REPAIR;
  const quantityColorsToRepair =
    serviceOrder?.printerDetails?.quantityColorsToRepair;
  const hasDieCutBlockNational =
    serviceOrder?.dieCutBlockDetails?.origin.includes(
      DieCutBlockOrigin.NATIONAL,
    );
  const hasDieCutBlockImported =
    serviceOrder?.dieCutBlockDetails?.origin.includes(
      DieCutBlockOrigin.IMPORTED,
    );
  const dieCutBlockMeasures = serviceOrder.dieCutBlockDetails?.measures;
  const clicheCorrugatedMeasures =
    serviceOrder.printerDetails?.corrugatedPrinterDetails?.measures;

  return (
    <div className="text-xs">
      {serviceOrder.product === ServiceOrderProduct.DIECUTBLOCK ? (
        <div>
          {hasDieCutBlockNational && (
            <div>Nacional: {dieCutBlockMeasures?.totalMeasuresNational} m</div>
          )}
          {hasDieCutBlockImported && (
            <div>Importada: {dieCutBlockMeasures?.totalMeasuresImported} m</div>
          )}
        </div>
      ) : null}
      {serviceOrder.product === ServiceOrderProduct.CLICHE_CORRUGATED ? (
        <div>
          {isNewAlterationReassemblyOrReplacement ? (
            <div>{clicheCorrugatedMeasures?.totalMeasuresCliche} cm²</div>
          ) : null}
          {isRepair ? <div>Qtd. Cores: {quantityColorsToRepair}</div> : null}
        </div>
      ) : null}
    </div>
  );
};

interface InvoicePDFModalProps {
  onClose: () => void;
  serviceOrders: any;
  dieCutBlockOrders: any;
  clicheCorrugatedOrders: any;
  hasMultipleProductTypes: boolean;
}

const generatePDF = (elementId: string) => {
  const element = document.getElementById(elementId);

  if (!element) return;

  const now = new Date();
  const formattedTimestamp = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(
    now.getHours(),
  ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(
    now.getSeconds(),
  ).padStart(2, "0")}`;

  const fileName = `pedido-${elementId}-${formattedTimestamp}.pdf`;

  import("html2pdf.js").then((html2pdf) => {
    const options = {
      margin: 10,
      filename: fileName,
      image: {
        type: "jpeg",
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
        letterRendering: true,
        width: 800,
        windowWidth: 800,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf.default().from(element).set(options).save();
  });
};
export const InvoicePDFModal: React.FC<InvoicePDFModalProps> = ({
  onClose,
  hasMultipleProductTypes,
  serviceOrders,
  clicheCorrugatedOrders,
  dieCutBlockOrders,
}) => {
  const allOrders = serviceOrders ?? [
    ...(clicheCorrugatedOrders ?? []),
    ...(dieCutBlockOrders ?? []),
  ];

  console.log("serviceOrders", serviceOrders);

  const hasSameCustomerId = allOrders.every(
    (serviceOrder) => serviceOrder.customerId === allOrders[0]?.customerId,
  );

  const calculateTotal = (orders: any[]) =>
    orders?.reduce((acc, so) => acc + (so?.totalPrice ?? 0), 0);

  const renderTable = (orders: any[], type: "clichê-corrugado" | "forma") => {
    const isClicheCorrugated = type === "clichê-corrugado";

    return (
      <div>
        <div className="mb-5">
          <Button onClick={() => generatePDF(type)} variant="primary">
            {isClicheCorrugated
              ? "Baixar PDF Clichê Corrugado"
              : "Baixar PDF Forma"}
          </Button>
        </div>

        <div
          id={type}
          style={{ width: "700px", maxWidth: "100%", fontSize: 16 }}
          className="p-6 bg-white text-black text-xs space-y-3"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="bg-[#f4f4f4] p-2 rounded-[16px] text-base font-semibold text-center">
              {orders[0]?.customer?.name}
            </div>
            <img src={flexograv} className="w-[160px]" alt="Logo Flexograv" />
          </div>

          <table className="w-full mt-4">
            <thead className="bg-[#f4f4f4]">
              <tr className="text-[12px]">
                <th className="border p-2">Item Cliente</th>
                <th className="border p-2">
                  {isClicheCorrugated ? "Item Clichê" : "Item Forma"}
                </th>
                <th className="border p-2">Serviço</th>
                <th className="border p-2">Metragem</th>
                <th className="border p-2">Tipo de Serviço</th>
                <th className="border p-2">Máquina</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((serviceOrder, i) => (
                <tr
                  key={i}
                  className="border odd:bg-white even:bg-gray-50 text-xs"
                >
                  <td className="pl-1">{serviceOrder.itemCodeOnCustomer}</td>
                  <td className="pl-1">
                    {isClicheCorrugated
                      ? serviceOrder.printerDetails?.itemCliche
                      : (serviceOrder.printerDetails?.itemDieCutBlockInCliche ??
                        serviceOrder.dieCutBlockDetails?.itemDieCutBlock)}
                  </td>
                  <td className="pl-1">{serviceOrder.title}</td>
                  <td className="pl-1">
                    <MeasuresRowSimplified serviceOrder={serviceOrder} />
                  </td>
                  <td className="pl-1">
                    {getLabelFromValue(
                      serviceOrder.productType,
                      getProductTypeOptions(serviceOrder.product),
                    )}
                  </td>
                  <td className="pl-1">
                    {(() => {
                      const allPrinters = [
                        serviceOrder?.printer?.name,
                        ...(serviceOrder?.secondaryPrinters?.map(
                          (p: any) => p.name,
                        ) || []),
                      ].filter(Boolean);

                      if (allPrinters.length === 0) return "";

                      const numbers = allPrinters.map((name) =>
                        name.replace(/IP\s*-\s*/, "").trim(),
                      );

                      return `IP ${numbers.join("/")}`;
                    })()}
                  </td>
                  <td className="pl-1">
                    {formatPrice({ price: serviceOrder?.totalPrice })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 font-semibold">
            {`Total: ${formatPrice({ price: calculateTotal(orders) })}`}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal title="Gerar PDF" onClose={onClose} className="w-fit">
      {!hasSameCustomerId ? (
        <div>Selecione ordens de serviço de mesmo cliente</div>
      ) : (
        <>
          {!hasMultipleProductTypes &&
            renderTable(
              serviceOrders,
              serviceOrders[0]?.product ===
                ServiceOrderProduct.CLICHE_CORRUGATED
                ? "clichê-corrugado"
                : "forma",
            )}

          {hasMultipleProductTypes && (
            <div className="flex gap-4">
              {clicheCorrugatedOrders.length > 0 &&
                renderTable(clicheCorrugatedOrders, "clichê-corrugado")}
              {dieCutBlockOrders.length > 0 &&
                renderTable(dieCutBlockOrders, "forma")}
            </div>
          )}
        </>
      )}
    </Modal>
  );
};
