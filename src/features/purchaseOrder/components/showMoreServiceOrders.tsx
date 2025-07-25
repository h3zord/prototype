import { UnitWithColor } from "../../../components/ui/badge/UnitWithColor";
import { useState } from "react";
import { Unit } from "../../../types/models/customer";
import { MoreHorizontal } from "lucide-react";

interface ServiceOrder {
  id: string;
  unit: Unit;
  identificationNumber: string;
}

interface ShowMoreButtonsProps {
  serviceOrders: ServiceOrder[];
  onClick: (serviceOrder: ServiceOrder) => void;
}

const ShowMoreServiceOrders = ({
  serviceOrders,
  onClick,
}: ShowMoreButtonsProps) => {
  const [showMore, setShowMore] = useState(false);

  const maxPerLine = 5;
  const firstLineOrders = serviceOrders.slice(0, maxPerLine);
  const remainingOrders = serviceOrders.slice(maxPerLine);

  return (
    <div className="space-y-2 text-xs max-w-72">
      <div className="flex flex-row items-center gap-2">
        {firstLineOrders.map((order) => (
          <button
            key={order.id}
            className="border border-gray-400 text-[12px] flex-shrink-0 px-1 flex rounded items-center gap-1"
            onClick={() => onClick(order)}
            title="Ver PDF"
          >
            <UnitWithColor unit={order.unit} />
            {order.identificationNumber}
          </button>
        ))}

        {serviceOrders.length > maxPerLine && (
          <button
            className="border border-gray-400 text-[12px] flex-shrink-0 px-1 py-[1px] flex rounded items-center gap-1 text-white"
            onClick={() => setShowMore(!showMore)}
            title={showMore ? "Mostrar menos" : "Mostrar mais"}
          >
            <MoreHorizontal size={16} className="text-white" />
          </button>
        )}
      </div>

      {showMore && remainingOrders.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {remainingOrders.map((order) => (
            <button
              key={order.id}
              className="border border-gray-400 text-[12px] px-1 flex rounded items-center gap-1"
              onClick={() => onClick(order)}
              title="Ver PDF"
            >
              <UnitWithColor unit={order.unit} />
              {order.identificationNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowMoreServiceOrders;
