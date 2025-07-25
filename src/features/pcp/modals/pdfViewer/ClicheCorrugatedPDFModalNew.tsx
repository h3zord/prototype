import React, { useRef, useState, useEffect } from "react";
import { FileText, Printer } from "lucide-react";
import { Modal } from "../../../../components";
import flexograv from "../../../../assets/images/logo_flexograv_cinza.png";
import { formatDate, formatPrice } from "../../../../helpers/formatter";
import { getLabelFromValue } from "../../../../helpers/options/getOptionFromValue";
import PdfPreview from "./pdfPreview";
import html2pdf from "html2pdf.js";
import {
  ClicheCorrugatedModalProps,
  productLabels,
  productTypeLabels,
} from "./types";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import {
  useSaveServiceOrderAnnotation,
  useServiceOrderAnnotations,
} from "../../../serviceOrder/api/hooks";
import { ColorsAndDimensions } from "./ColorsAndDimensions";
import { Unit } from "../../../../types/models/customer";
import { flapOptions } from "../../../../helpers/options/printer";
import { usePermission } from "../../../../context/PermissionsContext";
import { PermissionType } from "../../../permissions/permissionsTable";

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
}

// const InfoField: React.FC<InfoFieldProps> = ({
//   label,
//   value,
//   className,
//   suffix,
// }) => {
//   return (
//     <div className="flex flex-col gap-1 -mb-2">
//       <label className="text-sm">{label}</label>
//       <div className="items-center">
//         <div
//           className={`min-h-[20px] flex items-center border rounded-[10px] border-black px-2 bg-white text-black text-left ${className || ""}`}
//           style={{
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//           }}
//           title={String(value)}
//         >
//           {value}
//         </div>
//         {suffix && <span className="pl-1 text-sm">{suffix}</span>}
//       </div>
//     </div>
//   );
// };

// const InfoField: React.FC<InfoFieldProps> = ({
//   label,
//   value,
//   className,
//   suffix,
// }) => {
//   return (
//     <div className="flex items-center gap-2 text-xs">
//       <label className="whitespace-nowrap">{label}</label>
//       <div className="flex items-center gap-1">
//         <div
//           className={`min-h-[18px] px-1 flex items-center border rounded-[4px] border-black bg-white text-black text-left text-xs ${className || ""}`}
//           style={{
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             width: "140px", // opcional, define um tamanho máximo
//           }}
//           title={String(value)}
//         >
//           {value}
//         </div>
//         {suffix && <span className="text-xs">{suffix}</span>}
//       </div>
//     </div>
//   );
// };

export const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  className,
  suffix,
}) => {
  return (
    <div className="flex items-center gap-2 text-xs w-full max-w-full">
      <label className="w-[90px] shrink-0 whitespace-nowrap">{label}</label>
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <div
          className={`min-h-[18px] px-1 flex items-center border rounded-[4px] border-black bg-white text-black text-left text-xs w-full ml-4 ${className || ""}`}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 180,
          }}
          title={String(value)}
        >
          {value}
        </div>
        {suffix && <span className="text-xs">{suffix}</span>}
      </div>
    </div>
  );
};

// interface InfoCheckboxProps {
//   label: string;
//   checked: boolean;
//   style?: React.CSSProperties;
// }

// const InfoCheckbox: React.FC<InfoCheckboxProps> = ({
//   label,
//   checked,
//   style,
// }) => {
//   return (
//     <div
//       className="min-h-[24px] flex items-center rounded-[10px] p-1 text-black"
//       style={style}
//     >
//       <input
//         type="checkbox"
//         className="custom-checkbox mr-1 max-h-[22px]"
//         checked={checked}
//         readOnly
//       />
//       <span className="text-xs">{label}</span>
//     </div>
//   );
// };

const ClicheCorrugatedModal: React.FC<ClicheCorrugatedModalProps> = ({
  onClose,
  selectedServiceOrder: so,
}) => {
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
  const representativeName = so.representative
    ? `${so.representative.firstName} ${so.representative.lastName}`
    : "";
  const dispatchDate = formatDate(so.dispatchDate);
  const entryDate = formatDate(so.entryDate);
  const budget = formatPrice({ price: so.budget ?? 0 });
  const title = so.title;
  const subTitle = so.subTitle;
  // const identificationNumber = so.printerDetails.barCode;
  const dieCutCode = so.printerDetails?.itemDieCutBlockInCliche;
  const file = so.file;
  const notes = so.notes;
  const printerName = so.printer?.name;
  const thicknesses = so.printerDetails?.thickness;
  const profileName = so.printerDetails?.profile?.name;
  const colors = so.printerDetails?.colors || [];
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

  console.log("so", so);

  const isCustomer = user?.group?.name === "Cliente";

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

            <div className="bg-neutral-50 p-1 rounded-xl space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <InfoField label={"Cliente:"} value={customerName} />
                </div>
                <div>
                  <InfoField label={"Transporte:"} value={transportName} />
                </div>
                <div>
                  <InfoField label={"Operador:"} value={operatorName} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <InfoField
                    label={"Faturamento:"}
                    value={externalCustomerName || customerName}
                  />
                </div>
                <div>
                  <InfoField label={"Orçamento:"} value={budget} />
                </div>
                <div>
                  <InfoField label={"Item cliente:"} value={itemCustomer} />
                </div>
                {/* <div className="hidden sm:block" /> */}
              </div>
            </div>

            <div className="mb-1 bg-neutral-50 p-1 rounded-xl space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <InfoField label={"Produto:"} value={product} />
                </div>

                <div>
                  <InfoField label={"Tipo de produto:"} value={productType} />
                </div>

                <div className="flex flex-col">
                  <InfoField label={"Entrega:"} value={dispatchDate} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <InfoField label={"Título:"} value={title} />
                </div>
                <div>
                  <InfoField label={"Subtítulo:"} value={subTitle} />
                </div>
                <div>
                  <InfoField label={"Data de Entrada:"} value={entryDate} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <InfoField label={"Arquivo:"} value={file} />
                </div>
                <div>
                  <InfoField
                    label={"Número NF:"}
                    value={so?.invoiceDetails?.nfNumber}
                  />
                </div>
                <div>
                  <InfoField
                    label={"Ordem de compra:"}
                    value={so?.invoiceDetails?.purchaseOrder}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <InfoField
                    label={"Representante:"}
                    value={representativeName}
                  />
                </div>
                <div>
                  <InfoField label={"Cód. forma:"} value={dieCutCode} />
                </div>
                <div>
                  <InfoField label={"Cód. clichê:"} value={clicheCode} />
                </div>
              </div>

              {/* <div className="flex flex-wrap justify-center text-xs">
                <div className="pr-2">
                  <InfoCheckbox
                    label="Arte-final"
                    checked={!!so.printerDetails?.finalArt}
                    style={{ paddingLeft: 0 }}
                  />
                </div>
                <div className="pr-2">
                  <InfoCheckbox
                    label="Tratamento de Imagem"
                    checked={!!so.printerDetails?.imageProcessing}
                  />
                </div>
                <div className="flex items-center gap-1 pl-2 pr-6">
                  <span>Prova Perfil ICC</span>
                  <input
                    type="text"
                    value={so.printerDetails?.quantityProfileTest || 0}
                    readOnly
                    className="w-8 border border-black rounded py-0.5 text-xs bg-white text-black text-center"
                  />
                </div>
                <div className="flex items-center gap-1 pl-1 pr-3">
                  <span>Printer</span>
                  <input
                    type="text"
                    value={so.printerDetails?.quantityPrinter || 0}
                    readOnly
                    className="w-7 border border-black rounded py-0.5 text-xs bg-white text-black text-center"
                  />
                </div>
                <div className="flex items-center gap-1 pl-2">
                  <span className="flex items-center gap-0.5">
                    <span className="text-black">easy</span>
                    <span className="text-[#F4A261]">flow</span>
                  </span>
                  <input
                    type="text"
                    value={
                      so.printerDetails?.easyflowFlowType
                        ? getLabelFromValue(
                            so.printerDetails?.easyflowFlowType,
                            easyflowTypeOptions,
                          )
                        : ""
                    }
                    readOnly
                    className="w-14 border border-black rounded px-1 py-0.5 text-xs bg-white text-black"
                  />
                </div>
              </div> */}
            </div>
            {/* 
            <div className="flex flex-col items-center justify-center -mb-4">
              <InfoField
                label={"Aproveitamento:"}
                value={""}
                className="w-32"
              />
            </div> */}

            <h2 className="text-lg text-center lg:text-left">Montagem</h2>

            {/* <div className=" bg-neutral-50 p-1 rounded-xl">
              <InfoField
                label={"Impressora:"}
                value={printerName}
                className="w-36"
              />
            </div> */}

            <div className=" bg-neutral-50 p-1 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <InfoField label={"Impressora:"} value={printerName} />
                <InfoField label={"Espessura:"} value={thicknesses} />
                <InfoField
                  label={"LAP/Orelha/Aba:"}
                  value={getLabelFromValue(flapPrinter, flapOptions)}
                />
                {/* <div className="flex flex-col items-end justify-end">
                  <label className="block text-lg font-semibold">Jogos:</label>
                  <input
                    type="text"
                    value={so.printerDetails?.setAmount}
                    readOnly
                    className="w-12 border rounded-[10px] border-black bg-black text-white text-center"
                  />
                </div> */}
              </div>
            </div>

            <div className=" bg-neutral-50 p-1 rounded-xl">
              <div className="grid grid-cols-3 gap-2">
                <InfoField label={"Cilindro:"} value={cylinder} suffix="mm" />

                <InfoField
                  label={"Poliéster Larg. Máx.:"}
                  value={polyesterMaxWidth}
                  suffix="mm"
                  className="max-w-1"
                />

                <InfoField
                  label={"Poliéster Alt. Máx.:"}
                  value={polyesterMaxHeight}
                  suffix="mm"
                />

                <InfoField label={"Distorção:"} value={distortion} suffix="%" />

                <InfoField
                  label={"Clichê Larg. Máx.:"}
                  value={clicheMaxWidth}
                  suffix="mm"
                />

                {/* nfNumber={so?.invoiceDetails?.nfNumber}
purchaseOrder={so?.invoiceDetails?.purchaseOrder} */}

                <InfoField
                  label={"Clichê Alt. Máx.:"}
                  value={clicheMaxHeight}
                  suffix="mm"
                />
              </div>

              <div className="flex items-center justify-center">
                <label className="block text-lg font-semibold mr-1 mt-1">
                  Jogos:
                </label>
                <input
                  type="text"
                  value={so.printerDetails?.setAmount}
                  readOnly
                  className="w-12 border rounded-[10px] border-black bg-black text-white text-center"
                />
              </div>
            </div>

            {/* <div className="mb-1 bg-neutral-50 p-1 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
                <InfoField
                  label={"Espessura:"}
                  value={thicknesses}
                  className="w-32"
                />
                <InfoField
                  label={"LAP/Orelha/Aba:"}
                  value={getLabelFromValue(flapPrinter, flapOptions)}
                  className="w-32"
                />
                <div className="flex flex-col items-end justify-end">
                  <label className="block text-lg font-semibold">Jogos:</label>
                  <input
                    type="text"
                    value={so.printerDetails?.setAmount}
                    readOnly
                    className="w-12 border rounded-[10px] border-black bg-black text-white text-center"
                  />
                </div>
              </div>
            </div> */}

            <ColorsAndDimensions
              trap={trap}
              colorsPattern={colorsPattern}
              profileName={profileName}
              colors={colors ?? []}
              measures={
                so.printerDetails?.corrugatedPrinterDetails?.measures?.colors ??
                []
              }
              colorsTableRows={4}
              budget={budget}
              totalPrice={displayPrice || 0}
              totalMeasuresCliche={
                so.printerDetails?.corrugatedPrinterDetails?.measures
                  ?.totalMeasuresCliche
              }
              showPrices={hasPermission(PermissionType.VIEW_PCP_PRICES)}
            />

            {/* <div className="mb-1 bg-neutral-50 p-1 rounded-xl flex flex-col sm:flex-row justify-between gap-4">
              <InfoField
                label={"Perfil:"}
                value={profiles[0]?.name}
                className="w-32"
              />

              <div className="flex flex-col sm:flex-row gap-4 ml-auto">
                <InfoField
                  label={"Padrão de cores:"}
                  value={so?.printerDetails?.colorsPattern}
                  className="w-52"
                />

                <div className="flex items-center gap-1 text-xs">
                  <label className="whitespace-nowrap">Trap:</label>
                  <input
                    type="text"
                    value={trap}
                    readOnly
                    className="min-h-[20px] w-14 border rounded-[6px] border-black px-2 bg-white text-black text-left text-xs"
                  />
                  <span className="text-xs">mm</span>
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Trap:</label>
                    <input
                      type="text"
                      value={trap}
                      readOnly
                      className="w-16 border rounded-[10px] border-black px-2 bg-white text-black"
                    />
                  </div>
                  <span className="text-sm">mm</span>
                </div>
              </div>
            </div> */}

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-sm mb-1">Observações:</label>
                <div className="relative border rounded-[10px] border-black p-4 h-32">
                  <span className="relative text-base text-black">{notes}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Anexo:</label>
                <PdfPreview serviceOrderId={so.id} fileType="serviceOrder" />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Ficha de impressão:
                </label>
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

export default ClicheCorrugatedModal;
