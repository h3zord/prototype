import { useState } from "react";
import { Customer, Product } from "../../../types/models/customer";
import { formatPrice } from "../../../helpers/formatter";
import { MoreHorizontal } from "lucide-react";

const ShowMorePrices = ({ customer }: { customer: Customer }) => {
  const [showMore, setShowMore] = useState(false);

  const productPrices = [
    {
      product: Product.CLICHE_CORRUGATED,
      label: "Clichê Corrug.",
      price: customer.clicheCorrugatedPrice,
    },
    // {
    //   product: Product.CLICHE_REFORM,
    //   label: "Reforma Clichê.",
    //   price: customer.clicheReformPrice,
    // },
    {
      product: Product.CLICHE_REPAIR,
      label: "Conserto Clichê.",
      price: customer.clicheRepairPrice,
    },
    {
      product: Product.CLICHE_REASSEMBLY,
      label: "Remontagem.",
      price: customer.clicheReAssemblyPrice,
    },
    {
      product: Product.DIECUTBLOCK_NATIONAL,
      label: "Forma Nacional",
      price: customer.dieCutBlockNationalPrice,
    },
    {
      product: Product.DIECUTBLOCK_IMPORTED,
      label: "Forma Importada",
      price: customer.dieCutBlockImportedPrice,
    },
    {
      product: Product.EASYFLOW,
      label: "Easyflow",
      price: customer.easyflowPrice,
    },
    {
      product: Product.FINAL_ART,
      label: "Arte Final",
      price: customer.finalArtPrice,
    },
    {
      product: Product.IMAGE_PROCESSING,
      label: "Trat. Imagem",
      price: customer.imageProcessingPrice,
    },
    {
      product: Product.PRINTING,
      label: "Printer",
      price: customer.printingPrice,
    },
    {
      product: Product.PROFILE_PROOF_ICC,
      label: "Prova ICC",
      price: customer.profileProofIccPrice,
    },
  ];

  // Filter products the customer actually has
  const filteredPrices = productPrices.filter(({ product }) =>
    customer.products.includes(product),
  );

  // Limit the visible prices based on "showMore" state
  const visiblePrices = showMore ? filteredPrices : filteredPrices.slice(0, 2);

  return (
    <div className="text-[10px] space-y-1">
      {filteredPrices.length > 0 ? (
        <>
          {/* Render all prices except the last one */}
          {visiblePrices.slice(0, -1).map(({ product, label, price }) => (
            <div key={product}>
              {`${label}: ${formatPrice({
                price,
                digits: [
                  Product.CLICHE_CORRUGATED,
                  Product.DIECUTBLOCK_NATIONAL,
                  Product.DIECUTBLOCK_IMPORTED,
                  Product.CLICHE_REASSEMBLY,
                ].includes(product)
                  ? 3
                  : 2,
              })}`}
            </div>
          ))}

          {/* Render the last price and the button in the same line */}
          {visiblePrices.length > 0 && (
            <div className="flex items-center gap-2">
              <div>
                {`${visiblePrices[visiblePrices.length - 1].label}: ${formatPrice(
                  {
                    price: visiblePrices[visiblePrices.length - 1].price,
                    digits: [
                      Product.CLICHE_CORRUGATED,
                      Product.DIECUTBLOCK_NATIONAL,
                      Product.DIECUTBLOCK_IMPORTED,
                      Product.CLICHE_REASSEMBLY,
                    ].includes(visiblePrices[visiblePrices.length - 1].product)
                      ? 3
                      : 2,
                  },
                )}`}
              </div>

              {filteredPrices.length > 2 && (
                <button
                  className="border border-gray-400 text-[12px] flex-shrink-0 px-1 py-[1px] flex rounded items-center"
                  onClick={() => setShowMore(!showMore)}
                  title={showMore ? "Mostrar menos" : "Mostrar mais"}
                >
                  <MoreHorizontal size={16} className="text-white" />
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <div>Nenhum preço disponível</div>
      )}
    </div>
  );
};

export default ShowMorePrices;
