import React, { useRef, useState, useEffect } from "react";
import flexograv from "../../../../assets/images/logo_flexograv_cinza.png";
import PdfPreview from "./pdfPreview";
import html2pdf from "html2pdf.js";
import { FileText, Printer } from "lucide-react";
import { Modal } from "../../../../components";
import { formatDate, formatPrice } from "../../../../helpers/formatter";
import { getLabelFromValue } from "../../../../helpers/options/getOptionFromValue";
import { Unit } from "../../../../types/models/customer";
import { flapOptions } from "../../../../helpers/options/printer";
import { usePermission } from "../../../../context/PermissionsContext";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { clicheCorrugatedReplacementSectorLabels } from "../../../../helpers/options/replacementSector";
import { PermissionType } from "../../../permissions/permissionsTable";
import {
  useSaveServiceOrderAnnotation,
  useServiceOrderAnnotations,
} from "../../../serviceOrder/api/hooks";
import {
  ClicheCorrugatedModalProps,
  productLabels,
  productTypeLabels,
} from "./types";
import { ColorsAndDimensionsReplacement } from "./ColorsAndDimensionsReplacement";
import { Eye, EyeOff } from "lucide-react";

const printPDF = () => {
  const element = document.getElementById("pdf-content");
  if (!element) return console.error("Element not found");

  html2pdf()
    .set({
      margin: 1,
      image: { type: "jpeg", quality: 0.99 },
      html2canvas: {
        scale: 3,
        useCORS: true,
      },
      jsPDF: { format: "a4" },
      pagebreak: { mode: "avoid-all" },
    })
    .from(element)
    .outputPdf("blob")
    .then((pdfBlob) => {
      const blobUrl = URL.createObjectURL(pdfBlob);

      const printWindow = window.open(blobUrl, "_blank");
      if (!printWindow) return;

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    });
};

const generatePDF = () => {
  const element = document.getElementById("pdf-content");
  if (!element) return console.error("Element not found");

  html2pdf()
    .set({
      margin: 1,
      filename: "Service_Order.pdf",
      image: { type: "jpeg", quality: 0.99 },
      html2canvas: {
        scale: 3,
        useCORS: true,
      },
      jsPDF: { format: "a4" },
      pagebreak: { mode: "avoid-all" },
    })
    .from(element)
    .save();
};

interface InfoFieldProps {
  label: string;
  value: string | number | null | undefined;
  className?: string;
  suffix?: string;
  hideValue?: boolean;
  canReveal?: boolean;
}

export const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  className,
  suffix,
  hideValue = false,
  canReveal = false,
}) => {
  const [revealed, setRevealed] = useState(false);

  const shouldHide = hideValue && !revealed;

  const getMaskedValue = () => {
    if (!value) return "••••••••";
    const valueStr = String(value);

    return valueStr.replace(/[^\s,]/g, "•");
  };

  return (
    <div
      className="flex items-center gap-2 text-xs w-full max-w-full"
      data-sensitive={hideValue ? "true" : "false"}
    >
      <label className="shrink-0 whitespace-nowrap">{label}</label>

      <div className="flex flex-1 items-center gap-1 min-w-0">
        <div
          className={`px-1 min-h-[18px] flex items-center border rounded-[4px] border-black bg-white text-black text-left text-xs w-full overflow-hidden ${className || ""}`}
          style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          title={shouldHide ? "Conteúdo sensível" : String(value)}
        >
          <span
            className={`truncate ${shouldHide ? "blur-sm select-none print:hidden" : ""}`}
            data-original-value={String(value)}
            data-masked-value={getMaskedValue()}
          >
            {shouldHide ? getMaskedValue() : value}
          </span>
        </div>

        {canReveal && hideValue && (
          <button
            type="button"
            onClick={() => setRevealed(!revealed)}
            className="text-neutral-500 hover:text-black no-print"
            title={revealed ? "Ocultar" : "Mostrar"}
          >
            {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}

        {suffix && <span className="text-xs">{suffix}</span>}
      </div>
    </div>
  );
};

const ClicheCorrugatedReplacementReportPDF: React.FC<
  ClicheCorrugatedModalProps
> = ({ onClose, selectedServiceOrder: so }) => {
  const { hasPermission, user } = usePermission();
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [tool, setTool] = useState<"none" | "draw" | "erase">("none");

  const startDraw = () => {
    setTool("draw");
    canvasRef.current?.eraseMode(false);
  };
  const startErase = () => {
    setTool((prev) => (prev === "erase" ? "none" : "erase"));
    canvasRef.current?.eraseMode(tool !== "erase");
  };
  const stopAll = () => {
    setTool("none");
    canvasRef.current?.eraseMode(false);
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
  };

  const saveCanvasMutation = useSaveServiceOrderAnnotation({
    onSuccess: () => onClose(),
  });

  const handleSave = async () => {
    if (!canvasRef.current) return;
    const drawing = await canvasRef.current.exportImage("png");
    saveCanvasMutation.mutate({ serviceOrderId: so.id, drawing });
  };

  const { data: annotations = [], isLoading: loadingAnnos } =
    useServiceOrderAnnotations(so.id);

  const [activeTab, setActiveTab] = useState<number | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  }, [activeTab]);

  const unitAbbrevOptions = [
    { value: Unit.RS_PORTO_ALEGRE, label: "POA" },
    { value: Unit.SP_INDAIATUBA, label: "IND" },
    { value: Unit.RS_FARROUPILHA, label: "FRR" },
  ];

  const isValidUnit = (value: any): value is Unit => {
    return Object.values(Unit).includes(value);
  };

  const getUnitAbbreviation = (unit?: string): string => {
    if (!unit || !isValidUnit(unit)) return "-";
    const found = unitAbbrevOptions.find((opt) => opt.value === unit);
    return found?.label ?? unit;
  };

  const customerName = so.customer?.fantasyName || so.customer?.name;
  const externalCustomerName = so.externalCustomer?.fantasyName;
  const transportName = so.transport?.name;
  const operatorName = `${so.operator?.firstName} ${so.operator?.lastName}`;
  const representativeName = so.customer?.representative
    ? `${so.customer?.representative?.firstName} ${so.customer?.representative?.lastName}`
    : "";

  const dispatchDate = so.dispatchDate ? formatDate(so.dispatchDate) : "";
  const entryDate = so.entryDate ? formatDate(so.entryDate) : "";
  const budget = formatPrice({ price: so.budget ?? 0 });
  const title = so.title;
  const subTitle = so.subTitle;
  const dieCutCode = so.printerDetails?.itemDieCutBlockInCliche;
  const file = so.file;
  const notes = so.notes;
  const printerName = so.printer?.name;
  const thicknesses = so.printerDetails?.thickness;
  const profileName = so.printerDetails?.profile?.name;
  const colors = so.printerDetails?.colors || [];
  const procedure = so.customer?.procedure;
  const product = productLabels[so.product];
  const productType = productTypeLabels[so.productType];
  const clicheCode = so.printerDetails?.itemCliche;
  const cylinder = so.printerDetails?.corrugatedPrinterDetails?.cylinder;
  const polyesterMaxWidth =
    so.printerDetails?.corrugatedPrinterDetails?.polyesterMaxWidth;
  const polyesterMaxHeight =
    so.printerDetails?.corrugatedPrinterDetails?.polyesterMaxHeight;
  const distortion = so.printerDetails?.corrugatedPrinterDetails?.distortion;
  const clicheMaxWidth =
    so.printerDetails?.corrugatedPrinterDetails?.clicheMaxWidth;
  const clicheMaxHeight =
    so.printerDetails?.corrugatedPrinterDetails?.clicheMaxHeight;
  const itemCustomer = so.itemCodeOnCustomer;
  const flapPrinter = so.printer?.corrugatedPrinter?.flap;
  const trap = so?.printerDetails?.trap;
  const colorsPattern = so?.printerDetails?.colorsPattern;
  const replacementProductType = productTypeLabels[so.replacementProductType];
  const sector = clicheCorrugatedReplacementSectorLabels[so.sector];
  const reasonReplacement = so.reasonReplacement.join(", ");
  const nfNumber = so.invoiceDetails?.nfNumber;
  const reuseServiceOrderId = so.reuseSourceOrderId;
  const purchaseOrder =
    so?.invoiceDetails?.purchaseOrder || so.purchaseOrder || "";
  const replacementResponsibles = so.replacementResponsibles
    .map((responsible) => `${responsible.firstName} ${responsible.lastName}`)
    .join(", ");

  console.log("so", so);

  const isCustomer = user?.group?.name === "Cliente";

  const isAdmin = user?.group?.name === "Administrador";

  const displayPrice =
    isCustomer && so.budget && so.budget > 0 ? so.budget : so.totalPrice;

  return (
    <Modal title="Relatório Flexo" onClose={onClose} className="w-fit">
      <div className="min-h-screen bg-white p-6 text-black">
        <div className="mb-1">
          {loadingAnnos ? (
            <p>Carregando anotações...</p>
          ) : annotations.length === 0 ? (
            <p className="text-xs text-gray-500">
              Nenhuma anotação encontrada.
            </p>
          ) : (
            <div className="flex space-x-2">
              {annotations.map((ann, idx) => (
                <button
                  key={ann.id}
                  onClick={() =>
                    setActiveTab((prev) => (prev === idx ? null : idx))
                  }
                  className={`px-3 rounded-3xl ${
                    idx === activeTab
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {ann.user.firstName} {ann.user.lastName}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-2 mb-1">
          <button
            onClick={tool === "draw" ? stopAll : startDraw}
            className={`px-4 rounded-xl text-xs font-medium transition ${
              tool === "draw"
                ? "bg-gray-400 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {tool === "draw" ? "Parar desenho" : "Desenhar"}
          </button>

          <button
            onClick={startErase}
            className={`px-4 rounded-xl text-xs font-medium transition ${
              tool === "erase"
                ? "bg-gray-400 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {tool === "erase" ? "Parar borracha" : "Borracha"}
          </button>

          <button
            onClick={handleClear}
            className="px-4 py-1 rounded-xl text-xs font-medium bg-gray-200 text-gray-800 hover:bg-red-200 transition"
          >
            Apagar tudo
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-1 rounded-xl text-xs font-medium bg-gray-200 text-gray-800 hover:bg-green-200 transition"
          >
            Salvar
          </button>
        </div>

        <div
          id="pdf-content"
          style={{
            position: "relative",
            width: "800px",
            maxWidth: "100%",
            fontSize: 12,
          }}
          className="mx-auto rounded-[12px] border-[2px] border-gray-300 p-1 bg-white text-black text-xs"
        >
          <div className="w-full border-[2px] border-black bg-white p-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
              <img src={flexograv} className="w-[200px]" alt="Logo Flexograv" />

              <div className="flex items-center">
                <div className="pr-10 flex items-center space-x-1">
                  <FileText
                    onClick={generatePDF}
                    className="w-6 h-5 text-gray-600 cursor-pointer"
                  />
                  <Printer
                    onClick={printPDF}
                    className="w-6 h-5 text-gray-600 cursor-pointer"
                  />
                </div>
                <div className="flex font-mono text-sm sm:text-base text-center items-center">
                  <span className="text-gray-300 pr-1 font-semibold">os</span>
                  <span className="text-green-600 font-semibold text-3xl">
                    {getUnitAbbreviation(so.unit)}
                  </span>
                  <span className="text-gray-300 text-3xl font-semibold">
                    {so.id}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-lg text-center lg:text-left">
              Dados de Serviço
            </h2>

            <div className="bg-neutral-50 p-1 rounded-xl space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <InfoField label={"Cliente:"} value={customerName} />
                <InfoField label={"Transporte:"} value={transportName} />
                <InfoField label={"Item clichê:"} value={clicheCode} />
                <InfoField
                  label={"Faturamento:"}
                  value={externalCustomerName || customerName}
                />
                <InfoField label={"Orçamento:"} value={budget} />
                <InfoField label={"Item cliente:"} value={itemCustomer} />
                <InfoField label={"Produto:"} value={product} />
                <InfoField label={"Tipo de produto:"} value={productType} />
                <InfoField label={"Item forma:"} value={dieCutCode} />
                <InfoField label={"Título:"} value={title} />
                <InfoField label={"Subtítulo:"} value={subTitle} />
                <InfoField label={"Entrada:"} value={entryDate} />
                <InfoField label={"Ordem de compra:"} value={purchaseOrder} />
                {nfNumber && (
                  <InfoField label={"Número NF:"} value={nfNumber} />
                )}
                <InfoField
                  label={"Representante:"}
                  value={representativeName}
                />
                <InfoField label={"Entrega:"} value={dispatchDate} />
                <InfoField label={"Operador:"} value={operatorName} />
                <InfoField label={"OS original:"} value={reuseServiceOrderId} />

                <div>
                  <InfoField label={"Arquivo:"} value={file} />
                </div>
              </div>
            </div>

            <h2 className="text-lg text-center lg:text-left mt-1">Montagem</h2>

            <div className=" bg-neutral-50 p-1 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <InfoField label={"Impressora:"} value={printerName} />
                <InfoField label={"Espessura:"} value={thicknesses} />
                <InfoField
                  label={"LAP/Orelha/Aba:"}
                  value={getLabelFromValue(flapPrinter, flapOptions)}
                />
                <InfoField label={"Cilindro:"} value={cylinder} suffix="mm" />
                <InfoField
                  label={"Poliéster larg. máx.:"}
                  value={polyesterMaxWidth}
                  suffix="mm"
                />
                <InfoField
                  label={"Poliéster alt. máx.:"}
                  value={polyesterMaxHeight}
                  suffix="mm"
                />
                <InfoField label={"Distorção:"} value={distortion} suffix="%" />
                <InfoField
                  label={"Clichê larg. máx.:"}
                  value={clicheMaxWidth}
                  suffix="mm"
                />
                <InfoField
                  label={"Clichê alt. máx.:"}
                  value={clicheMaxHeight}
                  suffix="mm"
                />
              </div>
            </div>

            <div className=" bg-neutral-50 p-1 rounded-xl">
              <div className="flex items-center justify-center">
                <label className="block text-base font-semibold">Jogos:</label>
                <div className="bg-black text-white px-2 py-0.5 rounded text-xs ml-1">
                  {so.printerDetails?.setAmount ?? 0}
                </div>
              </div>
            </div>

            <h2 className="text-lg text-center lg:text-left mt-1">
              Dados da Reposição
            </h2>

            <div className=" bg-neutral-50 p-1 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <InfoField
                  label="Tipo da reposição:"
                  value={replacementProductType}
                />
                <InfoField label="Setor:" value={sector} />
                <InfoField
                  label="Motivo da reposição:"
                  value={reasonReplacement}
                />
                <InfoField
                  label="Responsável:"
                  value={replacementResponsibles}
                  hideValue={true}
                  canReveal={isAdmin}
                />
              </div>
            </div>

            <ColorsAndDimensionsReplacement
              trap={trap}
              colorsPattern={colorsPattern}
              profileName={profileName}
              procedure={procedure}
              colors={colors ?? []}
              measures={
                so.printerDetails?.corrugatedPrinterDetails?.measures?.colors ??
                []
              }
              colorsTableRows={4}
              dimensionsTableRows={13}
              budget={budget}
              totalPrice={displayPrice || 0}
              totalMeasuresCliche={
                so.printerDetails?.corrugatedPrinterDetails?.measures
                  ?.totalMeasuresCliche
              }
              showPrices={hasPermission(PermissionType.VIEW_PCP_PRICES)}
            />

            <div className="grid grid-cols-3 gap-2 mt-1">
              <div className="col-span-1">
                <label className="block text-sm">Observações:</label>
                <div className="relative border rounded-[10px] border-black p-2 h-[145px] overflow-y-auto">
                  <span className="relative text-xs text-black break-words whitespace-pre-wrap">
                    {notes}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm">Anexo:</label>
                <PdfPreview serviceOrderId={so.id} fileType="serviceOrder" />
              </div>

              <div>
                <label className="block text-sm">Ficha de impressão:</label>
                <PdfPreview serviceOrderId={so.id} fileType="printSheet" />
              </div>
            </div>
          </div>
          <ReactSketchCanvas
            ref={canvasRef}
            width="100%"
            height="100%"
            strokeWidth={4}
            strokeColor="red"
            eraserWidth={10}
            canvasColor="transparent"
            backgroundImage={
              activeTab !== null ? annotations[activeTab]?.drawing : undefined
            }
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 10,
              pointerEvents: tool === "none" ? "none" : "auto",
              cursor:
                tool === "draw"
                  ? "crosshair"
                  : tool === "erase"
                    ? "cell"
                    : "default",
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ClicheCorrugatedReplacementReportPDF;
