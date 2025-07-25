import React, { useState } from "react";
import { ServiceOrderProduct } from "../../../../types/models/serviceorder";
import { MoreHorizontal } from "lucide-react";

export const ShowMoreProducts = React.memo(
  ({ serviceOrder }: { serviceOrder: any }) => {
    const [showMore, setShowMore] = useState(false);

    if (!serviceOrder) return null;

    const products: string[] = [];
    if (serviceOrder.product === ServiceOrderProduct.CLICHE_CORRUGATED) {
      products.push("Clichê Corrugado");
    } else if (serviceOrder.product === ServiceOrderProduct.DIECUTBLOCK) {
      products.push("Forma");
    }

    if (serviceOrder.printerDetails?.finalArt) {
      products.push("Arte Final");
    }

    if (serviceOrder.printerDetails?.imageProcessing) {
      products.push("Tratamento de Imagem");
    }

    if (serviceOrder.printerDetails?.easyflow) {
      products.push("Easyflow");
    }

    if (serviceOrder.printerDetails?.quantityPrinter > 0) {
      products.push(
        `Printers: ${serviceOrder.printerDetails?.quantityPrinter}`,
      );
    }

    if (serviceOrder.printerDetails?.quantityProfileTest > 0) {
      products.push(
        `Prova: ${serviceOrder.printerDetails?.quantityProfileTest}`,
      );
    }

    const visibleProducts = showMore ? products : products.slice(0, 2);

    return (
      <div className="space-y-1 text-[10px] text-nowrap">
        {products.length > 0 ? (
          <>
            <div>
              {visibleProducts.map((product, index) => (
                <div key={index}>{product}</div>
              ))}
            </div>
            {products.length > 2 && (
              <button
                className="border border-gray-400 text-[10px] flex-shrink-0 px-1 py-[1px] flex rounded items-center gap-1 mt-2"
                onClick={() => setShowMore(!showMore)}
                title={showMore ? "Mostrar menos" : "Mostrar mais"}
              >
                <MoreHorizontal size={16} className="text-white" />
              </button>
            )}
          </>
        ) : (
          <div>Nenhum produto disponível</div>
        )}
      </div>
    );
  },
);
