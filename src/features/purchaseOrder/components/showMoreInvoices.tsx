import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";

interface InvoiceData {
  nfNumber: string;
}

interface ShowMoreInvoicesProps {
  invoices: InvoiceData[];
}

const ShowMoreInvoices = ({ invoices }: ShowMoreInvoicesProps) => {
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();

  const maxPerLine = 5;
  const firstLineOrders = invoices.slice(0, maxPerLine);
  const remainingOrders = invoices.slice(maxPerLine);

  return (
    <div className="space-y-2 text-xs max-w-72">
      <div className="flex flex-row items-center gap-2">
        {firstLineOrders.map((invoice) => (
          <button
            key={invoice.nfNumber}
            className="border border-gray-400 text-[12px] flex-shrink-0 px-1 flex rounded items-center gap-1"
            title="Ver Nota Fiscal"
            onClick={() => navigate(`/invoices?search=${invoice.nfNumber}`)}
          >
            {invoice.nfNumber}
          </button>
        ))}

        {invoices.length > maxPerLine && (
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
          {firstLineOrders.map((invoice) => (
            <button
              key={invoice.nfNumber}
              className="border border-gray-400 text-[12px] flex-shrink-0 px-1 flex rounded items-center gap-1"
              title="Ver Nota Fiscal"
              onClick={() => navigate(`/invoices?search=${invoice.nfNumber}`)}
            >
              {invoice.nfNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowMoreInvoices;
