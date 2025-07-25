import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";

interface ShowMoreButtonsProps {
  purchaseOrders: string[];
}

const ShowMorePurchaseOrders = ({ purchaseOrders }: ShowMoreButtonsProps) => {
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();

  const maxPerLine = 5;
  const firstLineOrders = purchaseOrders.slice(0, maxPerLine);
  const remainingOrders = purchaseOrders.slice(maxPerLine);

  return (
    <div className="space-y-2 text-xs max-w-72">
      <div className="flex flex-row items-center gap-2">
        {firstLineOrders.length
          ? firstLineOrders.map((po) => (
              <button
                key={po}
                onClick={() => navigate(`/purchaseOrder?search=${po}`)}
                title="Ver Order de Compra"
                className="text-[12px] border text-nowrap border-gray-400 w-fit px-1 flex rounded items-center gap-1"
              >
                {po}
              </button>
            ))
          : "-"}

        {purchaseOrders.length > maxPerLine && (
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
          {firstLineOrders.length
            ? firstLineOrders.map((po) => (
                <button
                  key={po}
                  onClick={() => navigate(`/purchaseOrder?search=${po}`)}
                  title="Ver Order de Compra"
                  className="text-[12px] border text-nowrap border-gray-400 w-fit px-1 flex rounded items-center gap-1"
                >
                  {po}
                </button>
              ))
            : "-"}
        </div>
      )}
    </div>
  );
};

export default ShowMorePurchaseOrders;
