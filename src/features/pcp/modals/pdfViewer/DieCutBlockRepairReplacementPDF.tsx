import flexograv from "../../../../assets/images/logo_flexograv_cinza.png";
import PdfPreview from "./pdfPreview";
import html2pdf from "html2pdf.js";
import React, { useRef, useState, useEffect } from "react";
import { Eye, EyeOff, FileText, Printer } from "lucide-react";
import { Modal } from "../../../../components";
import { formatDate, formatPrice } from "../../../../helpers/formatter";
import { Unit } from "../../../../types/models/customer";
import { usePermission } from "../../../../context/PermissionsContext";
import { PermissionType } from "../../../permissions/permissionsTable";
import { dieCutBlockReplacementSectorLabels } from "../../../../helpers/options/replacementSector";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import {
  useSaveServiceOrderAnnotation,
  useServiceOrderAnnotations,
} from "../../../serviceOrder/api/hooks";
import {
  DieCutBlockPDFProps,
  productLabels,
  productTypeLabels,
  ServiceOrder,
} from "./types";

const MeasureTable: React.FC<{
  title: string;
  measures: {
    cutStraight?: number;
    cutCurve?: number;
    creaseStraight?: number;
    creaseCurve?: number;
    perfStraight?: number;
    perfCurve?: number;
    total?: number;
  };
}> = ({ title, measures }) => (
  <article className="bg-white rounded-xl shadow-sm border flex flex-col">
    <header className="bg-neutral-100 rounded-t-xl px-1.5 py-1">
      <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
    </header>

    <table className="min-w-full text-[0.7rem]">
      <thead>
        <tr className="border-b text-gray-600">
          <th className="w-1/4 px-1.5 py-1 text-left font-medium" />
          <th className="w-1/4 px-1.5 py-1 text-center font-medium">
            Reta (metros)
          </th>
          <th className="w-1/4 px-1.5 py-1 text-center font-medium">
            Curva (metros)
          </th>
        </tr>
      </thead>

      <tbody className="divide-y">
        {[
          ["Faca", measures.cutStraight, measures.cutCurve],
          ["Vinco", measures.creaseStraight, measures.creaseCurve],
          ["Picote", measures.perfStraight, measures.perfCurve],
        ].map(([label, straight, curve]) => (
          <tr key={label as string} className="odd:bg-white even:bg-neutral-50">
            <th scope="row" className="px-1.5 py-1 font-normal text-left">
              {label}:
            </th>
            <td className="px-1.5 py-1 text-center">{straight ?? "–"}</td>
            <td className="px-1.5 py-1 text-center">{curve ?? "–"}</td>
          </tr>
        ))}
      </tbody>

      <tfoot>
        <tr>
          <td colSpan={3} className="px-1.5 py-1 text-right font-medium">
            Total medidas:{" "}
            {typeof measures.total === "number" && !isNaN(measures.total)
              ? measures.total.toLocaleString("pt-BR", {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 0,
                })
              : "–"}{" "}
            m
          </td>
        </tr>
      </tfoot>
    </table>
  </article>
);

export const DieCutBlockMeasures: React.FC<{
  selectedServiceOrder: ServiceOrder;
}> = ({ selectedServiceOrder }) => {
  const m = selectedServiceOrder?.dieCutBlockDetails?.measures;

  return (
    <section className="grid gap-4 lg:grid-cols-2 text-xs">
      <MeasureTable
        title="Faca Nacional"
        measures={{
          cutStraight: m?.dieCutBlockNationalCutStraight,
          cutCurve: m?.dieCutBlockNationalCutCurve,
          creaseStraight: m?.dieCutBlockNationalCreaseStraight,
          creaseCurve: m?.dieCutBlockNationalCreaseCurve,
          perfStraight: m?.dieCutBlockNationalPerforationStraight,
          perfCurve: m?.dieCutBlockNationalPerforationCurve,
          total: m?.totalMeasuresNational,
        }}
      />

      <MeasureTable
        title="Faca Importada"
        measures={{
          cutStraight: m?.dieCutBlockImportedCutStraight,
          cutCurve: m?.dieCutBlockImportedCutCurve,
          creaseStraight: m?.dieCutBlockImportedCreaseStraight,
          creaseCurve: m?.dieCutBlockImportedCreaseCurve,
          perfStraight: m?.dieCutBlockImportedPerforationStraight,
          perfCurve: m?.dieCutBlockImportedPerforationCurve,
          total: m?.totalMeasuresImported,
        }}
      />
    </section>
  );
};

const unitWatermarkConfig = {
  [Unit.RS_PORTO_ALEGRE]: { color: "rgba(34, 139, 34, 0.08)", label: "POA" },
  [Unit.SP_INDAIATUBA]: { color: "rgba(30, 144, 255, 0.08)", label: "IND" },
  [Unit.RS_FARROUPILHA]: { color: "rgba(255, 69, 0, 0.08)", label: "FRR" },
};

const printPDF = () => {
  const element = document.getElementById("pdf-content");
  if (!element) return console.error("Element not found");

  const unitWatermark = element.getAttribute("data-unit-watermark") || "POA";
  const unitKey = Object.keys(unitWatermarkConfig).find(
    (key) =>
      unitWatermarkConfig[key as keyof typeof unitWatermarkConfig].label ===
      unitWatermark,
  ) as keyof typeof unitWatermarkConfig;

  const watermarkColor = unitKey
    ? unitWatermarkConfig[unitKey].color
    : "rgba(0, 0, 0, 0.08)";

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
    .toPdf()
    .get("pdf")
    .then((pdf: any) => {
      const totalPages = pdf.internal.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;

        pdf.setFont(undefined, "bold");

        const desiredWidth = pageWidth * 0.95;
        let fontSize = 50;

        do {
          pdf.setFontSize(fontSize);
          const textWidth = pdf.getTextWidth(unitWatermark);

          if (textWidth >= desiredWidth) {
            break;
          }
          fontSize += 10;
        } while (fontSize < 500);

        while (
          pdf.getTextWidth(unitWatermark) > desiredWidth &&
          fontSize > 50
        ) {
          fontSize -= 1;
          pdf.setFontSize(fontSize);
        }

        const rgbMatch = watermarkColor.match(
          /rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/,
        );
        if (rgbMatch) {
          const [, r, g, b, a] = rgbMatch;
          pdf.setTextColor(parseInt(r), parseInt(g), parseInt(b));
          pdf.setGState(pdf.GState({ opacity: parseFloat(a) }));
        } else {
          pdf.setTextColor(0, 0, 0);
          pdf.setGState(pdf.GState({ opacity: 0.08 }));
        }

        const centerX = pageWidth / 2;
        const centerY = pageHeight / 2;

        pdf.text(unitWatermark, centerX, centerY, {
          align: "center",
          angle: 0,
        });

        pdf.setGState(pdf.GState({ opacity: 1 }));
      }
      return pdf;
    })
    .outputPdf("blob")
    .then((pdfBlob: Blob) => {
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

  const unitWatermark = element.getAttribute("data-unit-watermark") || "POA";
  const unitKey = Object.keys(unitWatermarkConfig).find(
    (key) =>
      unitWatermarkConfig[key as keyof typeof unitWatermarkConfig].label ===
      unitWatermark,
  ) as keyof typeof unitWatermarkConfig;

  const watermarkColor = unitKey
    ? unitWatermarkConfig[unitKey].color
    : "rgba(0, 0, 0, 0.08)";

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
    .toPdf()
    .get("pdf")
    .then((pdf: any) => {
      const totalPages = pdf.internal.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;

        pdf.setFont(undefined, "bold");

        const desiredWidth = pageWidth * 0.95;
        let fontSize = 50;

        do {
          pdf.setFontSize(fontSize);
          const textWidth = pdf.getTextWidth(unitWatermark);

          if (textWidth >= desiredWidth) {
            break;
          }
          fontSize += 10;
        } while (fontSize < 500);

        while (
          pdf.getTextWidth(unitWatermark) > desiredWidth &&
          fontSize > 50
        ) {
          fontSize -= 1;
          pdf.setFontSize(fontSize);
        }

        const rgbMatch = watermarkColor.match(
          /rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/,
        );
        if (rgbMatch) {
          const [, r, g, b, a] = rgbMatch;
          pdf.setTextColor(parseInt(r), parseInt(g), parseInt(b));
          pdf.setGState(pdf.GState({ opacity: parseFloat(a) }));
        } else {
          pdf.setTextColor(0, 0, 0);
          pdf.setGState(pdf.GState({ opacity: 0.08 }));
        }

        const centerX = pageWidth / 2;
        const centerY = pageHeight / 2;

        pdf.text(unitWatermark, centerX, centerY, {
          align: "center",
        });

        pdf.setGState(pdf.GState({ opacity: 1 }));
      }
      return pdf;
    })
    .save();
};

interface InfoFieldProps {
  label: string;
  value: string | number | null | undefined;
  className?: string;
  suffix?: string;
}

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

const DieCutBlockRepairReplacementPDF: React.FC<DieCutBlockPDFProps> = ({
  onClose,
  selectedServiceOrder: so,
}) => {
  const { hasPermission, user } = usePermission();
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [tool, setTool] = useState<"none" | "draw" | "erase">("none");

  console.log("hasPermission", hasPermission);

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

  const getUnitWatermarkColor = (unit?: string): string => {
    if (!unit || !isValidUnit(unit)) return "rgba(0, 0, 0, 0.08)";
    return unitWatermarkConfig[unit]?.color || "rgba(0, 0, 0, 0.08)";
  };

  const customerName = so.customer?.fantasyName || so.customer?.name;
  const transportName = so.transport?.name;
  const operatorName = `${so.operator?.firstName} ${so.operator?.lastName}`;
  const representativeName = so.customer?.representative
    ? `${so.customer?.representative?.firstName} ${so.customer?.representative?.lastName}`
    : "";
  const dispatchDate = so.dispatchDate ? formatDate(so.dispatchDate) : "";
  const entryDate = so.entryDate ? formatDate(so.entryDate) : "";
  const title = so.title;
  const subTitle = so.subTitle;
  const dieCutCode = so.dieCutBlockDetails?.itemDieCutBlock;
  const notes = so.notes;
  const procedure = so.customer?.procedure;
  const budget = formatPrice({ price: so.budget ?? 0 });
  const product = productLabels[so.product];
  const renovationRepair = so.renovationRepair
    ?.map((repair) => repair)
    .join(", ");
  const productType = productTypeLabels[so.productType];
  const replacementProductType = productTypeLabels[so.replacementProductType];
  const sector = dieCutBlockReplacementSectorLabels[so.sector];
  const reasonReplacement = so.reasonReplacement.join(", ");
  const replacementResponsibles = so.replacementResponsibles
    ?.map((responsible) => `${responsible.firstName} ${responsible.lastName}`)
    .join(", ");
  const clicheCode = so.itemCodeOnCustomer;
  const purchaseOrder =
    so?.invoiceDetails?.purchaseOrder || so.purchaseOrder || "";
  const nfNumber = so.invoiceDetails?.nfNumber;
  const reuseServiceOrderId = so.reuseSourceOrderId;

  const isAdmin = user?.group?.name === "Administrador";

  const unitAbbreviation = getUnitAbbreviation(so.unit);
  const watermarkColor = getUnitWatermarkColor(so.unit);

  function calculateTotalDieCutPrice({
    productType,
    origin,
    measures,
    prices,
    channelMinimum,
    channelQuantity,
  }: {
    productType: string;
    origin: string[];
    measures: {
      totalMeasuresNational?: number;
      totalMeasuresImported?: number;
    };
    prices: {
      national: number;
      imported: number;
    };
    channelMinimum?: number;
    channelQuantity?: number;
  }) {
    const nationalMeasures = measures.totalMeasuresNational ?? 0;
    const importedMeasures = measures.totalMeasuresImported ?? 0;
    const nationalPrice = prices.national;
    const importedPrice = prices.imported;
    const totalLinearMeters = (channelQuantity ?? 0) * (channelMinimum ?? 0);

    const isRepair = productType === "REPAIR";
    const isNewType = [
      "NEW",
      "ALTERATION",
      "REPLACEMENT",
      "RECONFECTION",
    ].includes(productType);

    const hasNational = origin.includes("NATIONAL");
    const hasImported = origin.includes("IMPORTED");

    if (isNewType) {
      if (hasNational && hasImported) {
        return (
          (nationalMeasures + totalLinearMeters) * nationalPrice +
          importedMeasures * importedPrice
        );
      } else if (hasNational) {
        return (nationalMeasures + totalLinearMeters) * nationalPrice;
      } else if (hasImported) {
        return (
          totalLinearMeters * nationalPrice + importedMeasures * importedPrice
        );
      }
    } else if (isRepair) {
      if (hasNational && hasImported) {
        return (
          nationalMeasures * nationalPrice + importedMeasures * importedPrice
        );
      } else if (hasNational) {
        return nationalMeasures * nationalPrice;
      } else if (hasImported) {
        return importedMeasures * importedPrice;
      }
    }

    return 0;
  }

  const totalDieCutPrice = calculateTotalDieCutPrice({
    productType: so.productType,
    origin: so.dieCutBlockDetails?.origin ?? [],
    measures: so.dieCutBlockDetails?.measures ?? {},
    prices: {
      national: so?.dieCutBlockNationalPrice ?? 0,
      imported: so?.dieCutBlockImportedPrice ?? 0,
    },
    channelMinimum: so?.printer?.corrugatedPrinter?.channelMinimum,
    channelQuantity: so?.dieCutBlockDetails?.measures?.channelQuantity,
  });

  const isCustomer = user?.group?.name === "Cliente";

  console.log("aaaa", user?.group);

  const displayPrice =
    isCustomer && so.budget && so.budget > 0 ? so.budget : totalDieCutPrice;

  return (
    <Modal title="Relatório Flexo" onClose={onClose} className="w-fit">
      <div className="min-h-full bg-white p-6 text-black">
        <style>{`
  @media print {
    .print-watermark {
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      z-index: 1 !important;
      pointer-events: none !important;
      user-select: none !important;
      font-family: Arial, sans-serif !important;
      font-size: 18vw !important;
      font-weight: 900 !important;
      width: 95% !important;
      text-align: center !important;
      line-height: 1 !important;
      color: ${watermarkColor} !important;
      opacity: 0.3 !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      max-width: 95% !important;
    }
    
    .print-watermark::before,
    .print-watermark::after {
      display: none !important;
    }

    .pdf-content-wrapper {
      position: relative !important;
      z-index: 2 !important;
    }
  }
}`}</style>

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

        <div className="print-watermark"></div>

        <div
          id="pdf-content"
          data-unit-watermark={unitAbbreviation}
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
                    {unitAbbreviation}
                  </span>
                  <span className="text-gray-300 text-3xl font-semibold">
                    {so.id}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-lg text-center lg:text-left mt-4">
              Dados de Serviço
            </h2>

            <div className="bg-neutral-50 p-1 rounded-xl space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <InfoField label={"Cliente:"} value={customerName} />
                <InfoField label={"Transporte:"} value={transportName} />
                <InfoField label={"Item forma:"} value={dieCutCode} />
                <InfoField label={"Faturamento:"} value={customerName} />
                <InfoField label={"Orçamento:"} value={budget} />
                <InfoField label={"Item cliente:"} value={clicheCode} />
                <InfoField label={"Produto:"} value={product} />
                <InfoField label={"Tipo de produto:"} value={productType} />
                <InfoField label={"Entrada:"} value={entryDate} />
                <InfoField label={"Título:"} value={title} />
                <InfoField label={"Subtítulo:"} value={subTitle} />
                <InfoField label={"Entrega:"} value={dispatchDate} />
                <InfoField label={"Ordem de compra:"} value={purchaseOrder} />
                {nfNumber && (
                  <InfoField label={"Número NF:"} value={nfNumber} />
                )}
                <InfoField
                  label={"Representante:"}
                  value={representativeName}
                />
                <InfoField label={"Operador:"} value={operatorName} />
                <InfoField label={"OS original:"} value={reuseServiceOrderId} />
              </div>
            </div>

            <h2 className="text-lg text-center lg:text-left mt-4">
              Dados da Reposição
            </h2>

            <div className="bg-neutral-50 p-1 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
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

            <h2 className="text-lg text-center lg:text-left mt-4">
              Dados do Conserto
            </h2>

            <div className=" bg-neutral-50 p-1 rounded-xl mb-4">
              <div className="">
                <InfoField label="Tipo do conserto:" value={renovationRepair} />
              </div>
            </div>

            <h2 className="text-lg text-center lg:text-left mt-2">Medidas</h2>

            <div className="mb-1 bg-neutral-50 p-3 rounded-xl flex justify-center items-center text-center gap-x-10 whitespace-nowrap overflow-auto">
              <div>
                Quantidade de Calhas:{" "}
                {so?.dieCutBlockDetails?.measures?.channelQuantity}
              </div>
              <div>
                Mínimo da {so?.dieCutBlockDetails?.measures?.channelName}:{" "}
                {so?.dieCutBlockDetails?.measures?.channelMinimum} m
              </div>
              <div>
                Total metros lineares:{" "}
                {so?.dieCutBlockDetails?.measures?.totalLinearMetersChannel} m
              </div>
            </div>

            <div className="mb-1 rounded-xl mt-2">
              <DieCutBlockMeasures selectedServiceOrder={so} />
            </div>
            {hasPermission(PermissionType.VIEW_PCP_PRICES) && (
              <div className="flex justify-end">
                <div className="space-y-1 bg-neutral-50 p-2 border rounded-[4px] mt-4 mr-4">
                  <div className="flex justify-end gap-2 text-xs">
                    <strong className="w-[110px] text-right">
                      Metragem Total:
                    </strong>
                    <span>
                      {(
                        (so?.dieCutBlockDetails?.measures
                          ?.totalMeasuresImported ?? 0) +
                        (so?.dieCutBlockDetails?.measures
                          ?.totalMeasuresNational ?? 0) +
                        (so?.dieCutBlockDetails?.measures
                          ?.totalLinearMetersChannel ?? 0)
                      ).toLocaleString("pt-BR", {
                        maximumFractionDigits: 3,
                        minimumFractionDigits: 0,
                      })}{" "}
                      metros
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <strong className="w-[110px] text-right">
                      Valor Total:
                    </strong>
                    <span>
                      {formatPrice({ price: displayPrice, digits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-around gap-8 mt-6">
              <div className="flex-1">
                <label className="block text-sm">Observações:</label>
                <div className="relative border rounded-[10px] border-black p-2 h-[145px] w-full overflow-y-auto">
                  <span className="relative text-xs text-black break-words whitespace-pre-wrap">
                    {notes}
                  </span>
                </div>
              </div>

              {!isCustomer && (
                <div className="flex-1">
                  <label className="block text-sm">Procedimentos:</label>
                  <div className="relative border rounded-[10px] border-black p-2 h-[145px] w-full overflow-y-auto">
                    <span className="relative text-xs text-black break-words whitespace-pre-wrap">
                      {procedure}
                    </span>
                  </div>
                </div>
              )}
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

export default DieCutBlockRepairReplacementPDF;
