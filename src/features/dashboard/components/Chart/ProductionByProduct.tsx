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
import {
  productTypeCorrugatedClicheOptions,
  productTypeDieCutBlockOptions,
} from "../../../../helpers/options/serviceorder";
import { ServiceOrderProductType } from "../../../../types/models/serviceorder";
import { useEffect, useState } from "react";

interface ProductionByProductProps {
  data: Record<string, number>;
  product: "CLICHE_CORRUGATED" | "DIECUTBLOCK";
}

export default function ProductionByProduct({
  data,
  product,
}: ProductionByProductProps) {
  const [filteredData, setFilteredData] = useState<Record<string, number>>({});

  const hasData = Object.keys(data).length > 0;

  useEffect(() => {
    if (!hasData) return;

    const clicheCorrugatedKeys = productTypeCorrugatedClicheOptions.map(
      (option) => option.value,
    );

    const dieCutBlockKeys = productTypeDieCutBlockOptions.map(
      (option) => option.value,
    );

    const validKeys =
      product === "CLICHE_CORRUGATED" ? clicheCorrugatedKeys : dieCutBlockKeys;

    setFilteredData(
      Object.fromEntries(
        Object.entries(data).filter(([key]) =>
          validKeys.includes(key as ServiceOrderProductType),
        ),
      ),
    );
  }, [product, data, hasData]);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center my-auto w-full">
        <p className="text-gray-400 text-center text-sm m-auto">
          Não há dados disponíveis para serem exibidos.
        </p>
      </div>
    );
  }

  const formattedData = [
    Object.entries(filteredData).reduce(
      (acc, [key, value]) => {
        acc[key.toLowerCase()] = value;
        return acc;
      },
      { name: "Produção Total" } as Record<string, any>,
    ),
  ];

  const barColors: Record<string, string> = {
    alteration: "#8884d8",
    new: "#82ca9d",
    reassembly: "#ffc658",
    reconfection: "#ff8042",
    repair: "#d771c4",
    replacement: "#e74c3c",
    reprint: "#a4de6c",
  };

  const barNames: Record<string, string> = {
    alteration: "Alteração",
    new: "Novo",
    repair: "Conserto",
    replacement: "Reposição",
    reprint: "Regravação",
    reassembly: "Remontagem",
    reconfection: "Reconfecção",
  };

  const allKeys = Object.keys(filteredData).map((key) => key.toLowerCase());

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {allKeys.map((key) => (
          <Bar
            key={barNames[key] || key}
            dataKey={key}
            name={barNames[key] || key}
            fill={barColors[key] || "#8884d8"}
            minPointSize={20}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
