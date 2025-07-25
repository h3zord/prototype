// src/features/deliveriesOfTheDay/DispatchReportPDF.tsx
import React, { useRef, useState, useEffect } from "react";
import { FileText, Printer } from "lucide-react";
import easyflowLogo from "../../../../assets/images/logo_flexograv_cinza.png";
import html2pdf from "html2pdf.js";
import { formatDate } from "../../../../helpers/formatter";
import { Modal } from "../../../../components";
import { fetchUser } from "../../../../context/api/PermissionsService"; // instância axios configurada

export interface DispatchReportItem {
  quantity: number;
  client: string;
  clicheItem: string;
  itemDieCutBlock: string;
  productType: string;
  title: string;
}

export interface DispatchReportPDFProps {
  items: DispatchReportItem[];
  reportSubtitle: string;
  onClose: () => void;
}

const DispatchReportPDF: React.FC<DispatchReportPDFProps> = ({
  items,
  reportSubtitle,
  onClose,
}) => {
  const [userName, setUserName] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const now = new Date();

  console.log("reportSubtitle", reportSubtitle);

  // Buscar usuário autenticado
  useEffect(() => {
    fetchUser()
      .then((user) => {
        // combinar primeiro nome e sobrenome
        const fullName = `${user.firstName} ${user.lastName}`.trim();
        setUserName(fullName);
      })
      .catch(() => setUserName(""));
  }, []);

  const printPDF = () => {
    if (!contentRef.current) return;
    html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: `Relatorio_Expedicao_${formatDate(now)}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all"] },
      })
      .from(contentRef.current)
      .outputPdf("blob")
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const win = window.open(url);
        if (win) {
          win.onload = () => {
            win.focus();
            win.print();
          };
        }
      });
  };

  const generatePDF = () => {
    if (!contentRef.current) return;
    html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: `Relatorio_Expedicao_${formatDate(now)}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all"] },
      })
      .from(contentRef.current)
      .save();
  };

  // sempre renderizar 28 linhas
  const TOTAL_ROWS = 28;
  const rows = Array.from({ length: TOTAL_ROWS }).map((_, idx) => {
    const it = items[idx];
    return {
      quantity: it?.quantity ?? "",
      client: it?.client?.toUpperCase() ?? "",
      clicheItem: it?.clicheItem ?? "",
      itemDieCutBlock: it?.itemDieCutBlock ?? "",
      productType: it?.productType?.toUpperCase() ?? "",
      title: it?.title?.toUpperCase() ?? "",
    };
  });

  return (
    <Modal
      title="Relatório de Expedição"
      onClose={onClose}
      className="w-[820px]"
    >
      <div className="flex justify-end gap-4 mb-2">
        <div title="Gerar PDF">
          <FileText
            onClick={generatePDF}
            className="w-6 h-6 text-gray-600 cursor-pointer"
          />
        </div>
        <div title="Imprimir">
          <Printer
            onClick={printPDF}
            className="w-6 h-6 text-gray-600 cursor-pointer"
          />
        </div>
      </div>

      <div
        id="pdf-content"
        ref={contentRef}
        className="bg-white border border-black p-4 text-black"
        style={{ fontSize: 12 }}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-2">
          <img
            src={easyflowLogo}
            alt="easyflow"
            className="h-10 object-contain"
          />
          <div className="text-center">
            <div className="text-md font-bold">Relatório de Expedição</div>
            <div className="text-sm">
              {reportSubtitle === "All" ? "Todos" : reportSubtitle}
            </div>
          </div>
          <div className="text-right text-xs">
            <div>Data: {formatDate(now)}</div>
            <div>Hora: {now.toLocaleTimeString()}</div>
          </div>
        </div>
        <hr className="border-black mb-2" />

        {/* Tabela */}
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border px-1 py-1 font-bold">Qtd</th>
              <th className="border px-1 py-1 font-bold">Cliente</th>
              {(reportSubtitle === "All" ||
                reportSubtitle === "Clichê Corrugado") && (
                <th className="border px-1 py-1 font-bold">Item Clichê</th>
              )}

              {(reportSubtitle === "All" || reportSubtitle === "Forma") && (
                <th className="border px-1 py-1 font-bold">Item Forma</th>
              )}
              <th className="border px-1 py-1 font-bold">Tipo de Produto</th>
              <th className="border px-1 py-1 font-bold">Título</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={i % 2 !== 0 ? "bg-gray-100" : ""}>
                <td className="border px-1 py-1 text-center">{r.quantity}</td>
                <td className="border px-1 py-1 uppercase">{r.client}</td>
                {(reportSubtitle === "All" ||
                  reportSubtitle === "Clichê Corrugado") && (
                  <td className="border px-1 py-1">{r.clicheItem}</td>
                )}

                {(reportSubtitle === "All" || reportSubtitle === "Forma") && (
                  <td className="border px-1 py-1">{r.itemDieCutBlock}</td>
                )}
                <td className="border px-1 py-1 uppercase font-semibold">
                  {r.productType}
                </td>
                <td className="border px-1 py-1 uppercase">{r.title}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Rodapé */}
        <div className="mt-4 text-right text-sm">
          Despachado por: <strong className="text-xs">{userName}</strong>
        </div>
      </div>
    </Modal>
  );
};

export default DispatchReportPDF;
