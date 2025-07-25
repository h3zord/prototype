import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../components/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  delta: number;
  measure?: number;
  comparisonPeriod: string;
  showComparison?: boolean;
  product: "CLICHE_CORRUGATED" | "DIECUTBLOCK";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  delta,
  measure,
  comparisonPeriod,
  showComparison,
  product,
}) => (
  <Card className="shadow-md border-gray-600 transition-shadow hover:shadow-lg">
    <CardContent className="px-4 py-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-white">{title}</span>
        <span className="text-sm font-medium text-white">
          {product === "DIECUTBLOCK" ? "Metros lineares" : "Metros quadrados"}
        </span>
      </div>

      <div className="flex justify-between items-center mt-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-2xl font-bold text-white">
          {measure !== undefined
            ? new Intl.NumberFormat("pt-BR", {
                maximumFractionDigits: 3,
                minimumFractionDigits: 0,
              }).format(measure)
            : 0}
        </span>
      </div>

      {showComparison && (
        <p className="text-xs text-white opacity-80 mt-1">
          {delta >= 0 ? `+${delta}%` : `${delta}%`} em relação ao{" "}
          {comparisonPeriod}
        </p>
      )}
    </CardContent>
  </Card>
);

export default StatCard;
