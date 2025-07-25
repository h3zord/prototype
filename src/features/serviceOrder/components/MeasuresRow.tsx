import {
  ServiceOrderProductType,
  DieCutBlockOrigin,
  ServiceOrderProduct,
} from "../../../types/models/serviceorder";

export const MeasuresRow = ({ serviceOrder }: any) => {
  const isNewAlterationOrReplacement =
    serviceOrder?.productType === ServiceOrderProductType.NEW ||
    serviceOrder?.productType === ServiceOrderProductType.ALTERATION ||
    serviceOrder?.productType === ServiceOrderProductType.REPLACEMENT ||
    serviceOrder?.productType === ServiceOrderProductType.REPRINT;

  // const isReform = serviceOrder?.productType === ServiceOrderProductType.REFORM;
  const isRepair = serviceOrder?.productType === ServiceOrderProductType.REPAIR;
  const isReassembly =
    serviceOrder?.productType === ServiceOrderProductType.REASSEMBLY;

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
    <div className="text-[10px]">
      {serviceOrder.product === ServiceOrderProduct.DIECUTBLOCK ? (
        <div>
          {isNewAlterationOrReplacement && (
            <div>
              Metros Lineares Calha:{" "}
              {(
                dieCutBlockMeasures?.totalLinearMetersChannel ?? 0
              ).toLocaleString("pt-BR", {
                maximumFractionDigits: 3,
                minimumFractionDigits: 0,
              })}
            </div>
          )}

          {hasDieCutBlockNational && (
            <div>
              Medidas Nacional:{" "}
              {(dieCutBlockMeasures?.totalMeasuresNational ?? 0).toLocaleString(
                "pt-BR",
                {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 0,
                },
              )}
            </div>
          )}

          {hasDieCutBlockImported && (
            <div>
              Medidas Importada:{" "}
              {(dieCutBlockMeasures?.totalMeasuresImported ?? 0).toLocaleString(
                "pt-BR",
                {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 0,
                },
              )}
            </div>
          )}
        </div>
      ) : null}

      {serviceOrder.product === ServiceOrderProduct.CLICHE_CORRUGATED ? (
        <div>
          {serviceOrder.renovationRepair?.includes("Troca de poliester") ? (
            <div>
              Poliester Metros Lineares:{" "}
              {clicheCorrugatedMeasures?.polyesterLinearMetersUsed}
            </div>
          ) : null}

          {serviceOrder.renovationRepair?.includes("Troca de canaleta") ? (
            <div>
              Canaleta Metros Lineares:{" "}
              {clicheCorrugatedMeasures?.channelLinearMetersUsed}
            </div>
          ) : null}

          {isNewAlterationOrReplacement || isReassembly ? (
            <div>
              Medidas Clichê:{" "}
              {(
                clicheCorrugatedMeasures?.totalMeasuresCliche ?? 0
              ).toLocaleString("pt-BR", {
                maximumFractionDigits: 3,
                minimumFractionDigits: 0,
              })}
            </div>
          ) : null}

          {isRepair ? <div>Qtd. Cores: {quantityColorsToRepair}</div> : null}
        </div>
      ) : null}
    </div>
  );
};
