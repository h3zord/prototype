import { formatPrice } from "../../../helpers/formatter";
import { ServiceOrderProduct } from "../../../types/models/serviceorder";

export const PriceRow = ({ serviceOrder }: any) => {
  const hasImageProcessing = serviceOrder?.printerDetails?.imageProcessing;
  const hasFinalArt = serviceOrder?.printerDetails?.finalArt;
  const hasEasyFlow = serviceOrder?.printerDetails?.easyflow;
  const hasPrinter = serviceOrder?.printerDetails?.quantityPrinter > 0;
  const hasProofICC = serviceOrder?.printerDetails?.quantityProfileTest > 0;

  return (
    <div className="text-[10px]">
      {serviceOrder.product === ServiceOrderProduct.DIECUTBLOCK ? (
        <div>{`Faca: ${formatPrice({ price: serviceOrder.totalPrice })}`}</div>
      ) : null}

      {serviceOrder.product === ServiceOrderProduct.CLICHE_CORRUGATED ? (
        <div>
          <div>{`Clichê: ${formatPrice({ price: serviceOrder.totalClicheCorrugated, digits: 3 })}`}</div>

          {hasImageProcessing && (
            <div>{`Trat. Image: ${formatPrice({ price: serviceOrder.imageProcessingPrice })}`}</div>
          )}
          {hasFinalArt && (
            <div>{`Arte Final: ${formatPrice({ price: serviceOrder.finalArtPrice })}`}</div>
          )}
          {hasEasyFlow && (
            <div>{`Easyflow: ${formatPrice({ price: serviceOrder.easyflowPrice })}`}</div>
          )}
          {hasPrinter && (
            <div>{`Printer: ${formatPrice({ price: serviceOrder.totalPrinting })}`}</div>
          )}
          {hasProofICC && (
            <div>
              {`Prova ICC: ${formatPrice({ price: serviceOrder.totalProfileProofIcc })}`}
            </div>
          )}
          <div>{`Total: ${formatPrice({ price: serviceOrder.totalPrice, digits: 3 })}`}</div>
        </div>
      ) : null}
    </div>
  );
};
