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

interface ProductionByOperatorItemsProps {
  data: Record<string, number>;
}

export default function ProductionByOperatorItems({
  data,
}: ProductionByOperatorItemsProps) {
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

  const chartData = Object.entries(data).map(([name, items]) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    const percentual = total > 0 ? ((items / total) * 100).toFixed(1) : "0";
    return {
      name,
      items,
      percentual,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={100} />
        <Tooltip
          formatter={(value, name, props) => {
            if (name === "items")
              return [
                `${value} itens (${props.payload.percentual}%)`,
                "Quantidade",
              ];
            return [value, name];
          }}
        />
        <Legend />
        <Bar
          dataKey="items"
          name="Quantidade"
          fill="#8884d8"
          minPointSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
