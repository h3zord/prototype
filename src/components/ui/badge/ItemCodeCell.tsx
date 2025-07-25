import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

interface ItemCodeCellProps {
  serviceOrder: {
    itemCodeOnCustomer?: string;
    printerDetails?: {
      itemCliche?: string;
      itemDieCutBlockInCliche?: string;
    };
    dieCutBlockDetails?: {
      itemDieCutBlock?: string;
    };
    purchaseOrder?: string;
  };
}

export const ItemCodeCell = ({ serviceOrder }: ItemCodeCellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Verifica se há pelo menos uma informação para mostrar
  const hasInfo = !!(
    serviceOrder.itemCodeOnCustomer ||
    serviceOrder.printerDetails?.itemCliche ||
    serviceOrder.dieCutBlockDetails?.itemDieCutBlock ||
    serviceOrder.printerDetails?.itemDieCutBlockInCliche ||
    serviceOrder.purchaseOrder
  );

  // Fecha o dropdown quando clica fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Se não há informações, não mostra nada
  if (!hasInfo) {
    return null;
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Botão do ícone */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-600 rounded transition-colors duration-200 group"
        title="Ver códigos e informações"
      >
        <Info
          size={14}
          className="text-white group-hover:text-gray-200 transition-colors duration-200"
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-xl min-w-32 max-w-64">
          <div className="p-2 space-y-2">
            {serviceOrder.itemCodeOnCustomer && (
              <div className="text-[12px] text-nowrap border rounded px-2 py-1 border-gray-600 bg-gray-700">
                <span className="font-medium text-white">Cliente:</span>{" "}
                {serviceOrder.itemCodeOnCustomer}
              </div>
            )}

            {serviceOrder.printerDetails?.itemCliche && (
              <div className="text-[12px] text-nowrap border rounded px-2 py-1 border-gray-600 bg-gray-700">
                <span className="font-medium text-white">Clichê:</span>{" "}
                {serviceOrder.printerDetails.itemCliche}
              </div>
            )}

            {serviceOrder.dieCutBlockDetails?.itemDieCutBlock && (
              <div className="text-[12px] text-nowrap border rounded px-2 py-1 border-gray-600 bg-gray-700">
                <span className="font-medium text-white">Forma:</span>{" "}
                {serviceOrder.dieCutBlockDetails.itemDieCutBlock}
              </div>
            )}

            {serviceOrder.printerDetails?.itemDieCutBlockInCliche && (
              <div className="text-[12px] text-nowrap border rounded px-2 py-1 border-gray-600 bg-gray-700">
                <span className="font-medium text-white">Forma:</span>{" "}
                {serviceOrder.printerDetails.itemDieCutBlockInCliche}
              </div>
            )}

            {serviceOrder.purchaseOrder && (
              <div className="text-[12px] text-nowrap border rounded px-2 py-1 border-gray-600 bg-gray-700">
                <span className="font-medium text-white">OC:</span>{" "}
                {serviceOrder.purchaseOrder}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
