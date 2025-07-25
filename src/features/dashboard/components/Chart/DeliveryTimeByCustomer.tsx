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

interface DeliveryTimeByCustomerProps {
  deliveryTimeByCustomer: Record<string, { time: string; count: number }>;
}

export default function DeliveryTimeByCustomer({
  deliveryTimeByCustomer,
}: DeliveryTimeByCustomerProps) {
  const hasData = Object.keys(deliveryTimeByCustomer).length > 0;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center my-auto w-full">
        <p className="text-gray-400 text-center text-lg m-auto">
          Não há dados disponíveis para serem exibidos.
        </p>
      </div>
    );
  }

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":");
    return `${hours}h${minutes}min`;
  };

  const parseTimeToDecimal = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return parseFloat((hours + minutes / 60).toFixed(2));
  };

  const data = Object.entries(deliveryTimeByCustomer).map(
    ([name, { time, count }]) => ({
      name,
      tempoHoras: parseTimeToDecimal(time),
      tempoFormatado: formatTime(time),
      osCount: count,
    }),
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          label={{
            value: "Tempo (horas)",
            position: "insideBottom",
            offset: -15,
          }}
          tickFormatter={(value) => `${Math.round(value)}h`}
        />
        <YAxis type="category" dataKey="name" width={70} />
        <Tooltip
          formatter={(value) => [
            `${data.find((item) => item.tempoHoras === value)?.tempoFormatado} - ${data.find((item) => item.tempoHoras === value)?.osCount} OS`,
            "Prazo de Entrega",
          ]}
        />
        <Legend align="left" />
        <Bar
          dataKey="tempoHoras"
          name="Tempo Médio"
          fill="#0088FE"
          minPointSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
