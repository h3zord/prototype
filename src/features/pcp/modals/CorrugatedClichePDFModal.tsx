import html2pdf from "html2pdf.js";
import { Button, Modal } from "../../../components";
import { formatDate, formatPrice } from "../../../helpers/formatter";
import { getLabelFromValue } from "../../../helpers/options/getOptionFromValue";
import {
  easyflowTypeOptions,
  serviceOrderProductOptions,
  tintOptions,
} from "../../../helpers/options/serviceorder";
import { ServiceOrderProductType } from "../../../types/models/serviceorder";
import { flapOptions } from "../../../helpers/options/printer";
import { unitAbbrevOptions } from "../../../helpers/options/customer";
import flexograv from "../../../assets/images/logo_flexograv_cinza.png";
import { getProductTypeOptions } from "../../serviceOrder/api/helpers";

interface CorrugatedClichePDFModalProps {
  onClose: () => void;
  selectedServiceOrder: any;
}

// Function to generate PDF
const generatePDF = () => {
  const element = document.getElementById("pdf-content");

  if (element) {
    html2pdf()
      .set({
        filename: "Service_Order.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: { format: "a4", orientation: "portrait" },
        pagebreak: { mode: "avoid-all" },
      })
      .from(element)
      .save();
  } else {
    console.error("Element with id 'pdf-content' not found.");
  }
};

const InfoField = ({ label, value }) => {
  return (
    <div className="flex gap-1">
      <div className="pt-1">{label}</div>
      <div className="bg-white rounded border-gray-500 border p-1 flex-1 break-all">
        {value}
      </div>
    </div>
  );
};

const CheckBoxField = ({ label, checked }) => {
  return (
    <label className={`flex items-center space-x-2 w-fit`}>
      <input
        checked={checked}
        disabled={true}
        type="checkbox"
        className="h-4 w-4 border-2 focus:outline-none accent-orange-400 border-gray-300 rounded-full bg-[#f4f4f4] checked:bg-black checked:border-black"
      />
      <span>{label}</span>
    </label>
  );
};

const ColorsMeasureTable = ({ selectedServiceOrder }) => {
  return (
    <div>
      <table className="w-full mt-4 ">
        <thead className="bg-[#f4f4f4]">
          <tr>
            <th className="border p-2">Qtd</th>
            <th className="border p-2">Largura</th>
            <th className="border p-2">Altura</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {selectedServiceOrder.printerDetails?.corrugatedPrinterDetails?.measures?.colors?.map(
            (row, i) => (
              <tr key={i} className="border">
                <td>{row.quantity}</td>
                <td>{row.width}</td>
                <td>{row.height}</td>
                <td>{row.totalMeasure}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

const MeasuresClicheField = ({ selectedServiceOrder }) => {
  const productType = selectedServiceOrder?.productType;

  // const isReform = productType === ServiceOrderProductType.REFORM;

  const isNewAlterationReassemblyOrReplacement =
    productType === ServiceOrderProductType.NEW ||
    productType === ServiceOrderProductType.ALTERATION ||
    productType === ServiceOrderProductType.REPLACEMENT ||
    productType === ServiceOrderProductType.REASSEMBLY;
  const isRepair = productType === ServiceOrderProductType.REPAIR;

  if (isNewAlterationReassemblyOrReplacement) {
    return <ColorsMeasureTable selectedServiceOrder={selectedServiceOrder} />;
  }
  // else if (isReform) {
  //   return (
  //     <>
  //       {selectedServiceOrder.renovationRepair?.includes(
  //         "Troca de poliester",
  //       ) ? (
  //         <div className="grid grid-cols-4 bg-[#f4f4f4] p-1 rounded-[16px]">
  //           Poliester
  //           <div>Quantidade: {measures?.polyesterAmount}</div>
  //           <div>Metros lineares: {measures?.polyesterLinearMeters}</div>
  //           <div>
  //             Mínimo no cliente: {selectedServiceOrder?.clicheReformMinimum}
  //           </div>
  //         </div>
  //       ) : null}
  //       {selectedServiceOrder.renovationRepair?.includes(
  //         "Troca de canaleta",
  //       ) ? (
  //         <div className="grid grid-cols-4 bg-[#f4f4f4] p-1 rounded-[16px]">
  //           <div>Canaleta</div>
  //           <div>Quantidade: {measures?.channelAmount}</div>
  //           <div>Metros lineares: {measures?.channelLinearMeters}</div>
  //           <div>
  //             Mínimo no cliente: {selectedServiceOrder?.clicheReformMinimum}
  //           </div>
  //         </div>
  //       ) : null}
  //       {selectedServiceOrder.renovationRepair?.includes(
  //         "Regravação de clichê",
  //       ) ? (
  //         <ColorsMeasureTable selectedServiceOrder={selectedServiceOrder} />
  //       ) : null}
  //     </>
  //   );
  // }
  else if (isRepair) {
    return (
      <>
        <div>
          {`Preço conserto: ${formatPrice({ price: selectedServiceOrder?.clicheRepairPrice })}`}
        </div>
      </>
    );
  }
  return null;
};

export const CorrugatedClichePDFModal: React.FC<
  CorrugatedClichePDFModalProps
> = ({ onClose, selectedServiceOrder }) => {
  const productType = selectedServiceOrder?.productType;

  const isRepair = productType === ServiceOrderProductType.REPAIR;
  const isReassembly = productType === ServiceOrderProductType.REASSEMBLY;

  console.log("🧐 [PDF Modal] selectedServiceOrder:", selectedServiceOrder);

  return (
    <Modal title="Ordem de Serviço" onClose={onClose} className="w-fit">
      {/* Download PDF Button */}
      <div className="mb-5">
        <Button onClick={generatePDF} variant="primary">
          Baixar PDF
        </Button>
      </div>

      {/* Content to Convert to PDF */}
      <div
        id="pdf-content"
        style={{ width: "800px", maxWidth: "100%", fontSize: 16 }}
        className="p-6 bg-white text-black text-xs space-y-3"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <img src={flexograv} className="w-[160px]" alt="Logo Flexograv" />
          </div>
          <div className="p-2 rounded-[16px] text-base">
            {getLabelFromValue(selectedServiceOrder.unit, unitAbbrevOptions)}{" "}
            {selectedServiceOrder.identificationNumber}
          </div>
          <div></div>
        </div>
        {/* Service Order Info */}
        <div className="grid grid-cols-3 gap-2 bg-[#f4f4f4] p-3 rounded-[16px]">
          <InfoField
            label="Cliente:"
            value={selectedServiceOrder.customer.name}
          />
          <InfoField
            label="Transporte:"
            value={selectedServiceOrder.transport.fantasyName}
          />
          <InfoField
            label="Operador:"
            value={
              <div>
                {selectedServiceOrder.operator.firstName}{" "}
                {selectedServiceOrder.operator.lastName}
              </div>
            }
          />
          <InfoField
            label="Faturamento:"
            value={
              selectedServiceOrder.externalCustomer
                ? selectedServiceOrder.externalCustomer.name
                : selectedServiceOrder.customer.name
            }
          />
          <InfoField
            label="Orçamento:"
            value={formatPrice({ price: selectedServiceOrder.budget })}
          />
          <InfoField label="OC:" value={selectedServiceOrder.purchaseOrder} />
        </div>
        <div className="grid grid-cols-3 gap-2 bg-[#f4f4f4] p-3 rounded-[16px]">
          <InfoField
            label="Tipo de Produto:"
            value={getLabelFromValue(
              selectedServiceOrder.productType,
              getProductTypeOptions(selectedServiceOrder.product)
            )}
          />
          <InfoField
            label="Produto:"
            value={getLabelFromValue(
              selectedServiceOrder.product,
              serviceOrderProductOptions
            )}
          />
          <InfoField
            label="Entrega:"
            value={formatDate(selectedServiceOrder.dispatchDate)}
          />
          <InfoField label="Título:" value={selectedServiceOrder.title} />
          <InfoField label="Subtítulo:" value={selectedServiceOrder.subTitle} />
          <InfoField
            label="Cód. Barras:"
            value={selectedServiceOrder.barCode}
          />
          <InfoField
            label="Item Forma:"
            value={selectedServiceOrder.printerDetails?.itemDieCutBlockInCliche}
          />
          <InfoField
            label="Item Clichê:"
            value={selectedServiceOrder.printerDetails?.itemCliche}
          />
          <InfoField label="Arquivo:" value={selectedServiceOrder.file} />
          <div className="grid grid-cols-5 col-span-3 gap-1">
            <CheckBoxField
              label="Arte Final"
              checked={selectedServiceOrder.printerDetails?.finalArt}
            />
            <CheckBoxField
              label="Tratamento imagem"
              checked={selectedServiceOrder.printerDetails?.imageProcessing}
            />
            <InfoField
              label="Prova Perfil ICC:"
              value={selectedServiceOrder.printerDetails?.quantityProfileTest}
            />
            <InfoField
              label="Printer:"
              value={selectedServiceOrder.printerDetails?.quantityPrinter}
            />
            <div>
              <CheckBoxField
                label="Easyflow"
                checked={selectedServiceOrder.printerDetails?.easyflow}
              />
              <div className="bg-white rounded border-gray-500 border p-1 flex-1">
                {selectedServiceOrder.printerDetails?.easyflowFlowType
                  ? getLabelFromValue(
                      selectedServiceOrder.printerDetails?.easyflowFlowType,
                      easyflowTypeOptions
                    )
                  : "-"}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div>Montagem</div>
          <div className="grid grid-cols-3 gap-2 bg-[#f4f4f4] p-3 rounded-[16px]">
            <InfoField
              label="Impressora:"
              value={selectedServiceOrder.printer?.name}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 bg-[#f4f4f4] p-3 rounded-[16px]">
            <InfoField
              label="Cilindro:"
              value={
                selectedServiceOrder.printerDetails?.corrugatedPrinterDetails
                  ?.cylinder
              }
            />
            <InfoField
              label="Poliéster Comprimento Máx.:"
              value={
                selectedServiceOrder.printerDetails?.corrugatedPrinterDetails
                  ?.polyesterMaxWidth
              }
            />
            <InfoField
              label="Poliéster Altura Máx.:"
              value={
                selectedServiceOrder.printerDetails?.corrugatedPrinterDetails
                  ?.polyesterMaxHeight
              }
            />
            <InfoField
              label="Clichê Comprimento Máx.:"
              value={
                selectedServiceOrder.printerDetails?.corrugatedPrinterDetails
                  ?.clicheMaxWidth
              }
            />
            <InfoField
              label="Clichê Altura Máx.:"
              value={
                selectedServiceOrder.printerDetails?.corrugatedPrinterDetails
                  ?.clicheMaxHeight
              }
            />
            <InfoField
              label="Distorção:"
              value={
                selectedServiceOrder.printerDetails?.corrugatedPrinterDetails
                  ?.distortion
              }
            />
            <InfoField
              label="Orelha:"
              value={getLabelFromValue(
                selectedServiceOrder.printerDetails?.corrugatedPrinterDetails
                  ?.flap,
                flapOptions
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 bg-[#f4f4f4] p-3 rounded-[16px]">
            <InfoField
              label="Espessura:"
              value={selectedServiceOrder.printerDetails?.thickness}
            />
            <InfoField
              label="Jogos:"
              value={selectedServiceOrder.printerDetails?.setAmount}
            />
          </div>
        </div>
        {/* Table */}
        <table className="w-full mt-4 ">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="border p-2">Clichê</th>
              <th className="border p-2">Tinta</th>
              <th className="border p-2">Lineatura</th>
              <th className="border p-2">Ângulo</th>
              <th className="border p-2">Tipo de ponto</th>
              <th className="border p-2">Curva</th>
            </tr>
          </thead>
          <tbody>
            {selectedServiceOrder.printerDetails?.colors.map((row, i) => (
              <tr key={i} className="border">
                <td>
                  <CheckBoxField label="" checked={row.recordCliche} />
                </td>
                <td>{getLabelFromValue(row.ink, tintOptions)}</td>
                <td>{row.lineature}</td>
                <td>{row.angle}</td>
                <td>{row.dotType}</td>
                <td>{row.curve}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>Medidas</div>
        {selectedServiceOrder?.printerDetails?.corrugatedPrinterDetails
          ?.measures ? (
          <>
            <MeasuresClicheField selectedServiceOrder={selectedServiceOrder} />
            <div className="grid grid-cols-3">
              {isRepair ? (
                <div>
                  Quantidade de cores:{" "}
                  {
                    selectedServiceOrder?.printerDetails?.quantityColorsToRepair
                  }{" "}
                </div>
              ) : (
                <div>
                  Total medidas clichê:{" "}
                  {
                    selectedServiceOrder?.printerDetails
                      ?.corrugatedPrinterDetails?.measures?.totalMeasuresCliche
                  }{" "}
                </div>
              )}
              <div>
                {`Preço clichê no cliente: ${
                  isReassembly
                    ? formatPrice({
                        price: selectedServiceOrder?.clicheReAssemblyPrice,
                        digits: 3,
                      })
                    : formatPrice({
                        price: selectedServiceOrder?.clicheCorrugatedPrice,
                      })
                } `}
              </div>
              <div>
                {`Preço clichê: ${formatPrice({ price: selectedServiceOrder?.totalClicheCorrugated })}`}
              </div>
            </div>
          </>
        ) : null}
        <div className="grid grid-cols-4 gap-2 bg-[#f4f4f4] p-3 rounded-[16px]">
          <InfoField
            label="Perfil:"
            value={selectedServiceOrder?.printerDetails?.profile?.name}
          />
          <div className="col-span-2">
            <InfoField
              label="Padrão de cores:"
              value={selectedServiceOrder?.printerDetails?.colorsPattern}
            />
          </div>
          <InfoField
            label="Trap:"
            value={selectedServiceOrder?.printerDetails?.trap}
          />
        </div>
      </div>
    </Modal>
  );
};
