"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ProductionByOperatorAreaProps {
  product: "CLICHE_CORRUGATED" | "DIECUTBLOCK";
  data: Record<string, number>;
}

export default function ProductionByOperatorArea({
  product,
  data,
}: ProductionByOperatorAreaProps) {
  const hasData = Object.keys(data).length > 0;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center my-auto w-full">
        <p className="text-gray-400 text-center text-lg m-auto">
          Não há dados disponíveis para serem exibidos.
        </p>
      </div>
    );
  }

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value: value,
    displayValue: value.toLocaleString("pt-BR", {
      maximumFractionDigits: 3,
      minimumFractionDigits: 0,
    }),
    percentual: total > 0 ? ((value / total) * 100).toFixed(1) : "0",
  }));

  const unit = product === "CLICHE_CORRUGATED" ? "m²" : "m";
  const chartLabel = product === "CLICHE_CORRUGATED" ? "Área" : "Comprimento";

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={100} />
        <Tooltip
          formatter={(_value, _name, props) => {
            const displayValue = `${props.payload.displayValue} ${unit}`;
            const extra = ` (${props.payload.percentual}%)`;

            return [`${displayValue}${extra}`, chartLabel];
          }}
        />
        <Legend />
        <Bar
          dataKey="value"
          name={`${chartLabel} (${unit})`}
          fill="#82ca9d"
          minPointSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
