import React from "react";
import { productTypeLabels } from "../../../../features/pcp/modals/pdfViewer/types";
import { Link } from "react-router-dom";
import ClicheCorrugatedStatCard from "./ClicheCorrugatedStatCard";
import DieCutBlockStatCard from "./DieCutBlockStatCard";

interface MeasureDetails {
  channel: number;
  international: number;
  national: number;
}

interface Stat {
  title: string;
  value: number;
  delta: number;
  measure?: number;
  measureDetails: MeasureDetails | null;
}

interface ClicheCorrugatedTotal {
  quantity: number;
  measures: {
    total: number;
  };
}

interface DieCutBlockTotal {
  quantity: number;
  measures: {
    channel: number;
    international: number;
    national: number;
    total: number;
  };
}

type StatsGridProps =
  | {
      product: "CLICHE_CORRUGATED";
      stats: Stat[];
      comparisonPeriod: string;
      showComparison?: boolean;
      totalGeneral?: ClicheCorrugatedTotal;
    }
  | {
      product: "DIECUTBLOCK";
      stats: Stat[];
      comparisonPeriod: string;
      showComparison?: boolean;
      totalGeneral?: DieCutBlockTotal;
    };

const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  comparisonPeriod,
  showComparison,
  product,
  totalGeneral,
}) => {
  const getKeyByValue = (
    obj: Record<string, string>,
    value: string,
  ): string | undefined => {
    return Object.keys(obj).find(
      (key) => obj[key].toLowerCase() === value.toLowerCase(),
    );
  };

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3`}>
      {product === "CLICHE_CORRUGATED" ? (
        <>
          {stats.map((stat) => {
            const productType = getKeyByValue(productTypeLabels, stat.title);

            return (
              <Link
                key={stat.title}
                to={`/pcp?product=${product}&productType=${productType}`}
              >
                <ClicheCorrugatedStatCard
                  {...stat}
                  comparisonPeriod={comparisonPeriod}
                  showComparison={showComparison}
                />
              </Link>
            );
          })}

          <div>
            <Link to={`/pcp?product=${product}`}>
              <ClicheCorrugatedStatCard
                totalMetricsCard={true}
                totalGeneral={totalGeneral}
              />
            </Link>
          </div>
        </>
      ) : (
        <>
          {stats.map((stat) => {
            const productType = getKeyByValue(productTypeLabels, stat.title);

            return (
              <Link
                key={stat.title}
                to={`/pcp?product=${product}&productType=${productType}`}
              >
                <DieCutBlockStatCard
                  {...stat}
                  comparisonPeriod={comparisonPeriod}
                  showComparison={showComparison}
                />
              </Link>
            );
          })}

          <div>
            <Link to={`/pcp?product=${product}`}>
              <DieCutBlockStatCard
                totalMetricsCard={true}
                totalGeneral={totalGeneral}
              />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsGrid;
