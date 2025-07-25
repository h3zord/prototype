import React from "react";
import { Card, CardContent } from "../../../../components/components/ui/card";

interface DieCutBlockTotal {
  quantity: number;
  measures: {
    channel: number;
    international: number;
    national: number;
    total: number;
  };
}

interface MeasureDetails {
  channel: number;
  international: number;
  national: number;
}

interface DieCutBlockStatCardProps {
  title?: string;
  value?: number;
  delta?: number;
  measure?: number;
  measureDetails?: MeasureDetails | null;
  comparisonPeriod?: string;
  showComparison?: boolean;
  totalGeneral?: DieCutBlockTotal;
  totalMetricsCard?: boolean;
}

const DieCutBlockStatCard: React.FC<DieCutBlockStatCardProps> = ({
  title,
  value,
  delta = 0,
  measure,
  measureDetails,
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
    linearMeasure: totalMetricsCard ? totalGeneral?.measures.total : measure,
    channel: totalMetricsCard
      ? totalGeneral?.measures.channel
      : measureDetails?.channel,
    national: totalMetricsCard
      ? totalGeneral?.measures.national
      : measureDetails?.national,
    international: totalMetricsCard
      ? totalGeneral?.measures.international
      : measureDetails?.international,
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

        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-white font-medium truncate">
              {displayData.title}
            </div>
            <div className="text-xl font-bold text-white mt-0.5">
              {displayData.mainValue || 0}
            </div>
          </div>
          <div className="text-right ml-2">
            <div className="text-xs font-medium text-white">M. Lineares</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {formatMeasures(displayData.linearMeasure)}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mb-2"></div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center">
              <span className="text-white font-medium mr-1">Calhas:</span>
              <span className="text-white font-bold">
                {formatMeasures(displayData.channel)}
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-white font-medium mr-1">
                Faca Nacional:
              </span>
              <span className="text-white font-bold">
                {formatMeasures(displayData.national)}
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-white font-medium mr-1">
                Faca Importada:
              </span>
              <span className="text-white font-bold">
                {formatMeasures(displayData.international)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DieCutBlockStatCard;
