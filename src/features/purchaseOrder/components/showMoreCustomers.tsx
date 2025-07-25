import { useState, useMemo } from "react";
import { MoreHorizontal } from "lucide-react";

interface ShowMoreCustomersProps {
  customers: { fantasyName: string }[];
}

const ShowMoreCustomers = ({ customers }: ShowMoreCustomersProps) => {
  const [showMore, setShowMore] = useState(false);

  const uniqueCustomers = useMemo(() => {
    return customers.filter(
      (customer, index, self) =>
        self.findIndex((c) => c.fantasyName === customer.fantasyName) === index,
    );
  }, [customers]);

  const maxPerLine = 2;

  const visibleCustomers = showMore
    ? uniqueCustomers
    : uniqueCustomers.slice(0, maxPerLine);

  return (
    <div className="text-[10px] space-y-1">
      {uniqueCustomers.length > 0 ? (
        <>
          {/* Renderizar todos os clientes, exceto o último */}
          {visibleCustomers.slice(0, -1).map((customer, index) => (
            <div key={index}>{customer.fantasyName}</div>
          ))}

          {/* Renderizar o último cliente e o botão na mesma linha */}
          {visibleCustomers.length > 0 && (
            <div className="flex items-center gap-2 text-[10px]">
              <div>
                {visibleCustomers[visibleCustomers.length - 1].fantasyName}
              </div>

              {uniqueCustomers.length > maxPerLine && (
                <button
                  className="border border-gray-400 text-xs flex-shrink-0 px-1 py-[1px] flex rounded items-center"
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
        <div>Nenhum cliente disponível</div>
      )}
    </div>
  );
};

export default ShowMoreCustomers;
