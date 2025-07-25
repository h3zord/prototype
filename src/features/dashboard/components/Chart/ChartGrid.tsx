import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../../../../components/components/ui/card";
import { FiltersMapped } from "../Viewer/DashboardViewer";
import DeliveryTimeByCustomer from "./DeliveryTimeByCustomer";
import OperationTimeByCustomer from "./OperationTimeByCustomer";
import ProductionByCustomer from "./ProductionByCustomer";
import ProductionByOperatorArea from "./ProductionByOperatorArea";
import ProductionByOperatorItems from "./ProductionByOperatorItems";
import ProductionByProduct from "./ProductionByProduct";
import ProductionTimeByCustomer from "./ProductionTimeByCustomer";
import SalesByRepresentative from "./SalesByRepresentative";
import TimeByStatus from "./TimeByStatus";
// import SalesByRepresentative from "./SalesByRepresentative";
// import TimeByStatus from "./TimeByStatus";

interface ChartGridProps {
  product: "CLICHE_CORRUGATED" | "DIECUTBLOCK";
  filters: FiltersMapped;
  productionByProduct: Record<string, any> | undefined;
  productionByOperator:
    | {
        quantity: Record<string, number>;
        area?: Record<string, number>;
      }
    | undefined;
  productionByCustomer: Record<string, number> | undefined;
  productionTimeByCustomer:
    | Record<string, { time: string; count: number }>
    | undefined;
  operationTimeByCustomer:
    | Record<
        string,
        {
          CLICHE_CORRUGATED: Record<string, string>;
          DIECUTBLOCK: Record<string, string>;
        }
      >
    | undefined;
  deliveryTimeByCustomer:
    | Record<string, { count: number; time: string }>
    | undefined;
  salesByRepresentative?: Record<
    string,
    Record<
      string,
      {
        area: number;
        quantity: number;
      }
    >
  >;
  statusDurationByCustomer?: {
    CLICHE_CORRUGATED?: Record<
      string, // cliente
      Record<
        string, // status
        { time: string; count: number }
      >
    >;
    DIECUTBLOCK?: Record<
      string,
      Record<string, { time: string; count: number }>
    >;
  };
}

export function ChartGrid({
  product,
  filters,
  productionByProduct,
  productionByOperator,
  productionByCustomer,
  productionTimeByCustomer,
  operationTimeByCustomer,
  deliveryTimeByCustomer,
  salesByRepresentative,
  statusDurationByCustomer,
}: ChartGridProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
        <Card className="col-span-4 border-gray-600 shadow-md">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              Produção por Produto
            </CardTitle>
            <CardDescription className="text-white opacity-90 text-[12px]">
              Quantidade de unidades produzidas por produto
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ProductionByProduct
              data={productionByProduct ?? {}}
              product={product}
            />
          </CardContent>
        </Card>

        <Card className="col-span-4 border-gray-600 shadow-md">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              Produção por Operador (Itens)
            </CardTitle>
            <CardDescription className="text-white opacity-90 text-[12px]">
              Quantidade de unidades produzidas por operador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductionByOperatorItems
              data={productionByOperator?.quantity ?? {}}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3 border-gray-600 shadow-md">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              Produção por Cliente
            </CardTitle>
            <CardDescription className="text-white opacity-90 text-[12px]">
              Quantidade de unidades produzidas por cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductionByCustomer data={productionByCustomer ?? {}} />
          </CardContent>
        </Card>

        <Card className="col-span-4 border-gray-600 shadow-md">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              Produção por Operador (Área)
            </CardTitle>
            <CardDescription className="text-white opacity-90 text-[12px]">
              {product === "CLICHE_CORRUGATED"
                ? "Quantidade de metros quadrados produzidos por operador"
                : "Quantidade de metros lineares produzidos por operador"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductionByOperatorArea
              product={product}
              data={productionByOperator?.area ?? {}}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-gray-600 shadow-md">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              Prazo Médio de Entrega por Operação
            </CardTitle>
            <CardDescription className="text-white opacity-90 text-[12px]">
              Tempo entre a criação da OS e o despacho
            </CardDescription>
          </CardHeader>

          <CardContent>
            <OperationTimeByCustomer
              product={product}
              operationTimeByCustomer={operationTimeByCustomer ?? {}}
              filters={filters}
            />
          </CardContent>
        </Card>

        <Card className="col-span-3 border-gray-600 shadow-md">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              Prazo Médio de Produção por Cliente
            </CardTitle>
            <CardDescription className="text-white opacity-90 text-[12px]">
              Tempo entre a criação da OS até a data de faturamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductionTimeByCustomer
              data={productionTimeByCustomer ?? {}}
              filters={filters}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
        <Card className="col-span-4 border-gray-600 shadow-md">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              Vendas por Representante
            </CardTitle>
            <CardDescription className="text-white opacity-90 text-[12px]">
              {product === "CLICHE_CORRUGATED"
                ? "Quantidade de metros quadrados comercializados por representante"
                : "Quantidade de metros lineares comercializados por representante"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesByRepresentative
              data={salesByRepresentative ?? {}}
              product={product}
            />
          </CardContent>
        </Card>

        <Card className="col-span-4 border-gray-600 shadow-md">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              Prazo Médio em Status por OS
            </CardTitle>
            <CardDescription className="text-white opacity-90 text-[12px]">
              Tempo médio de cada OS em cada status do processo
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TimeByStatus
              product={product}
              statusDurationByCustomer={statusDurationByCustomer}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="border-gray-600 shadow-md">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              Prazo Médio de Entrega por Cliente
            </CardTitle>
            <CardDescription className="text-white opacity-90 text-[12px]">
              Tempo entre a criação da OS e o despacho
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeliveryTimeByCustomer
              deliveryTimeByCustomer={deliveryTimeByCustomer ?? {}}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
