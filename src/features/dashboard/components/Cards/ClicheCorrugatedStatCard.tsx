import React from "react";
import { Card, CardContent } from "../../../../components/components/ui/card";

interface ClicheCorrugatedTotal {
  quantity: number;
  measures: {
    total: number;
  };
}

interface ClicheCorrugatedStatCardProps {
  title?: string;
  value?: number;
  delta?: number;
  measure?: number;
  comparisonPeriod?: string;
  showComparison?: boolean;
  totalGeneral?: ClicheCorrugatedTotal;
  totalMetricsCard?: boolean;
}

const ClicheCorrugatedStatCard: React.FC<ClicheCorrugatedStatCardProps> = ({
  title,
  value,
  delta = 0,
  measure,
  comparisonPeriod,
  showComparison,
  totalGeneral,
  totalMetricsCard = false,
}) => {
  const formatMeasures = (measure?: number): string => {
    if (!measure && measure !== 0) return "-";
    if (measure === 0) return "-";
    return new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    }).format(measure);
  };

  const displayData = {
    title: totalMetricsCard ? "Itens" : title,
    mainValue: totalMetricsCard ? totalGeneral?.quantity : value,
    areaMeasure: totalMetricsCard ? totalGeneral?.measures.total : measure,
  };

  return (
    <Card className="shadow-sm border-2 border-gray-600 hover:!bg-transparent hover:!shadow-sm transition-none">
      <CardContent className="p-3 h-full flex flex-col">
        <div className="text-center h-5 flex items-center justify-center">
          {totalMetricsCard ? (
            <div className="text-sm font-bold text-white">Métricas Totais</div>
          ) : showComparison && comparisonPeriod ? (
            <span className="text-white text-xs">
              <span
                className={`${delta >= 0 ? "text-green-300" : "text-red-300"}`}
              >
                {delta >= 0 ? `+${delta}%` : `${delta}%`}
              </span>{" "}
              vs {comparisonPeriod}
            </span>
          ) : null}
        </div>

        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium truncate text-white">
              {displayData.title}
            </div>
            <div className="text-xl font-bold text-white mt-0.5">
              {displayData.mainValue || 0}
            </div>
          </div>
          <div className="text-right ml-2">
            <div className="text-[12px] font-medium text-white">
              M. Quadrados
            </div>
            <div className="text-xl font-bold text-white mt-0.5">
              {formatMeasures(displayData.areaMeasure)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClicheCorrugatedStatCard;
