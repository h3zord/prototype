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

interface SalesByRepresentativeProps {
  product: "CLICHE_CORRUGATED" | "DIECUTBLOCK";
  data: Record<
    string,
    | Record<string, { area: number; quantity: number }>
    | { meters: number; quantity: number }
  >;
}

export default function SalesByRepresentative({
  data,
  product,
}: SalesByRepresentativeProps) {
  const hasData = Object.keys(data).length > 0;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center my-auto w-full">
        <p className="text-gray-400 text-center text-lg m-auto">
          Não há vendas associadas aos representantes ou não há representantes
          associados aos clientes
        </p>
      </div>
    );
  }

  const isMeters = product === "DIECUTBLOCK";
  const unitLabel = isMeters ? "m" : "m²";

  const thicknessKeys = Array.from(
    new Set(
      Object.values(data).flatMap((repData) =>
        "meters" in repData ? ["Metros lineares"] : Object.keys(repData),
      ),
    ),
  );

  const chartData = Object.entries(data).map(([representative, innerData]) => {
    const entry: any = { name: representative };

    if ("meters" in innerData) {
      entry["Metros lineares"] = innerData.meters;
      entry["Metros lineares_quantity"] = innerData.quantity;
    } else {
      for (const [thickness, values] of Object.entries(innerData)) {
        entry[thickness] = values.area;
        entry[`${thickness}_quantity`] = values.quantity;
      }
    }

    return entry;
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          width={60}
          label={{
            value: `Área (${unitLabel})`,
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip
          formatter={(value: any, name: string, props: any) => {
            const { payload } = props;
            const quantity = payload?.[`${name}_quantity`];
            const formatted = Number(value).toLocaleString("pt-BR", {
              maximumFractionDigits: 3,
              minimumFractionDigits: 0,
            });
            return [`${formatted} ${unitLabel} (${quantity ?? 0} OS)`, name];
          }}
          labelFormatter={(label) => `Representante: ${label}`}
        />
        <Legend />
        {thicknessKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            name={key}
            fill={getColor(index)}
            minPointSize={20}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function getColor(index: number) {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#d84c6a", "#8dd1e1"];
  return colors[index % colors.length];
}
