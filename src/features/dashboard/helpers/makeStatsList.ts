import { CardStats, ProductTypeMetrics } from "../api/services";

interface MakeStatsListProps {
  cardStats: {
    CLICHE_CORRUGATED: CardStats;
    DIECUTBLOCK: CardStats;
    comparedTo: ProductTypeMetrics;
  };
  product: "CLICHE_CORRUGATED" | "DIECUTBLOCK";
}

const productTypeLabels = {
  new: "Novo",
  alteration: "Alteração",
  reprint: "Regravação",
  replacement: "Reposição",
  reassembly: "Remontagem",
  repair: "Conserto",
  reconfection: "Reconfecção",
};

export function makeStatsList({ cardStats, product }: MakeStatsListProps) {
  const excludedKeys =
    product === "CLICHE_CORRUGATED"
      ? ["reconfection", "test"]
      : ["reassembly", "reprint", "test"];

  let filteredEntries;

  if (product === "CLICHE_CORRUGATED") {
    filteredEntries = Object.entries(cardStats.CLICHE_CORRUGATED).filter(
      ([key]) => !excludedKeys.includes(key),
    );
  } else {
    filteredEntries = Object.entries(cardStats.DIECUTBLOCK).filter(
      ([key]) => !excludedKeys.includes(key),
    );
  }

  const cardStatList = filteredEntries.map(([key, value]) => ({
    title: productTypeLabels[key as keyof typeof productTypeLabels],
    value: value.current,
    delta: value.diffPct != null ? Number(value.diffPct) : 0,
    measure: value.measure ?? undefined,
    measureDetails: value.measureDetails
      ? {
          channel: value.measureDetails.channel,
          national: value.measureDetails.national,
          international: value.measureDetails.international,
        }
      : null,
  }));

  return cardStatList;
}
