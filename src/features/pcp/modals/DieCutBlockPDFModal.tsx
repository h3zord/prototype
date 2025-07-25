import html2pdf from "html2pdf.js";
import { Button, Modal } from "../../../components";
import { formatDate, formatPrice } from "../../../helpers/formatter";
import { getLabelFromValue } from "../../../helpers/options/getOptionFromValue";
import {
  originOptions,
  serviceOrderProductOptions,
  viewOptions,
  waveDirectionOptions,
} from "../../../helpers/options/serviceorder";
import { DieCutBlockOrigin } from "../../../types/models/serviceorder";
import flexograv from "../../../assets/images/logo_flexograv_cinza.png";
import { unitAbbrevOptions } from "../../../helpers/options/customer";
import { getProductTypeOptions } from "../../serviceOrder/api/helpers";

interface DieCutBlockPDFModalProps {
  onClose: () => void;
  selectedServiceOrder: any;
}

// Function to generate PDF
const generatePDF = () => {
  const element = document.getElementById("pdf-content"); // Select the HTML content

  html2pdf()
    .set({
      margin: 1, // Adds padding to prevent cut-off content
      filename: "Service_Order.pdf",
      image: { type: "jpeg", quality: 0.98 }, // Ensures high quality images
      html2canvas: {
        scale: 2, // Increases resolution to reduce distortion
        useCORS: true, // Fixes external asset loading issues
      },
      jsPDF: { format: "a4", orientation: "portrait" }, // Ensures A4 portrait layout
    })
    .from(element)
    .save();
};

const InfoField = ({ label, value }) => {
  return (
    <div className="flex gap-1">
      <div className="pt-1">{label}</div>
      <div className="bg-white rounded border-gray-500 border p-1 flex-1">
        {value}
      </div>
    </div>
  );
};

const NationalDieCutBlockMeasures = ({ selectedServiceOrder }) => {
  const measures = selectedServiceOrder?.dieCutBlockDetails?.measures;
  return (
    <div className="bg-[#f4f4f4] p-4 rounded">
      <table>
        <thead>
          <th className="font-normal">
            <div className="  mb-2 mx-2 text-gray-800 bg-gray-400 px-2 py-1 rounded">
              Faca Nacional
            </div>
          </th>
          <th className="border border-gray-500 font-normal">
            <div>Reta em cm:</div>
          </th>
          <th className="border border-gray-500 font-normal">
            <div>Curva em cm:</div>
          </th>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-500 text-center">
              <div>Faca:</div>
            </td>
            <td className="border border-gray-500">
              <div>{measures?.dieCutBlockNationalCutStraight}</div>
            </td>
            <td className="border border-gray-500">
              <div>{measures?.dieCutBlockNationalCutCurve}</div>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-500 text-center">
              <div>Vinco:</div>
            </td>
            <td className="border border-gray-500">
              <div>{measures?.dieCutBlockNationalCreaseStraight}</div>
            </td>
            <td className="border border-gray-500">
              <div>{measures?.dieCutBlockNationalCreaseCurve}</div>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-500 text-center">
              <div>Picote:</div>
            </td>
            <td className="border border-gray-500">
              <div>{measures?.dieCutBlockNationalPerforationStraight}</div>
            </td>
            <td className="border border-gray-500">
              <div>{measures?.dieCutBlockNationalPerforationStraight}</div>
            </td>
          </tr>
        </tbody>
      </table>
      Total Medidas:{" "}
      {measures?.totalMeasuresNational.toLocaleString("pt-BR", {
        maximumFractionDigits: 3,
        minimumFractionDigits: 0,
      })}
    </div>
  );
};

const ImportedDieCutBlockMeasures = ({ selectedServiceOrder }) => {
  const measures = selectedServiceOrder?.dieCutBlockDetails?.measures;
  return (
    <div className="bg-[#f4f4f4] p-4 rounded">
      <table>
        <thead>
          <th className="font-normal">
            <div className="  mb-2 mx-2 text-gray-800 bg-gray-400 px-2 py-1 rounded">
              Faca Importada
            </div>
          </th>
          <th className="border border-gray-500 font-normal">
            <div>Reta em cm:</div>
          </th>
          <th className="border border-gray-500 font-normal">
            <div>Curva em cm:</div>
          </th>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-500 text-center">
              <div>Faca:</div>
            </td>
            <td className="border border-gray-500">
              <div>{measures?.dieCutBlockImportedCutStraight}</div>
            </td>
            <td className="border border-gray-500">
              <div>{measures?.dieCutBlockImportedCutCurve}</div>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-500 text-center">
              <div>Vinco:</div>
            </td>
            <td className="border border-gray-500">
              <div>{measures?.dieCutBlockImportedCreaseStraight}</div>
            </td>
            <td className="border border-gray-500">
              <div>{measures?.dieCutBlockImportedCreaseCurve}</div>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-500 text-center">
              <div>Picote:</div>
            </td>
            <td className="border border-gray-500">
              <div>{measures?.dieCutBlockImportedPerforationStraight}</div>
            </td>
            <td className="border border-gray-500">
              <div>{measures?.dieCutBlockImportedPerforationCurve}</div>
            </td>
          </tr>
        </tbody>
      </table>
      Total Medidas:{" "}
      {measures?.totalMeasuresImported.toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      })}
    </div>
  );
};

const MeasuresDieCutBlockField = ({ selectedServiceOrder }) => {
  const origin = selectedServiceOrder?.dieCutBlockDetails?.origin;

  return (
    <div className="flex gap-2">
      {origin.includes(DieCutBlockOrigin.NATIONAL) ? (
        <NationalDieCutBlockMeasures
          selectedServiceOrder={selectedServiceOrder}
        />
      ) : null}
      {origin.includes(DieCutBlockOrigin.IMPORTED) ? (
        <ImportedDieCutBlockMeasures
          selectedServiceOrder={selectedServiceOrder}
        />
      ) : null}
    </div>
  );
};

export const DieCutBlockPDFModal: React.FC<DieCutBlockPDFModalProps> = ({
  onClose,
  selectedServiceOrder,
}) => {
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
        </div>{" "}
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
            label="Item Forma:"
            value={selectedServiceOrder.dieCutBlockDetails?.itemDieCutBlock}
          />
          <InfoField
            label="Cod. Item no Cliente:"
            value={selectedServiceOrder?.itemCodeOnCustomer}
          />
          <InfoField label="Arquivo:" value={selectedServiceOrder.file} />

          <InfoField label="Observação:" value={selectedServiceOrder.notes} />
        </div>
        <div className="space-y-3">
          <div>Montagem</div>
          <div className="grid grid-cols-3 gap-2 bg-[#f4f4f4] p-3 rounded-[16px]">
            <InfoField
              label="Impressora:"
              value={selectedServiceOrder?.printer?.name}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 bg-[#f4f4f4] p-3 rounded-[16px]">
            <InfoField
              label="Faca Origem:"
              value={selectedServiceOrder.dieCutBlockDetails?.origin?.map(
                (origin: string) => {
                  return getLabelFromValue(origin, originOptions) + " ";
                }
              )}
            />
            <InfoField
              label="Vista:"
              value={getLabelFromValue(
                selectedServiceOrder.dieCutBlockDetails?.view,
                viewOptions
              )}
            />
            <InfoField
              label="Po:"
              value={selectedServiceOrder.dieCutBlockDetails?.po}
            />
            <InfoField
              label="Sentido Onda:"
              value={getLabelFromValue(
                selectedServiceOrder.dieCutBlockDetails?.waveDirection,
                waveDirectionOptions
              )}
            />

            <InfoField
              label="Largura Caixa:"
              value={selectedServiceOrder.dieCutBlockDetails?.boxWidth}
            />
            <InfoField
              label="Altura Caixa:"
              value={selectedServiceOrder.dieCutBlockDetails?.boxHeight}
            />
            <InfoField
              label="Qtd. peças Largura:"
              value={
                selectedServiceOrder.dieCutBlockDetails?.piecesAmountInWidth
              }
            />
            <InfoField
              label="Qtd. peças Altura:"
              value={
                selectedServiceOrder.dieCutBlockDetails?.piecesAmountInHeight
              }
            />
            <InfoField
              label="Peças p/ Forma:"
              value={selectedServiceOrder.dieCutBlockDetails?.piecesAmount}
            />
          </div>
        </div>
        {selectedServiceOrder?.dieCutBlockDetails?.measures ? (
          <>
            <div className="grid grid-cols-4 bg-[#f4f4f4] p-1 rounded-[16px]">
              <div>Calha</div>
              <div>
                Quantidade:{" "}
                {
                  selectedServiceOrder?.dieCutBlockDetails?.measures
                    ?.channelQuantity
                }
              </div>
              <div>
                Mínimo da{" "}
                {
                  selectedServiceOrder?.dieCutBlockDetails?.measures
                    ?.channelName
                }
                :{" "}
                {
                  selectedServiceOrder?.dieCutBlockDetails?.measures
                    ?.channelMinimum
                }{" "}
                m
              </div>
              <div>
                Total metros lineares:{" "}
                {
                  selectedServiceOrder?.dieCutBlockDetails?.measures
                    ?.totalLinearMetersChannel
                }
              </div>
            </div>
            <MeasuresDieCutBlockField
              selectedServiceOrder={selectedServiceOrder}
            />
            <div className="grid grid-cols-3">
              <div>
                {`Preço faca nacional: ${formatPrice({ price: selectedServiceOrder?.dieCutBlockNationalPrice, digits: 3 })}`}
              </div>
              <div>
                {`Preço faca importada: ${formatPrice({ price: selectedServiceOrder?.dieCutBlockImportedPrice, digits: 3 })}`}
              </div>
              <div>{`Total: ${formatPrice({ price: selectedServiceOrder?.totalPrice })}`}</div>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
};
